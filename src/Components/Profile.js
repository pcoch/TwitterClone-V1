import { React, useState, useRef, useEffect } from "react";
import ProfileTweets from "./ProfileTweets";
import HomeMenu from "./HomeMenu";
import AltFeed from "./AltFeed";
import { useParams } from "react-router-dom";
import { db } from "../Firebase";
import { query, getDocs, where, collection } from "firebase/firestore";
import ProfileFeedHeader from "./ProfileFeedHeader";
import ProfileFeedBar from "./ProfileFeedBar";
import Notification from "./Notification";

export default function Profile({
  userData,
  setUserData,
  setSignedIn,
  showNotification,
  setShowNotification,
  newModalTweet,
  setNewModalTweet,
}) {
  const [profileData, setProfileData] = useState({});
  const [isCurrentUser, setIsCurrentUser] = useState(
    userData?.displayName === profileData?.displayName ? true : false
  );

  const { displayName } = useParams();
  const scrollableDiv = useRef();

  useEffect(() => {
    setIsCurrentUser(
      userData?.displayName === profileData?.displayName ? true : false
    );
  }, [profileData, userData]);

  useEffect(() => {
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  });

  //get profile data from firestore
  useEffect(() => {
    async function getProfileData() {
      const q = query(
        collection(db, "Users"),
        where("displayName", "==", displayName)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setProfileData(doc.data());
      });

      //get total tweet count from firestore for this user
      const q2 = query(
        collection(db, "Tweets"),
        where("displayName", "==", displayName)
      );
      const querySnapshot2 = await getDocs(q2);
      let tweetCount = 0;
      querySnapshot2.forEach((doc) => {
        tweetCount++;
      });
      setProfileData((prev) => ({ ...prev, tweetCount: tweetCount }));
    }

    getProfileData();
  }, [displayName]);

  return (
    <div
      id="scrollableDiv"
      ref={scrollableDiv}
      className="flex flex-col-reverse justify-between sm:flex sm:flex-row sm:justify-center sm:items-start sm:min-h-screen sm:h-screen sm:overflow-y-scroll sm:max-h-screen scroll-smooth min-h-screen"
    >
      <Notification
        showNotification={showNotification}
        setShowNotification={setShowNotification}
      />
      <HomeMenu
        setSignedIn={setSignedIn}
        userData={userData}
        setUserData={setUserData}
        newModalTweet={newModalTweet}
        setNewModalTweet={setNewModalTweet}
      />
      <div className="flex flex-col justify-start items-start sm:max-w-[598px] sm:w-[598px] min-h-screen">
        <ProfileFeedBar profileData={profileData} />
        <ProfileFeedHeader
          userData={userData}
          profileData={profileData}
          setUserData={setUserData}
          isCurrentUser={isCurrentUser}
        />
        <ProfileTweets
          profileData={profileData}
          isCurrentUser={isCurrentUser}
          userData={userData}
          newModalTweet={newModalTweet}
        />
      </div>
      <AltFeed
        setUserData={setUserData}
        profileData={profileData}
        userData={userData}
      />
    </div>
  );
}
