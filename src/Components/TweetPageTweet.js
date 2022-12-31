import { React, memo, useState, useEffect, Fragment } from "react";
import Avatar from "./Avatar";
import { BiHeart } from "react-icons/bi";
import { AiOutlineRetweet } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { TweetPageSkeleton } from "./TweetSkeleton";
import { useNavigate } from "react-router-dom";
import handleLike from "../Utilities/handleLike";
import { getStorage, ref, deleteObject } from "firebase/storage";
import handleBookmark from "../Utilities/handleBookmark";
import { BsThreeDots } from "react-icons/bs";
import { Menu, Transition } from "@headlessui/react";
import { BiTrash as TrashIcon } from "react-icons/bi";
import { doc, deleteDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "../Firebase";

const TweetPageTweet = memo(function TweetPageTweet({
  tweetData,
  setTweetData,
  replyCount,
  userData,
  setUserData,
  setShowNotification,
}) {
  const [liked, setLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState();
  const [isCurrentUser, setIsCurrentUser] = useState(
    userData?.displayName === tweetData?.displayName ? true : false
  );

  const navigate = useNavigate();

  async function handleDeleteTweet(e) {
    e.stopPropagation();
    try {
      const threadRef = doc(db, "Threads", `${tweetData.threadId}`);
      await updateDoc(threadRef, {
        thread: arrayRemove(tweetData.tweetId),
      });

      await deleteDoc(doc(db, "Tweets", `${tweetData.tweetId}`));
      navigate(`/profile/${tweetData.displayName}`);

      if (`${tweetData.threadId}` === `${tweetData.tweetId}`) {
        await deleteDoc(doc(db, "Threads", `${tweetData.threadId}`));
      }

      if (tweetData?.tweetPhotoUrl) {
        const storage = getStorage();
        const imageRef = ref(storage, `tweetImages/${tweetData.tweetId}`);
        deleteObject(imageRef).catch((error) => {
          console.log(error);
        });
      }

      setTweetData({});
      setShowNotification(true);
      sessionStorage.setItem("deleteRedirect", "true");
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  }

  //check if user is current user
  useEffect(() => {
    setIsCurrentUser(
      userData?.displayName === tweetData?.displayName ? true : false
    );
  }, [tweetData, userData]);

  // check if tweet is bookmarked
  useEffect(() => {
    function checkBookmarkStatus() {
      if (
        tweetData?.tweetId &&
        userData?.bookmarks.length > 0 &&
        userData?.uid
      ) {
        const bookmarkStatus = userData?.bookmarks.includes(tweetData?.tweetId);
        return bookmarkStatus;
      }
    }
    checkBookmarkStatus() ? setIsBookmarked(true) : setIsBookmarked(false);
  }, [tweetData?.tweetId, userData?.uid, userData?.bookmarks]);

  //check if tweet is liked
  useEffect(() => {
    function checkLikedStatus() {
      if (tweetData?.likedBy && userData?.uid) {
        const likeStatus = tweetData?.likedBy.includes(userData?.uid);
        return likeStatus;
      }
    }
    checkLikedStatus() ? setLiked(true) : setLiked(false);
  }, [tweetData?.likedBy, userData?.uid]);

  const handleProfileNavClick = (e) => {
    navigate(`/profile/${tweetData?.displayName}`);
  };

  if (tweetData?.length === 0) {
    return <TweetPageSkeleton />;
  }

  return (
    <div className="w-full h-auto p-4">
      <div className="flex flex-row justify-between items-center gap-6 min-h-16">
        <div className="flex flex-row justify-start items-center gap-6 min-h-16">
          <Avatar nav tweetData={tweetData} />
          <div>
            <h3
              onClick={handleProfileNavClick}
              className="text-white font-bold text-sm hover:underline hover:cursor-pointer"
            >
              {tweetData.name}
            </h3>
            <h3
              onClick={handleProfileNavClick}
              className="text-gray-400 text-sm hover:underline hover:cursor-pointer"
            >
              @{tweetData.displayName}
            </h3>
          </div>
        </div>
        <div>
          {isCurrentUser && (
            <TweetMenuDropDown handleDeleteTweet={handleDeleteTweet} />
          )}
        </div>
      </div>
      <div className="h-auto w-full pt-4">
        <p className="text-white text-lg">{tweetData?.tweet}</p>
        <img
          className="rounded-xl max-w-[90%]"
          src={tweetData?.tweetPhotoUrl}
          alt={tweetData?.tweetPhotoUrl}
        />
      </div>
      <div className="flex flex-row h-8 items-center text-sm gap-2">
        <p className="text-gray-500">{tweetData?.timestamp}</p>
      </div>
      <div className="flex flex-row h-12 items-center gap-6 text-xs">
        <p className="text-gray-500">
          <span className="font-bold text-white">&nbsp;</span> Retweets
        </p>
        <p className="text-gray-500">
          <span className="font-bold text-white">
            {tweetData?.likeCount === 0 ? null : tweetData?.likeCount}{" "}
          </span>
          {tweetData?.likeCount === 1 ? "Like" : "Likes"}
        </p>
        <p className="text-gray-500">
          <span className="font-bold text-white">
            {replyCount === 0 ? null : replyCount}{" "}
          </span>
          {replyCount === 1 ? "Reply" : "Replies"}
        </p>
      </div>
      <div className="w-full flex flex-row justify-around items-center min-h-10 h-12 border-solid border-y border-[#434343c4]">
        <AiOutlineRetweet
          onClick={() => alert("Under Contruction 🚧")}
          className={
            "ease-in-out duration-300 text-gray-600 cursor-pointer w-8 h-8 p-1.5 rounded-xl hover:text-sky-500 hover:bg-sky-200 hover:bg-opacity-10"
          }
        />
        <BiHeart
          onClick={() =>
            handleLike({ tweetData, setTweetData, setLiked, liked })
          }
          className={
            liked
              ? "ease-in-out duration-300 cursor-pointer w-8 h-8 p-1.5 rounded-xl text-pink-600 bg-pink-200 bg-opacity-10"
              : "ease-in-out duration-300 text-gray-600 cursor-pointer w-8 h-8 p-1.5 rounded-xl hover:text-pink-600 hover:bg-pink-200 hover:bg-opacity-10"
          }
        />
        <BsBookmark
          onClick={() =>
            handleBookmark({
              tweetData,
              userData,
              setUserData,
              isBookmarked,
              setIsBookmarked,
            })
          }
          className={
            isBookmarked
              ? "ease-in-out duration-300 cursor-pointer w-8 h-8 p-1.5 rounded-xl text-purple-600 bg-purple-200 bg-opacity-10"
              : "ease-in-out duration-300 text-gray-600 cursor-pointer w-8 h-8 p-1.5 rounded-xl hover:text-purple-600 hover:bg-purple-200 hover:bg-opacity-10"
          }
        />
      </div>
    </div>
  );
});

export default TweetPageTweet;

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
                  className={
                    (active
                      ? "bg-black text-red-600 font-semibold brightness-110"
                      : "bg-black text-red-600 font-semibold",
                    "group flex items-center px-4 py-2 text-sm")
                  }
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
