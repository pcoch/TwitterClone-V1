import { React, useState, useEffect } from "react";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "../Firebase";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

//TODO: add the unfollow function to the button component

export default function FollowingUserList({ userData, setUserData }) {
  const [followingData, setFollowingData] = useState([]);

  const navigate = useNavigate();

  function unfollowUser(e) {
    e.stopPropagation();
    const auth = getAuth();
    const currentUserId = auth.currentUser.uid;

    //add current users id to users followers array
    async function removeFollower() {
      const docRef = doc(db, "Users", currentUserId);
      await updateDoc(docRef, {
        following: arrayRemove(e.target.id),
      });
    }
    removeFollower();

    //add users id to current users following array
    async function removeFollowing() {
      const docRef = doc(db, "Users", e.target.id);
      await updateDoc(docRef, {
        followers: arrayRemove(currentUserId),
      });
      // update local storage. Don't need to update state because it will be updated on page refresh.
      const data = localStorage.getItem("localUser");
      const localUserData = JSON.parse(data);
      const filteredFollowing = localUserData.following.filter(
        (id) => id !== e.target.id
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

  useEffect(() => {
    async function getUserDB(userId) {
      const docRef = doc(db, "Users", `${userId}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("No such document!");
      }
    }

    if (userData?.following !== undefined) {
      let arr = [];

      userData?.following.forEach((user) => {
        getUserDB(user).then((data) => {
          arr.push(data);
          setFollowingData(arr);
        });
      });
    }
  }, [userData]);

  const followingList = followingData.map((user) => {
    return (
      <div
        key={user?.uid}
        className="flex items-center p-3 min-w-full hover:bg-[#2c2c2cc7] cursor-pointer transition-all  border-b border-[#434343c4] border-solid"
        onClick={() => navigate(`/profile/${user.displayName}`)}
      >
        <div className="min-w-[40px] min-h-[40px] mr-4">
          <img
            src={user?.photoURL}
            alt="user-avatar"
            className="max-w-[40px] max-h-[40px] rounded-full mr-4"
          />
        </div>
        <div className="flex flex-col w-full">
          <div className="pb-1 flex flex-row justify-between min-w-full">
            <div className="flex flex-col">
              <p
                className="text-sm text-white font-bold hover:underline"
                onClick={() => navigate(`/profile/${user.displayName}`)}
              >
                {user?.displayName}
              </p>
              <p className="text-sm text-gray-400">@{user?.name}</p>
            </div>
          </div>
          <p className="text-sm text-white">{user?.bio}</p>
        </div>
        <button
          id={user?.uid}
          onClick={(e) => unfollowUser(e)}
          className="group mr-4 flex items-center justify-center min-w-[105px] h-auto bg-black font-bold text-sm text-white border-gray-500 border-solid border rounded-3xl pt-2 pb-2 hover:border-[#7d0d0d] hover:bg-[#1c0101]"
        >
          <span id={user?.uid} className="group-hover:hidden">
            Following
          </span>
          <span
            id={user?.uid}
            className="hidden group-hover:block group-hover:text-red-500"
          >
            Unfollow
          </span>
        </button>
      </div>
    );
  });

  return (
    <div className="min-h-full min-w-full flex flex-col">{followingList}</div>
  );
}
