import { Popover, Transition } from "@headlessui/react";
import moment from "moment";
import { Fragment, useCallback, useEffect, useState } from "react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { HiBellAlert } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/apiBase.js";

const ICONS = {
  alert: (
    <HiBellAlert className='h-5 w-5 text-gray-600 group-hover:text-indigo-600' />
  ),
  message: (
    <BiSolidMessageRounded className='h-5 w-5 text-gray-600 group-hover:text-indigo-600' />
  ),
};

const NotificationPanel = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    try {
      const res = await fetch(apiUrl("/user/notifications"), {
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) return;
      setData(Array.isArray(json) ? json : []);
    } catch (e) {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const readHandler = async (isReadType, id) => {
    try {
      const q =
        isReadType === "all"
          ? "?isReadType=all"
          : `?isReadType=one&id=${encodeURIComponent(id)}`;
      await fetch(apiUrl(`/user/read-noti${q}`), {
        method: "PUT",
        credentials: "include",
      });
      load();
    } catch (e) {
      /* ignore */
    }
  };

  const viewHandler = (item) => {
    if (item?.task?._id) {
      navigate(`/task/${item.task._id}`);
    }
  };

  const callsToAction = [
    { name: "Cancel", href: "#", icon: "" },
    {
      name: "Mark All Read",
      href: "#",
      icon: "",
      onClick: () => readHandler("all", ""),
    },
  ];

  return (
    <>
      <Popover className='relative'>
        <Popover.Button
          className='inline-flex items-center outline-none'
          onClick={() => load()}
        >
          <div className='w-8 h-8 flex items-center justify-center text-gray-800 relative'>
            <IoIosNotificationsOutline className='text-2xl' />
            {data?.length > 0 && (
              <span className='absolute text-center top-0 right-1 text-sm text-white font-semibold w-4 h-4 rounded-full bg-red-600'>
                {data?.length}
              </span>
            )}
          </div>
        </Popover.Button>

        <Transition
          as={Fragment}
          enter='transition ease-out duration-200'
          enterFrom='opacity-0 translate-y-1'
          enterTo='opacity-100 translate-y-0'
          leave='transition ease-in duration-150'
          leaveFrom='opacity-100 translate-y-0'
          leaveTo='opacity-0 translate-y-1'
        >
          <Popover.Panel className='absolute -right-16 md:-right-2 z-10 mt-5 flex w-screen max-w-max  px-4'>
            {({ close }) =>
              data?.length > 0 && (
                <div className='w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5'>
                  <div className='p-4'>
                    {data?.slice(0, 5).map((item, index) => (
                      <div
                        key={item._id + index}
                        className='group relative flex gap-x-4 rounded-lg p-4 hover:bg-gray-50'
                      >
                        <div className='mt-1 h-8 w-8 flex items-center justify-center rounded-lg bg-gray-200 group-hover:bg-white'>
                          {ICONS[item.notiType] || ICONS.alert}
                        </div>

                        <div
                          className='cursor-pointer flex-1'
                          onClick={() => viewHandler(item)}
                        >
                          <div className='flex items-center gap-3 font-semibold text-gray-900 capitalize'>
                            <p> {item.notiType}</p>
                            <span className='text-xs font-normal lowercase'>
                              {moment(item.createdAt).fromNow()}
                            </span>
                          </div>
                          <p className='line-clamp-2 mt-1 text-gray-600'>
                            {item.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className='grid grid-cols-2 divide-x bg-gray-50'>
                    {callsToAction.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={
                          item?.onClick
                            ? (e) => {
                                e.preventDefault();
                                item.onClick();
                                close();
                              }
                            : () => close()
                        }
                        className='flex items-center justify-center gap-x-2.5 p-3 font-semibold text-blue-600 hover:bg-gray-100'
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            }
          </Popover.Panel>
        </Transition>
      </Popover>
    </>
  );
};

export default NotificationPanel;
