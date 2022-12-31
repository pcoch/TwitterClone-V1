import { React, useEffect, useState, useRef } from "react";
import { db } from "../Firebase";
import { collection, query, limit, where, getDocs } from "firebase/firestore";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

export default function AltFeed({ userData, setUserData }) {
  return (
    <div className="hidden xl:flex xl:min-h-screen flex-col justify-start items-center box-border overflow-y-scroll sticky top-0">
      <div className="w-[320px] mt-4 ml-6 py-4 min-h-[300px] bg-slate-700 h-auto rounded-3xl bg-[#1c1c1cc7] flex flex-col gap-2">
        <h3 className="text-lg font-bold text-white pl-4">What's happening</h3>
        <HappeningItem />
      </div>
      <div className="w-[320px] mt-4 ml-6 py-4 min-h-[300px] bg-slate-700 h-auto rounded-3xl bg-[#1c1c1cc7] flex flex-col gap-2">
        <h3 className="text-lg font-bold text-white px-4">Who to follow</h3>
        <WhoToFollow setUserData={setUserData} userData={userData} />
      </div>
    </div>
  );
}

function HappeningItem() {
  const happeningData = [
    {
      title: "Trending On Twitter",
      subtitle: "AI Took Our Jobs",
      subtitle2: "1.2M Tweets",
      img: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
    },
    {
      title: "New In Australia",
      subtitle: "AI Is Taking Over",
      subtitle2: "500K Tweets",
      img: "https://pbs.twimg.com/media/ErKyhexXAAEQSM8.jpg",
    },
    {
      title: "Trending · Travel",
      subtitle: "Hong Kong",
      subtitle2: "1.5K Tweets",
      img: "https://images.unsplash.com/photo-1616394158624-a2ba9cfe2994?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    },
  ];

  const ListItems = happeningData.map((item) => (
    <div
      key={item.title}
      onClick={() => alert("Under Construction 🚧")}
      className="flex flex-row justify-between items-center min-w-full hover:bg-[#2c2c2cc7] cursor-pointer px-4 py-2"
    >
      <div className="flex flex-col gap-0.5">
        <p className="text-xs text-gray-400">{item.title}</p>
        <p className="text-sm text-white font-bold">{item.subtitle}</p>
        <p className="text-xs text-gray-400">{item.subtitle2}</p>
      </div>
      <img
        className="rounded-lg w-[75px] h-[75px] object-cover"
        alt="img"
        src={item.img}
      ></img>
    </div>
  ));

  return <div>{ListItems}</div>;
}

function WhoToFollow({ setUserData, userData }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const arr = [];

    const getSuggestedUsers = async () => {
      const q = query(
        collection(db, "Users"),
        where("uid", "!=", userData?.uid),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        arr.push(doc.data());
      });
      const filteredArr = arr.filter(
        (user) => !user?.followers.includes(userData?.uid)
      );
      filteredArr.length = 3;
      setUsers((prev) => filteredArr);
    };
    getSuggestedUsers();
    setTimeout(() => {
      setLoading(false);
    }, 750);
  }, [userData?.following, userData?.uid]);

  const UserList = users.map((user) => (
    <SuggestedUser
      displayName={user.displayName}
      name={user.name}
      photoURL={user.photoURL}
      uid={user.uid}
      key={user.uid}
      setUserData={setUserData}
    />
  ));

  return loading ? (
    <>
      <UserSkeleton />
      <UserSkeleton />
      <UserSkeleton />
    </>
  ) : (
    <>
      <>{UserList}</>
    </>
  );
}

function SuggestedUser(props) {
  const navigate = useNavigate();
  const followButton = useRef();
  //functions to handle adding following/follower to DB
  //add the selected profile to the signedIn user's following list
  function followUser(e) {
    const selectedProfileId = followButton.current?.id;

    const auth = getAuth();
    const signedInUserId = auth.currentUser.uid;

    e.stopPropagation();

    async function addFollowing() {
      const docRef = doc(db, "Users", signedInUserId);
      await updateDoc(docRef, {
        following: arrayUnion(selectedProfileId),
      });
      // update local storage
      const data = localStorage.getItem("localUser");
      const localUserData = JSON.parse(data);
      await localUserData.following.push(selectedProfileId);
      if (localUserData) {
        localStorage.setItem("localUser", JSON.stringify(localUserData));
        props.setUserData((prev) => localUserData);
      }
    }
    addFollowing();

    //add the signedIn user to the selected profile's followers list
    async function addFollower() {
      const docRef = doc(db, "Users", selectedProfileId);
      await updateDoc(docRef, {
        followers: arrayUnion(signedInUserId),
      });
    }
    addFollower();
  }

  return (
    <div
      onClick={() => navigate(`/profile/${props.displayName}`)}
      key={props.uid}
      id={props.uid}
      className="flex flex-row justify-between items-center min-w-full cursor-pointer hover:bg-[#2c2c2cc7] h-[70px] px-4"
    >
      <div className="flex flex-row gap-3">
        <div className="min-h-[40px] min-w-[40px] max-h-[40px] max-w-[40px] cursor-pointer">
          <img
            src={props.photoURL}
            alt="alt"
            className="h-10 rounded-full object-cover"
            onClick={() => navigate(`/profile/${props.displayName}`)}
          />
        </div>
        <div className="flex flex-col gap-0.5 justify-center">
          <p
            className="text-sm text-white font-bold hover:underline"
            onClick={() => navigate(`/profile/${props.displayName}`)}
          >
            {props.displayName}
          </p>
          <p className="text-xs text-gray-400">{props.name}</p>
        </div>
      </div>
      <button
        id={props.uid}
        ref={followButton}
        onClick={(e) => followUser(e)}
        className="flex items-center justify-center w-auto h-auto bg-white font-bold text-sm text-black rounded-3xl pl-5 pr-5 pt-2 pb-2 hover:brightness-90"
      >
        Follow
      </button>
    </div>
  );
}

function UserSkeleton() {
  return (
    <div className="flex flex-row justify-between items-center min-w-full cursor-pointer hover:bg-[#2c2c2cc7] h-[70px] px-4">
      <div className="flex flex-row gap-3">
        <div className="min-h-[40px] min-w-[40px] cursor-pointer">
          <Skeleton circle={true} height={40} width={40} />
        </div>
        <div className="flex flex-col gap-1 justify-center">
          <Skeleton height={15} width={70} />
          <Skeleton height={15} width={100} />
        </div>
      </div>
      <Skeleton height={40} width={100} style={{ borderRadius: "30px" }} />
    </div>
  );
}
