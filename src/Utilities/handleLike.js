import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../Firebase";

export default async function handleLike({
  tweetData,
  setTweetData,
  setLiked,
  liked,
}) {
  const localUserId = JSON.parse(localStorage.getItem("localUser")).uid;

  if (liked) {
    //update tweet state
    setTweetData((tweet) => ({
      ...tweet,
      likeCount: tweet.likeCount - 1,
      likedBy: tweet.likedBy.filter((user) => user !== localUserId),
    }));

    //update tweet in firestore
    await updateDoc(doc(db, "Tweets", `${tweetData?.tweetId}`), {
      likeCount: tweetData?.likeCount - 1,
      likedBy: arrayRemove(localUserId),
    });

    setLiked(false);
  }

  if (!liked) {
    //update tweet state
    setTweetData({
      ...tweetData,
      likeCount: tweetData?.likeCount + 1,
      likedBy: [...tweetData?.likedBy, localUserId],
    });

    //update tweet in firestore
    await updateDoc(doc(db, "Tweets", `${tweetData?.tweetId}`), {
      likeCount: tweetData?.likeCount + 1,
      likedBy: arrayUnion(localUserId),
    });

    setLiked(true);
  }
}
