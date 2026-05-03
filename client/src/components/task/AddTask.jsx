import React, { useEffect, useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import UserList from "./UserList";
import SelectList from "../SelectList";
import { BiImages } from "react-icons/bi";
import Button from "../Button";
import { useSelector } from "react-redux";
import { apiUrl } from "../../utils/apiBase.js";
import { toast } from "sonner";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORIRY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const apiStageToList = (stage) => {
  if (!stage) return LISTS[0];
  if (stage === "in progress") return "IN PROGRESS";
  return stage.toUpperCase();
};

const apiPriorityToList = (p) => {
  if (!p) return PRIORIRY[2];
  return p.toUpperCase();
};

const AddTask = ({ open, setOpen, refetch, task: existingTask }) => {
  const { user } = useSelector((state) => state.auth);
  const isEdit = Boolean(existingTask?._id);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [team, setTeam] = useState([]);
  const [stage, setStage] = useState(LISTS[0]);
  const [priority, setPriority] = useState(PRIORIRY[2]);
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open || !existingTask) return;
    reset({
      title: existingTask.title,
      date: existingTask.date
        ? new Date(existingTask.date).toISOString().slice(0, 10)
        : "",
    });
    setStage(apiStageToList(existingTask.stage));
    setPriority(apiPriorityToList(existingTask.priority));
    setTeam(
      (existingTask.team || []).map((m) =>
        typeof m === "object" ? m._id : m
      )
    );
    setAssets(existingTask.assets || []);
  }, [open, existingTask, reset]);

  useEffect(() => {
    if (!open && !isEdit) {
      reset({ title: "", date: "" });
      setTeam([]);
      setStage(LISTS[0]);
      setPriority(PRIORIRY[2]);
      setAssets([]);
    }
  }, [open, isEdit, reset]);

  const submitHandler = async (data) => {
    try {
      setUploading(true);
      const taskData = {
        title: data.title,
        date: data.date,
        team,
        stage: stage.toLowerCase(),
        priority: priority.toLowerCase(),
        assets: Array.isArray(assets) ? assets : [],
      };

      const url = isEdit
        ? apiUrl(`/task/update/${existingTask._id}`)
        : apiUrl("/task/create");
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user?.token
            ? { Authorization: `Bearer ${user.token}` }
            : {}),
        },
        credentials: "include",
        body: JSON.stringify(taskData),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(
          result?.message ||
            (isEdit ? "Task updated" : "Task created successfully!")
        );
        setOpen(false);
        refetch && refetch();
        if (!refetch) window.location.reload();
      } else {
        toast.error(result?.message || "Request failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  const handleSelect = (e) => {
    setAssets(e.target.files);
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            {isEdit ? "EDIT TASK" : "ADD TASK"}
          </Dialog.Title>

          <div className='mt-2 flex flex-col gap-6'>
            <Textbox
              placeholder='Task Title'
              type='text'
              name='title'
              label='Task Title'
              className='w-full rounded'
              register={register("title", { required: "Title is required" })}
              error={errors.title ? errors.title.message : ""}
            />

            <UserList setTeam={setTeam} team={team} />

            <div className='flex gap-4'>
              <SelectList
                label='Task Stage'
                lists={LISTS}
                selected={stage}
                setSelected={setStage}
              />
              <div className='w-full'>
                <Textbox
                  placeholder='Date'
                  type='date'
                  name='date'
                  label='Task Date'
                  className='w-full rounded'
                  register={register("date", {
                    required: "Date is required!",
                  })}
                  error={errors.date ? errors.date.message : ""}
                />
              </div>
            </div>

            <div className='flex gap-4'>
              <SelectList
                label='Priority Level'
                lists={PRIORIRY}
                selected={priority}
                setSelected={setPriority}
              />
              <div className='w-full flex items-center justify-center mt-4'>
                <label
                  className='flex items-center gap-1 text-base cursor-pointer my-4'
                  htmlFor='imgUpload'
                >
                  <input
                    type='file'
                    className='hidden'
                    id='imgUpload'
                    onChange={handleSelect}
                    accept='.jpg, .png, .jpeg'
                    multiple={true}
                  />
                  <BiImages />
                  <span>Add Assets</span>
                </label>
              </div>
            </div>

            <div className='bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4'>
              {uploading ? (
                <span className='text-sm py-2 text-red-500'>
                  {isEdit ? "Saving…" : "Creating task…"}
                </span>
              ) : (
                <Button
                  label='Submit'
                  type='submit'
                  className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto'
                />
              )}
              <Button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
                onClick={() => setOpen(false)}
                label='Cancel'
              />
            </div>
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddTask;
