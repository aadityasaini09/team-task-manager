import { useForm } from "react-hook-form";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import Button from "../Button";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { apiUrl } from "../../utils/apiBase.js";

const AddSubTask = ({ open, setOpen, id }) => {
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleOnSubmit = async (data) => {
    if (!id) {
      toast.error("Missing task");
      return;
    }
    try {
      const res = await fetch(apiUrl(`/task/create-subtask/${id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(user?.token
            ? { Authorization: `Bearer ${user.token}` }
            : {}),
        },
        credentials: "include",
        body: JSON.stringify({
          title: data.title,
          date: data.date,
          tag: data.tag,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result?.message || "Failed to add sub-task");
        return;
      }
      toast.success(result?.message || "Sub-task added");
      reset();
      setOpen(false);
      window.location.reload();
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className=''>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            ADD SUB-TASK
          </Dialog.Title>
          <div className='mt-2 flex flex-col gap-6'>
            <Textbox
              placeholder='Sub-Task title'
              type='text'
              name='title'
              label='Title'
              className='w-full rounded'
              register={register("title", {
                required: "Title is required!",
              })}
              error={errors.title ? errors.title.message : ""}
            />

            <div className='flex items-center gap-4'>
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
              <Textbox
                placeholder='Tag'
                type='text'
                name='tag'
                label='Tag'
                className='w-full rounded'
                register={register("tag", {
                  required: "Tag is required!",
                })}
                error={errors.tag ? errors.tag.message : ""}
              />
            </div>
          </div>
          <div className='py-3 mt-4 flex sm:flex-row-reverse gap-4'>
            <Button
              type='submit'
              className='bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 sm:ml-3 sm:w-auto'
              label='Add Task'
            />

            <Button
              type='button'
              className='bg-white border text-sm font-semibold text-gray-900 sm:w-auto'
              onClick={() => setOpen(false)}
              label='Cancel'
            />
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddSubTask;
