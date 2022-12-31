import React from "react";
import { getAuth } from "firebase/auth";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase";

export default function FollowButton({ profileData, setUserData }) {
  function followUser() {
    const auth = getAuth();
    const currentUserId = auth.currentUser.uid;

    //add current profiles id to users followers array
    async function addFollower() {
      const docRef = doc(db, "Users", currentUserId);
      await updateDoc(docRef, {
        following: arrayUnion(profileData?.uid),
      });

      // update local storage
      const data = localStorage.getItem("localUser");
      const localUserData = JSON.parse(data);
      await localUserData.following.push(profileData?.uid);

      if (localUserData) {
        localStorage.setItem("localUser", JSON.stringify(localUserData));
        setUserData((prev) => localUserData);
      }
    }
    addFollower();

    //add users id to current users following array
    async function addFollowing() {
      const docRef = doc(db, "Users", profileData?.uid);
      await updateDoc(docRef, {
        followers: arrayUnion(currentUserId),
      });
    }
    addFollowing();
  }

  return (
    <button
      onClick={followUser}
      className="mr-4 flex items-center justify-center w-[98px] h-auto bg-white font-bold text-sm text-black rounded-3xl pl-5 pr-5 pt-2 pb-2 hover:brightness-90"
    >
      Follow
    </button>
  );
}
