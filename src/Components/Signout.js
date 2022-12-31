import { React, Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { getAuth, signOut, deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import ProfileAvatar from "./ProfileAvatar";
import { HiOutlineLogout } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { Link } from "react-router-dom";
import { MdOutlineDeleteSweep } from "react-icons/md";
import {
  doc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../Firebase";

export default function Signout({ setSignedIn, userData, setUserData }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();

  async function handleSignout() {
    try {
      await signOut(auth);
      localStorage.removeItem("localUser");
      setSignedIn(false);
      setUserData(null);
      navigate("/auth");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="hidden sm:block dropdown dropdown-top">
      <label tabIndex={0}>
        <div className="hidden justify-center xl:pl-4 sm:flex flex-row items-center xl:justify-start gap-3 xl:h-14 xl:max-w-[200px] xl:min-w-[200px] rounded-full xl:hover:bg-[#1c1c1cc7] hover:cursor-pointer">
          <ProfileAvatar />
          <div className="hidden xl:block">
            <p className="hidden xl:block font-bold text-sm text-white">
              @{userData?.displayName}
            </p>
          </div>
          <BsThreeDots className="fill-white mw-8 mh-8 hidden xl:block" />
        </div>
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-4 shadowbg-black border-[#434343c4] border-solid border rounded-box w-52 mb-3 bg-black"
      >
        <Link
          to={`/profile/${userData?.displayName}`}
          className="bg-white z-20"
        >
          <li className="text-sm bg-black">
            <p className="active:bg-black text-gray-100">Profile</p>
          </li>
        </Link>

        <li className="text-sm bg-black" onClick={handleSignout}>
          <p className="active:bg-black text-gray-100">
            Log out
            <HiOutlineLogout />
          </p>
        </li>
        <li className="text-sm bg-black" onClick={() => setOpen(true)}>
          <p className="active:bg-black text-gray-100">
            Delete Account
            <MdOutlineDeleteSweep />
          </p>
        </li>
      </ul>
      <DeleteAccountModal
        open={open}
        setOpen={setOpen}
        setLoading={setLoading}
        loading={loading}
        setUserData={setUserData}
        setSignedIn={setSignedIn}
      />
    </div>
  );
}

function DeleteAccountModal({
  setOpen,
  open,
  setLoading,
  loading,
  setUserData,
  setSignedIn,
}) {
  const navigate = useNavigate();

  async function deleteAccountDB() {
    try {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;

      //delete user from firebase auth
      deleteUser(user).catch((error) => {
        console.log(error);
      });
      await deleteDoc(doc(db, "Users", user.uid));

      //delete user tweets
      const tweetsArr = [];
      const tweetsQuery = query(
        collection(db, "Tweets"),
        where("uid", "==", user?.uid)
      );
      const firstSnapshot = await getDocs(tweetsQuery);
      firstSnapshot.forEach((doc) => {
        tweetsArr.push(doc.data().tweetId);
      });

      //loop through tweetsArr and delete all tweets
      if (tweetsArr.length > 0) {
        const storage = getStorage();

        tweetsArr.forEach((tweet) => {
          deleteDoc(doc(db, "Tweets", `${tweet}`));
        });

        //loop through tweetsArr and delete all images
        tweetsArr.forEach((tweet) => {
          const imageRef = ref(storage, `tweetImages/${tweet}`);
          deleteObject(imageRef);
        });

        //loop through tweetsArr and delete all threads
        tweetsArr.forEach((tweet) => {
          deleteDoc(doc(db, "Threads", `${tweet}`));
        });
      }

      localStorage.removeItem("localUser");
      setSignedIn(false);
      setUserData(null);
      setTimeout(() => {
        setLoading(false);
        navigate("/auth");
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  }

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
                <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-black text-gray-400 hover:text-gray-500"
                    onClick={() => setOpen(false)}
                  >
                    <svg
                      className="h-6 w-6"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-700 text-white sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-white"
                    >
                      Delete account
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-400">
                        Are you sure you want to delete your account? All of
                        your data will be permanently removed from our servers
                        forever. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="min-w-[142.38px] min-h-[38px] inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={deleteAccountDB}
                  >
                    {loading ? (
                      <svg
                        className="animate-spin h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      "Delete Account"
                    )}
                  </button>

                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
