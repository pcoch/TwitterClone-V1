import { React, useState, useEffect } from "react";
import { TweetSkeleton } from "./TweetSkeleton";
import Tweet from "./Tweet";
import InfiniteScroll from "react-infinite-scroll-component";
import { db } from "../Firebase";
import { getStorage, ref, deleteObject } from "firebase/storage";
import {
  collection,
  query,
  startAfter,
  where,
  getDocs,
  orderBy,
  limit,
  doc,
  deleteDoc,
  arrayRemove,
  updateDoc,
} from "firebase/firestore";

export default function ProfileFeed({
  profileData,
  isCurrentUser,
  userData,
  newModalTweet,
}) {
  const [feedData, setFeedData] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [lastVisible, setLastVisible] = useState();
  const [hasMore, setHasMore] = useState(true);

  async function deleteTweet(tweetId, threadId) {
    try {
      await deleteDoc(doc(db, "Tweets", `${tweetId}`));
      const threadRef = doc(db, "Threads", `${threadId}`);
      await updateDoc(threadRef, {
        thread: arrayRemove(tweetId),
      });

      const storage = getStorage();
      const imageRef = ref(storage, `tweetImages/${tweetId}`);
      deleteObject(imageRef).catch((error) => {
        console.log(error);
      });

      if (tweetId === threadId) {
        await deleteDoc(doc(db, "Threads", `${threadId}`));
      }

      setFeedData(feedData.filter((tweet) => tweet.tweetId !== tweetId));
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  }

  async function getData() {
    const initArr = [];
    const windowHeight = window.innerHeight / 122;

    try {
      if (profileData?.uid !== undefined) {
        setLoadingFeed(true);

        // Query the first page of docs
        const first = query(
          collection(db, "Tweets"),
          where("uid", "==", profileData?.uid),
          orderBy("timestamp", "desc"),
          limit(windowHeight.toFixed(0))
        );

        const firstSnapshot = await getDocs(first);
        firstSnapshot.forEach((doc) => {
          initArr.push(doc.data());
        });
        setLastVisible(firstSnapshot.docs[firstSnapshot.docs.length - 1]);
        setFeedData(initArr);
        setLoadingFeed(false);
      }
    } catch (e) {
      console.error("Error getting document: ", e);
    }
  }

  async function getNextData() {
    const nextArr = [];
    try {
      // Query the next page of docs
      const next = query(
        collection(db, "Tweets"),
        where("uid", "==", profileData?.uid),
        orderBy("timestamp", "desc"),
        startAfter(lastVisible),
        limit(5)
      );
      const nextSnapshot = await getDocs(next);
      nextSnapshot.forEach((doc) => {
        nextArr.push(doc.data());
      });
      if (nextSnapshot.docs.length === 0) {
        setHasMore(false);
      } else {
        setTimeout(() => {
          setLastVisible(nextSnapshot.docs[nextSnapshot.docs.length - 1]);
          setFeedData([...feedData, ...nextArr]);
          setLoadingFeed(false);
        }, 750);
      }
    } catch (e) {
      console.error("Error getting document: ", e);
    }
  }

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [profileData?.uid, newModalTweet]);

  const FeedTweets = feedData.map((tweet) => (
    <Tweet
      name={profileData?.name}
      displayName={tweet.displayName}
      photoURL={profileData.photoURL}
      userPhotoURL={userData.photoURL}
      tweet={tweet.tweet}
      timestamp={tweet.timestamp}
      tweetId={tweet.tweetId}
      threadId={tweet?.threadId}
      key={tweet.tweetId}
      isCurrentUser={isCurrentUser}
      setTweets={setFeedData}
      deleteTweet={deleteTweet}
      tweetPhotoUrl={tweet.tweetPhotoUrl}
    />
  ));

  const TweetSkeletonList = [1, 2, 3, 4, 5].map((i) => (
    <TweetSkeleton key={i} />
  ));

  return (
    <div className="flex flex-col flex-auto justify-start items-start border-r border-[#434343c4] border-l border-solid sm:max-w-[598px] sm:w-[598px] h-full w-full">
      <div className="min-w-full min-h-full">
        {feedData.length === 0 && !loadingFeed ? (
          <NoTweets isCurrentUser={isCurrentUser} />
        ) : (
          <InfiniteScroll
            dataLength={feedData?.length}
            next={getNextData}
            hasMore={hasMore}
            loader={<LoadingSpinner />}
            scrollableTarget="scrollableDiv"
            endMessage={null}
          >
            {loadingFeed ? TweetSkeletonList : FeedTweets}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}

const LoadingSpinner = () => {
  return (
    <div className="w-full flex justify-center align-middle p-4">
      <svg
        className="animate-spin -ml-1 mr-3 h-6 w-6 text-sky-500"
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
    </div>
  );
};

function NoTweets({ isCurrentUser }) {
  return (
    <div className="w-full h-full px-4 pb-8 flex justify-center items-center flex-col flex-1">
      <h1 className="text-2xl font-bold text-white pb-1 pt-5">No Tweets Yet</h1>
      {isCurrentUser && (
        <p className=" text-sm pb-3">Your tweets will show up here</p>
      )}
      {!isCurrentUser && (
        <p className=" text-sm pb-3">Tweets will show up here</p>
      )}
    </div>
  );
}
