import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineRestore,
} from "react-icons/md";
import { toast } from "sonner";
import Title from "../components/Title";
import Button from "../components/Button";
import { PRIOTITYSTYELS, TASK_TYPE } from "../utils";
import ConfirmatioDialog from "../components/Dialogs";
import { apiUrl } from "../utils/apiBase.js";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Trash = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("delete");
  const [selected, setSelected] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrashed = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(apiUrl("/task?isTrashed=true"), {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to load trash");
        return;
      }
      setTasks(data?.tasks || []);
    } catch (e) {
      toast.error("Could not load trashed tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrashed();
  }, [fetchTrashed]);

  const deleteAllClick = () => {
    setType("deleteAll");
    setMsg("Do you want to permanently delete all items?");
    setOpenDialog(true);
  };

  const restoreAllClick = () => {
    setType("restoreAll");
    setMsg("Do you want to restore all items in the trash?");
    setOpenDialog(true);
  };

  const deleteClick = (id) => {
    setType("delete");
    setSelected(id);
    setMsg("Permanently delete this task?");
    setOpenDialog(true);
  };

  const restoreClick = (id) => {
    setSelected(id);
    setType("restore");
    setMsg("Do you want to restore the selected item?");
    setOpenDialog(true);
  };

  const deleteRestoreHandler = async () => {
    try {
      let res;
      if (type === "delete") {
        res = await fetch(
          apiUrl(`/task/delete-restore/${selected}?actionType=delete`),
          { method: "DELETE", credentials: "include" }
        );
      } else if (type === "restore") {
        res = await fetch(
          apiUrl(`/task/delete-restore/${selected}?actionType=restore`),
          { method: "DELETE", credentials: "include" }
        );
      } else if (type === "deleteAll") {
        res = await fetch(apiUrl("/task/delete-restore?actionType=deleteAll"), {
          method: "DELETE",
          credentials: "include",
        });
      } else if (type === "restoreAll") {
        res = await fetch(
          apiUrl("/task/delete-restore?actionType=restoreAll"),
          { method: "DELETE", credentials: "include" }
        );
      }
      const data = res ? await res.json() : {};
      if (!res?.ok) {
        toast.error(data.message || "Operation failed");
        return;
      }
      toast.success(data.message || "Done");
      setOpenDialog(false);
      setMsg(null);
      fetchTrashed();
    } catch (e) {
      toast.error("Request failed");
    }
  };

  const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black  text-left'>
        <th className='py-2'>Task Title</th>
        <th className='py-2'>Priority</th>
        <th className='py-2'>Stage</th>
        <th className='py-2 line-clamp-1'>Modified On</th>
        <th className='py-2' />
      </tr>
    </thead>
  );

  const TableRow = ({ item }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
      <td className='py-2'>
        <div className='flex items-center gap-2'>
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[item.stage])}
          />
          <p className='w-full line-clamp-2 text-base text-black'>
            {item?.title}
          </p>
        </div>
      </td>

      <td className='py-2 capitalize'>
        <div className={"flex gap-1 items-center"}>
          <span className={clsx("text-lg", PRIOTITYSTYELS[item?.priority])}>
            {ICONS[item?.priority]}
          </span>
          <span className=''>{item?.priority}</span>
        </div>
      </td>

      <td className='py-2 capitalize text-center md:text-start'>
        {item?.stage}
      </td>
      <td className='py-2 text-sm'>{new Date(item?.date).toDateString()}</td>

      <td className='py-2 flex gap-1 justify-end'>
        <Button
          icon={<MdOutlineRestore className='text-xl text-gray-500' />}
          onClick={() => restoreClick(item._id)}
        />
        <Button
          icon={<MdDelete className='text-xl text-red-600' />}
          onClick={() => deleteClick(item._id)}
        />
      </td>
    </tr>
  );

  if (loading) {
    return (
      <div className='p-8 text-center text-gray-500'>Loading trash…</div>
    );
  }

  return (
    <>
      <div className='w-full md:px-1 px-0 mb-6'>
        <div className='flex items-center justify-between mb-8'>
          <Title title='Trashed Tasks' />

          <div className='flex gap-2 md:gap-4 items-center'>
            <Button
              label='Restore All'
              icon={<MdOutlineRestore className='text-lg hidden md:flex' />}
              className='flex flex-row-reverse gap-1 items-center  text-black text-sm md:text-base rounded-md 2xl:py-2.5'
              onClick={() => restoreAllClick()}
            />
            <Button
              label='Delete All'
              icon={<MdDelete className='text-lg hidden md:flex' />}
              className='flex flex-row-reverse gap-1 items-center  text-red-600 text-sm md:text-base rounded-md 2xl:py-2.5'
              onClick={() => deleteAllClick()}
            />
          </div>
        </div>
        <div className='bg-white px-2 md:px-6 py-4 shadow-md rounded'>
          <div className='overflow-x-auto'>
            <table className='w-full mb-5'>
              <TableHeader />
              <tbody>
                {tasks?.length ? (
                  tasks.map((tk) => <TableRow key={tk._id} item={tk} />)
                ) : (
                  <tr>
                    <td colSpan={5} className='py-8 text-center text-gray-500'>
                      No trashed tasks
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        msg={msg}
        setMsg={setMsg}
        type={type}
        setType={setType}
        onClick={() => deleteRestoreHandler()}
      />
    </>
  );
};

export default Trash;
