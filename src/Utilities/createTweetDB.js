import { doc, setDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { firebaseStorage } from "../Firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default async function createTweetDB(
  tweetMessage,
  tweetImage,
  userData
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

    // Upload image to firebase storage
    let imageurl = null;
    if (tweetImage !== null) {
      const storageRef = ref(firebaseStorage, `tweetImages/${tweetId}`);
      await uploadBytes(storageRef, tweetImage);
      imageurl = await getDownloadURL(storageRef);
    }

    await setDoc(doc(db, "Tweets", `${tweetId}`), {
      tweetId: tweetId,
      threadId: tweetId,
      uid: userData.uid,
      displayName: userData?.displayName,
      name: userData.name,
      photoURL: userData?.photoURL,
      tweetPhotoUrl: imageurl,
      tweet: tweetMessage,
      timestamp: tweetTimestamp,
      likeCount: null,
      likedBy: [],
      retweets: null,
    });

    await setDoc(doc(db, "Threads", `${tweetId}`), {
      thread: [],
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
