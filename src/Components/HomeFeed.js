import { React, useState, useEffect } from "react";
import Tweetbox from "./Tweetbox";
import { TweetSkeleton } from "./TweetSkeleton";
import Tweet from "./Tweet";
import InfiniteScroll from "react-infinite-scroll-component";
import { db } from "../Firebase";
import {
  collection,
  query,
  startAfter,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";

export default function HomeFeed({ userData }) {
  const [feedData, setFeedData] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [lastVisible, setLastVisible] = useState();
  const [hasMore, setHasMore] = useState(true);

  async function getData() {
    const initArr = [];
    const windowHeight = window.innerHeight / 122;

    try {
      if (userData?.following !== undefined) {
        setLoadingFeed(true);
        // Query the first page of docs
        const first = query(
          collection(db, "Tweets"),
          where("uid", "in", userData?.following),
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
        orderBy("timestamp", "desc"),
        where("uid", "in", userData?.following),
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
  }, [userData?.following]);

  const FeedTweets = feedData.map((tweet) => (
    <Tweet
      name={tweet.name}
      displayName={tweet.displayName}
      photoURL={tweet.photoURL}
      userPhotoURL={userData.photoURL}
      tweet={tweet.tweet}
      timestamp={tweet.timestamp}
      tweetId={tweet.tweetId}
      threadId={tweet?.threadId}
      key={tweet.tweetId}
      tweetPhotoUrl={tweet.tweetPhotoUrl}
    />
  ));

  const TweetSkeletonList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
    <TweetSkeleton key={i} />
  ));

  return (
    <div className="border-r border-[#434343c4] border-l border-solid pt-4 flex flex-col flex-auto justify-start items-start sm:max-w-[598px] sm:w-[598px] min-h-full w-full">
      <h3 className="w-full font-bold text-lg text-gray-100 px-4">Home</h3>
      <Tweetbox userData={userData} />
      {feedData.length > 0 && (
        <div className="w-full">
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
        </div>
      )}
      {feedData.length <= 0 && (
        <div className="h-max w-full justify-center flex flex-col items-center">
          <h1 className="text-2xl font-bold text-white pb-1 pt-5">
            No Tweets Yet
          </h1>
          <p className=" text-sm pb-3">Follow others to see Tweets!</p>
        </div>
      )}
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
