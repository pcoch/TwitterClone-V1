import React from "react";
import HomeMenu from "./HomeMenu";
import AltFeed from "./AltFeed";
import ProfileFeedBar from "./ProfileFeedBar";
import FollowerUserList from "./FollowerUserList";

export default function Following({ setSignedIn, userData, setUserData }) {
  return (
    <div className="flex flex-col-reverse justify-between sm:flex sm:flex-row sm:justify-center sm:items-start sm:min-h-screen sm:h-screen sm:overflow-y-scroll sm:max-h-screen scroll-smooth min-h-screen">
      <HomeMenu
        setSignedIn={setSignedIn}
        userData={userData}
        setUserData={setUserData}
      />
      <div className="flex flex-col justify-start items-start border-r border-[#434343c4] border-l border-solid sm:max-w-[598px] sm:w-[598px]">
        <ProfileFeedBar profileData={userData} />
        <FollowerUserList userData={userData} setUserData={setUserData} />
      </div>
      <AltFeed setUserData={setUserData} userData={userData} />
    </div>
  );
}
