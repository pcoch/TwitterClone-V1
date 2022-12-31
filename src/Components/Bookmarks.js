import { React, useEffect, useState } from "react";
import HomeMenu from "./HomeMenu";
import AltFeed from "./AltFeed";
import ProfileFeedBar from "./ProfileFeedBar";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { TweetSkeleton } from "./TweetSkeleton";
import { useNavigate } from "react-router-dom";

export default function Bookmarks({ setSignedIn, userData, setUserData }) {
  return (
    <div className="flex flex-col-reverse justify-between sm:flex sm:flex-row sm:justify-center sm:items-start sm:min-h-screen sm:h-screen sm:overflow-y-scroll sm:max-h-screen scroll-smooth min-h-screen">
      <HomeMenu
        setSignedIn={setSignedIn}
        userData={userData}
        setUserData={setUserData}
      />
      <div className="flex flex-col justify-start items-start border-r border-[#434343c4] border-l border-solid sm:max-w-[598px] sm:w-[598px] min-h-full">
        <ProfileFeedBar profileData={userData} />
        <BookmarkList userData={userData} />
      </div>
      <AltFeed setUserData={setUserData} userData={userData} />
    </div>
  );
}

function BookmarkList({ userData }) {
  const [bookmarkData, setBookmarkData] = useState([]);
  const [loading, setLoading] = useState(true);

  // get the user's bookmarks from db
  useEffect(() => {
    async function getBookmarks() {
      const bookmarksDocRef = doc(db, "Users", `${userData?.uid}`);
      const docSnap = await getDoc(bookmarksDocRef);

      let bookmarksArr = [];

      try {
        if (docSnap.exists()) {
          const bookmarkData = docSnap.data().bookmarks;

          //get tweet data from all tweets in threadData array
          for (let i = 0; i < bookmarkData.length; i++) {
            const tweetDocRef = doc(db, "Tweets", `${bookmarkData[i]}`);
            const tweetDocSnap = await getDoc(tweetDocRef);
            if (tweetDocSnap.exists()) {
              bookmarksArr.push(tweetDocSnap.data());
            }
          }
          setBookmarkData(bookmarksArr);
          setLoading(false);
        } else {
          return null;
        }
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
    getBookmarks();
  }, [userData?.uid]);

  const bookmarks = bookmarkData.map((bookmark) => (
    <BookmarkTweet key={bookmark.tweetId} bookmarkData={bookmark} />
  ));

  const TweetSkeletonList = [1, 2, 3, 4].map((i) => <TweetSkeleton key={i} />);

  if (bookmarkData.length > 0) {
    return <>{loading ? TweetSkeletonList : <>{bookmarks}</>}</>;
  } else {
    return <BookmarkPlaceholder />;
  }
}

function BookmarkTweet({ bookmarkData }) {
  const navigate = useNavigate();
  const handleProfileNavClick = (e) => {
    e.stopPropagation();
    navigate(`/profile/${bookmarkData?.displayName}`);
  };

  return (
    <div
      key={bookmarkData.tweetId}
      onClick={() => navigate(`/tweet/${bookmarkData?.tweetId}`)}
      className="w-full flex flex-row p-4 h-auto cursor-pointer hover:bg-[#0b0b0b] relative"
    >
      <div className="flex items-start min-h-full mr-3 w-12 min-w-[48px]">
        <img
          className="w-10 h-10 min-w-10 min-h-10 rounded-full object-cover"
          src={bookmarkData.photoURL}
          alt="avatar"
        />
      </div>
      <div className="w-full">
        <div className="flex-row flex gap-6">
          <h3
            className="text-white font-bold text-sm hover:underline"
            onClick={handleProfileNavClick}
          >
            {bookmarkData.name}
          </h3>
          <h3
            className="text-gray-400 text-sm hover:underline"
            onClick={handleProfileNavClick}
          >
            @{bookmarkData.displayName}
          </h3>
          <h3 className="text-gray-400 text-sm">
            {bookmarkData.timestamp.split(",")[0]}
          </h3>
        </div>
        <div className="mt-3 mb-3">
          <p className="text-white leading-normal text-sm">
            {bookmarkData.tweet}
          </p>
        </div>
        <div className="w-full flex flex-row justify-start items-center gap-12 sm:gap-24 min-h-6 h-6"></div>
      </div>
    </div>
  );
}

function BookmarkPlaceholder() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center w-full pt-8">
      <h1 className="text-2xl font-bold text-white pb-4">No Bookmarks</h1>
      <button
        onClick={() => navigate("/home")}
        className="flex items-center justify-center w-[154px] h-auto bg-white font-bold text-sm text-black rounded-3xl pl-5 pr-5 pt-2 pb-2 hover:brightness-90"
      >
        Find Tweets
      </button>
    </div>
  );
}
