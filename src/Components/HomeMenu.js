import { React, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { BsTwitter, BsBookmark, BsPerson } from "react-icons/bs";
import { AiOutlineHome } from "react-icons/ai";
import { RiHashtag } from "react-icons/ri";
import { FiMail } from "react-icons/fi";
import { BiBell } from "react-icons/bi";
import Signout from "./Signout";
import { useNavigate, NavLink } from "react-router-dom";
import Tweetbox from "./Tweetbox";

export default function HomeMenu({
  setSignedIn,
  userData,
  setUserData,
  newModalTweet,
  setNewModalTweet,
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div
        id="homeMenu"
        className="z-20 sm:min-h-screen sm:max-h-screen sm:flex sm:flex-col sm:justify-between xl:items-start sm:items-center xl:min-w-[250px] xl:w-[250px] sm:min-w-[80px] sm:w-[80px] sm:pt-4 sm:gap-4 sm:pb-4 sm:sticky sm:top-0 sticky bottom-0 bg-black overflow-hidden w-full"
      >
        <div
          id="menuItems"
          className="sm:flex sm:flex-col sm:items-start sm:h-full sm:gap-3 flex flex-row items-center"
        >
          <BsTwitter
            className="hidden sm:block fill-slate-50 mb-4 cursor-pointer pl-4 min-h-6 w-auto "
            onClick={() => navigate("/home")}
          />
          <Menu userData={userData} />
          <label
            htmlFor="tweet-modal"
            onClick={() => setOpen(true)}
            className="cursor-pointer hidden sm:flex mt-3 h-12 w-[48px] bg-[#1c9bf0] rounded-full text-white font-bold hover:bg-[#1d89d1] xl:w-[200px] justify-center items-center hover:ease-in-out hover:duration-300"
          >
            <span className="hidden xl:block">Tweet</span>
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="xl:hidden r-jwli3a r-4qtqp9 r-yyyyoo r-1472mwg r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-lrsllp h-[20px] w-[20px] fill-slate-50"
            >
              <g>
                <path d="M8.8 7.2H5.6V3.9c0-.4-.3-.8-.8-.8s-.7.4-.7.8v3.3H.8c-.4 0-.8.3-.8.8s.3.8.8.8h3.3v3.3c0 .4.3.8.8.8s.8-.3.8-.8V8.7H9c.4 0 .8-.3.8-.8s-.5-.7-1-.7zm15-4.9v-.1h-.1c-.1 0-9.2 1.2-14.4 11.7-3.8 7.6-3.6 9.9-3.3 9.9.3.1 3.4-6.5 6.7-9.2 5.2-1.1 6.6-3.6 6.6-3.6s-1.5.2-2.1.2c-.8 0-1.4-.2-1.7-.3 1.3-1.2 2.4-1.5 3.5-1.7.9-.2 1.8-.4 3-1.2 2.2-1.6 1.9-5.5 1.8-5.7z"></path>
              </g>
            </svg>
          </label>
        </div>
        <Signout
          setSignedIn={setSignedIn}
          userData={userData}
          setUserData={setUserData}
        />
      </div>
      <TweetModal
        userData={userData}
        open={open}
        setOpen={setOpen}
        newModalTweet={newModalTweet}
        setNewModalTweet={setNewModalTweet}
      />
    </>
  );
}

function Menu({ userData }) {
  //menu data for the menu component
  const menuData = [
    {
      name: "Home",
      icon: <AiOutlineHome className="h-5 w-auto" />,
      route: "home",
    },
    {
      name: "Explore",
      icon: <RiHashtag className="h-5 w-auto" />,
      route: "explore",
    },
    {
      name: "Notifications",
      icon: <BiBell className="h-5 w-auto" />,
      route: "notifications",
    },
    {
      name: "Messages",
      icon: <FiMail className="h-5 w-auto" />,
      route: "messages",
    },
    {
      name: "Bookmarks",
      icon: <BsBookmark className="h-5 w-auto" />,
      route: "bookmarks",
    },
    {
      name: "Profile",
      icon: <BsPerson className="h-5 w-auto" />,
      route: `profile/${userData?.displayName}`,
    },
  ];

  let activeStyle = {
    backgroundColor: "#1c1c1cc7",
    fontWeight: "bold",
  };
  const menuItems = menuData.map((item) => (
    <NavLink
      key={item.name}
      end
      to={"/" + item.route}
      style={({ isActive }) => (isActive ? activeStyle : undefined)}
      className="flex rounded-full gap-3 text-lg sm:flex sm:justify-start sm:items-center sm:h-12 text-white sm:px-4 sm:hover:bg-[#1c1c1cc7]"
    >
      {item.icon}
      <li className="hidden xl:block pr-3" key={item.name}>
        {item.name}
      </li>
    </NavLink>
  ));

  return (
    <>
      <ul className="flex sm:flex-col sm:items-start sm:px-0 sm:border-t-0 sm:h-auto sm:gap-2 w-full flex-row h-16 items-center justify-between px-8  border-t border-[#434343c4] border-solid">
        {menuItems}
      </ul>
    </>
  );
}

function TweetModal({
  userData,
  open,
  setOpen,
  newModalTweet,
  setNewModalTweet,
}) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-black px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <Tweetbox
                  noBorder
                  modal
                  userData={userData}
                  setOpen={setOpen}
                  newModalTweet={newModalTweet}
                  setNewModalTweet={setNewModalTweet}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
