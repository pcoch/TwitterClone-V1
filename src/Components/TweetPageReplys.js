import { React, useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { TweetSkeleton } from "./TweetSkeleton";

export default function TweetPageReplys({
  tweetData,
  newReply,
  setReplyCount,
}) {
  const [replyData, setReplyData] = useState([]);
  const [loadingReplys, setLoadingReplys] = useState(true);

  const location = useLocation().pathname;

  useEffect(() => {
    async function getReplysDB() {
      const threadDocRef = doc(db, "Threads", `${tweetData?.threadId}`);
      const docSnap = await getDoc(threadDocRef);

      let tweetsArr = [];
      let tweets;

      try {
        if (docSnap.exists()) {
          const threadData = docSnap.data().thread;
          tweets = threadData.slice(
            threadData.indexOf(tweetData.tweetId) + 1,
            threadData.length
          );
          setReplyCount(tweets.length);
          //get tweet data from all tweets in threadData array
          for (let i = 0; i < tweets.length; i++) {
            const tweetDocRef = doc(db, "Tweets", `${tweets[i]}`);
            const tweetDocSnap = await getDoc(tweetDocRef);
            if (tweetDocSnap.exists()) {
              tweetsArr.push(tweetDocSnap.data());
            }
          }
          setReplyData(tweetsArr);
          setLoadingReplys(false);
        } else {
          return null;
        }
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
    getReplysDB();
  }, [
    location,
    tweetData?.threadId,
    tweetData?.tweetId,
    newReply,
    setReplyCount,
  ]);

  const replys = replyData.map((reply) => (
    <ReplyTweet key={reply.tweetId} replyData={reply} tweetData={tweetData} />
  ));

  const TweetSkeletonList = [1, 2, 3, 4].map((i) => <TweetSkeleton key={i} />);

  return <>{loadingReplys ? TweetSkeletonList : <>{replys}</>}</>;
}

function ReplyTweet({ replyData, tweetData }) {
  const navigate = useNavigate();
  const handleProfileNavClick = (e) => {
    e.stopPropagation();
    navigate(`/profile/${replyData?.displayName}`);
  };

  return (
    <div
      key={replyData.tweetId}
      onClick={() => navigate(`/tweet/${replyData?.tweetId}`)}
      className="w-full flex flex-row p-4 h-auto cursor-pointer hover:bg-[#0b0b0b] relative"
    >
      <div className="flex items-start min-h-full mr-3 w-12 min-w-[48px]">
        <img
          className="object-cover w-10 h-10 min-w-10 min-h-10 rounded-full"
          src={replyData.photoURL}
          alt="avatar"
        />
      </div>
      <div className="w-full">
        <div className="flex-row flex gap-6">
          <h3
            className="text-white font-bold text-sm hover:underline"
            onClick={handleProfileNavClick}
          >
            {replyData.name}
          </h3>
          <h3
            className="text-gray-400 text-sm hover:underline"
            onClick={handleProfileNavClick}
          >
            @{replyData.displayName}
          </h3>
          <h3 className="text-gray-400 text-sm">
            {replyData.timestamp.split(",")[0]}
          </h3>
        </div>
        <div className="mt-3 mb-3">
          <p className="text-gray-500 text-sm">
            Replying to{" "}
            <span className="font-semibold text-sky-500 cursor-pointer hover:underline">
              {tweetData?.displayName ? (
                <span
                  onClick={() => navigate(`/profile/${tweetData?.displayName}`)}
                >
                  @{tweetData?.displayName}
                </span>
              ) : null}
            </span>
          </p>
          <p className="text-white leading-normal text-sm">{replyData.tweet}</p>
        </div>
        <div className="w-full flex flex-row justify-start items-center gap-12 sm:gap-24 min-h-6 h-6"></div>
      </div>
    </div>
  );
}
