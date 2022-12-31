import { React, useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { useNavigate } from "react-router-dom";

export default function FollowerUserList({ userData, setUserData }) {
  const [followerData, setFollowerData] = useState([]);

  const navigate = useNavigate();

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

    if (userData?.followers !== undefined) {
      let arr = [];

      userData?.followers.forEach((user) => {
        getUserDB(user).then((data) => {
          arr.push(data);
          setFollowerData(arr);
        });
      });
    }
  }, [userData]);

  const followerList = followerData.map((user) => {
    return (
      <div
        key={user.uid}
        className="flex items-center p-3 min-w-full hover:bg-[#2c2c2cc7] cursor-pointer transition-all  border-b border-[#434343c4] border-solid"
        onClick={() => navigate(`/profile/${user.displayName}`)}
      >
        <img
          src={user.photoURL}
          alt="user-avatar"
          className="max-w-[40px] max-h-[40px] rounded-full mr-4"
        />
        <div className="flex flex-col w-full">
          <div className="pb-1 flex flex-row justify-between min-w-full">
            <div className="flex flex-col">
              <p
                className="text-sm text-white font-bold hover:underline"
                onClick={() => navigate(`/profile/${user.displayName}`)}
              >
                {user.displayName}
              </p>
              <p className="text-sm text-gray-400">@{user.name}</p>
            </div>
          </div>
          <p className="text-sm text-white">{user.bio}</p>
        </div>
      </div>
    );
  });

  return (
    <div className="min-h-full min-w-full flex flex-col">{followerList}</div>
  );
}
