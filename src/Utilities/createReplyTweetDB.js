import { doc, setDoc, arrayUnion, updateDoc } from "firebase/firestore";
import { db } from "../Firebase";

export default async function createReplyTweetDB(
  tweetMessage,
  userData,
  tweetData
) {
  try {
    const tweetId = Math.floor(Math.random() * 1000000000000000000);
    const tweetTimestamp = new Date().toLocaleString("en-US", {
      hour12: true,
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
    const threadId = tweetData?.threadId;

    await setDoc(doc(db, "Tweets", `${tweetId}`), {
      tweetId: tweetId,
      threadId: tweetData?.threadId,
      uid: userData?.uid,
      displayName: userData?.displayName,
      name: userData?.name,
      photoURL: userData?.photoURL,
      tweet: tweetMessage,
      timestamp: tweetTimestamp,
      likes: null,
      retweets: null,
      reply: true,
      likeCount: null,
      likedBy: [],
    });

    await updateDoc(doc(db, "Threads", `${threadId}`), {
      thread: arrayUnion(tweetId),
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
