import { React, useEffect, useState } from "react";
import HomeMenu from "./HomeMenu";
import AltFeed from "./AltFeed";
import TweetPageBar from "./TweetPageBar";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
import TweetPageTweet from "./TweetPageTweet";
import Tweetbox from "./Tweetbox";
import TweetPageReplys from "./TweetPageReplys";
import { useLocation } from "react-router-dom";

export default function TweetPage({
  setSignedIn,
  userData,
  setUserData,
  setShowNotification,
}) {
  const [tweetData, setTweetData] = useState([]);
  const [newReply, setNewReply] = useState(false);
  const [replyCount, setReplyCount] = useState(0);

  const location = useLocation();
  const path = location.pathname;

  async function getTweet() {
    const path = window.location.pathname;
    const tweetId = path.split("/")[2];
    try {
      //get tweet data from db using tweetId
      const tweetDocRef = doc(db, "Tweets", tweetId);
      const tweetDocSnap = await getDoc(tweetDocRef);

      //get the profilURL of the user who tweeted
      async function getUserAvatar() {
        const userDocRef = doc(db, "Users", tweetDocSnap.data().uid);
        const userDocSnap = await getDoc(userDocRef);
        return userDocSnap.data().photoURL;
      }
      const userAvatar = await getUserAvatar();

      //set tweet data and update profile URL
      if (tweetDocSnap.exists()) {
        setTweetData(tweetDocSnap.data());
        setTweetData((prev) => {
          return { ...prev, photoURL: userAvatar };
        });
      }
    } catch (e) {
      console.error("Error getting document: ", e);
    }
  }

  useEffect(() => {
    getTweet();
  }, [path]);

  return (
    <div className="flex flex-col-reverse sm:flex sm:flex-row sm:justify-center sm:items-start sm:min-h-screen sm:h-screen sm:overflow-y-scroll sm:max-h-screen scroll-smooth min-h-screen">
      <HomeMenu
        setSignedIn={setSignedIn}
        userData={userData}
        setUserData={setUserData}
      />
      <div className="flex flex-col justify-start items-start border-r border-[#434343c4] border-l border-solid sm:max-w-[598px] sm:w-[598px] min-h-screen">
        <TweetPageBar />
        <TweetPageTweet
          tweetData={tweetData}
          setTweetData={setTweetData}
          userData={userData}
          replyCount={replyCount}
          setUserData={setUserData}
          setShowNotification={setShowNotification}
        />
        <div className="w-full h-auto px-4">
          <Tweetbox
            userData={userData}
            tweetData={tweetData}
            setNewReply={setNewReply}
            reply
            noBorder
          />
        </div>
        <div className="border-[#434343c4] border-b border-solid w-full pt-6"></div>
        <TweetPageReplys
          tweetData={tweetData}
          setNewReply={setNewReply}
          newReply={newReply}
          replyCount={replyCount}
          setReplyCount={setReplyCount}
        />
      </div>
      <AltFeed userData={userData} />
    </div>
  );
}
