import { React, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import { Menu, Transition } from "@headlessui/react";
import { BiTrash as TrashIcon } from "react-icons/bi";

export default function Tweet(props) {
  const navigate = useNavigate();

  const handleProfileNavClick = (e) => {
    e.stopPropagation();
    navigate(`/profile/${props.displayName}`);
  };

  function handleDeleteTweet(e) {
    e.stopPropagation();
    props.deleteTweet(props.tweetId, props.threadId);
  }

  return (
    <div
      key={props.tweetId}
      onClick={() => navigate(`/tweet/${props.tweetId}`)}
      className="w-full flex flex-row p-4 h-auto border-b border-[#434343c4] border-solid cursor-pointer hover:bg-[#0b0b0b]"
    >
      <div className="flex items-start min-h-full mr-3 w-12 min-w-[48px]">
        {props.isCurrentUser ? (
          <img
            className="w-10 h-10 min-w-10 min-h-10 rounded-full object-cover"
            src={props.userPhotoURL}
            alt="avatar"
          />
        ) : (
          <img
            className="w-10 h-10 min-w-10 min-h-10 rounded-full object-cover"
            src={props.photoURL}
            alt="avatar"
          />
        )}
      </div>
      <div className="w-full">
        <div className="flex-row flex justify-between">
          <div className="flex-row flex gap-6">
            <h3
              className="text-white font-bold text-sm hover:underline"
              onClick={handleProfileNavClick}
            >
              {props?.name}
            </h3>
            <h3
              className="text-gray-400 text-sm hover:underline"
              onClick={handleProfileNavClick}
            >
              @{props.displayName}
            </h3>
            <h3 className="text-gray-400 text-sm">
              {props.timestamp.split(",")[0]}
            </h3>
          </div>
          {props.isCurrentUser && (
            <TweetMenuDropDown handleDeleteTweet={handleDeleteTweet} />
          )}
        </div>
        <div className="mt-3 mb-3">
          <p className="text-white leading-normal text-sm whitespace-pre-wrap">
            {props.tweet}
          </p>
          {props.tweetPhotoUrl && (
            <img
              className="rounded-xl max-w-[90%]"
              src={props.tweetPhotoUrl}
              alt={props.tweetPhotoUrl}
            />
          )}
        </div>
        <div className="w-full flex flex-row justify-start items-center gap-12 sm:gap-24 min-h-6 h-6"></div>
      </div>
    </div>
  );
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function TweetMenuDropDown({ handleDeleteTweet }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          onClick={(e) => e.stopPropagation()}
          className="min-h-[20px] min-w-[20px] flex justify-center items-center ease-in-out duration-300 text-gray-600 cursor-pointer w-8 h-8 p-1.5 rounded-full hover:text-sky-500 hover:bg-sky-200 hover:bg-opacity-10 "
        >
          <BsThreeDots />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="cursor-pointer absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-black border-[#434343c4] border-solid border">
          <div className="py-1" onClick={handleDeleteTweet}>
            <Menu.Item>
              {({ active }) => (
                <div
                  className={classNames(
                    active
                      ? "bg-black text-red-600 font-semibold brightness-110"
                      : "bg-black text-red-600 font-semibold",
                    "group flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <TrashIcon
                    className="mr-3 h-5 w-5 text-red-600 hover:brightness-110"
                    aria-hidden="true"
                  />
                  Delete
                </div>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
