import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../Firebase";

export default async function handleBookmark({
  userData,
  setUserData,
  isBookmarked,
  tweetData,
  setIsBookmarked,
}) {
  //if tweet is bookmarked, remove it from bookmarks
  if (isBookmarked) {
    //update user state
    setUserData((user) => ({
      ...user,
      bookmarks: user?.bookmarks.filter(
        (bookmark) => bookmark !== tweetData?.tweetId
      ),
    }));

    //update user in firestore
    await updateDoc(doc(db, "Users", `${userData?.uid}`), {
      bookmarks: arrayRemove(tweetData?.tweetId),
    });

    setIsBookmarked(false);
  }

  //update localUser in localStorage
  localStorage.setItem(
    "localUser",
    JSON.stringify({
      ...userData,
      bookmarks: userData.bookmarks.filter(
        (bookmark) => bookmark !== tweetData?.tweetId
      ),
    })
  );

  //if tweet is not bookmarked, add it to bookmarks
  if (!isBookmarked) {
    //update user state
    setUserData({
      ...userData,
      bookmarks: [...userData?.bookmarks, tweetData?.tweetId],
    });

    //update user in firestore
    await updateDoc(doc(db, "Users", `${userData?.uid}`), {
      bookmarks: arrayUnion(tweetData?.tweetId),
    });

    //update localUser in localStorage
    localStorage.setItem(
      "localUser",
      JSON.stringify({
        ...userData,
        bookmarks: [...userData.bookmarks, tweetData?.tweetId],
      })
    );
    setIsBookmarked(true);
  }
}
