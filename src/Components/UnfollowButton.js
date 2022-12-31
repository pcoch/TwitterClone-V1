import React from "react";
import { getAuth } from "firebase/auth";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase";

export default function UnfollowButton({ profileData, setUserData }) {
  function unfollowUser() {
    const auth = getAuth();
    const currentUserId = auth.currentUser.uid;

    //add current users id to users followers array
    async function removeFollower() {
      const docRef = doc(db, "Users", currentUserId);
      await updateDoc(docRef, {
        following: arrayRemove(profileData?.uid),
      });
    }
    removeFollower();

    //add users id to current users following array
    async function removeFollowing() {
      const docRef = doc(db, "Users", profileData?.uid);
      await updateDoc(docRef, {
        followers: arrayRemove(currentUserId),
      });
      // update local storage. Don't need to update state because it will be updated on page refresh.
      const data = localStorage.getItem("localUser");
      const localUserData = JSON.parse(data);
      const filteredFollowing = localUserData.following.filter(
        (id) => id !== profileData?.uid
      );
      //update filtered following array
      localUserData.following = filteredFollowing;
      if (localUserData) {
        localStorage.setItem("localUser", JSON.stringify(localUserData));
        setUserData((prev) => localUserData);
      }
    }
    removeFollowing();
  }

  return (
    <button
      onClick={unfollowUser}
      className="group mr-4 flex items-center justify-center min-w-[105px] h-auto bg-black font-bold text-sm text-white border-gray-500 border-solid border rounded-3xl pt-2 pb-2 hover:border-[#7d0d0d] hover:bg-[#1c0101]"
    >
      <span className="group-hover:hidden">Following</span>
      <span className="hidden group-hover:block group-hover:text-red-500">
        Unfollow
      </span>
    </button>
  );
}
