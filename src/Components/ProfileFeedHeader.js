import ProfileFeedNav from "./ProfileFeedNav";
import ProfileFeedBanner from "./ProfileFeedBanner";
import { BsCalendar3 } from "react-icons/bs";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { React } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileFeedHeader({
  userData,
  setUserData,
  profileData,
  isCurrentUser,
}) {
  const navigate = useNavigate();

  //get following and follower length if profileData is not empty
  const followingLength = userData?.following?.length;
  const followerLength = userData?.followers?.length;

  return (
    <div className="w-full h-auto border-r border-[#434343c4] border-l border-solid">
      <ProfileFeedBanner
        userData={userData}
        setUserData={setUserData}
        profileData={profileData}
        isCurrentUser={isCurrentUser}
      />
      <div className="p-4 pt-[80px]">
        <h2 className="text-xl font-bold text-white min-h-10">
          {isCurrentUser ? userData?.name : profileData?.name || "..."}
        </h2>
        <h3 className="text-sm text-gray-400 min-h-10">
          {profileData?.displayName ? `@${profileData?.displayName}` : "..."}
        </h3>
      </div>
      <div className="p-4 pt-0">
        <p className="text-sm text-white">
          {isCurrentUser ? userData?.bio : profileData?.bio}
        </p>
      </div>
      <div className="flex flex-row gap-6">
        <div className="pb-4 pl-4 flex flex-row gap-1">
          <HiOutlineLocationMarker className="text-gray-400" />
          <p className="text-sm text-gray-400">
            {isCurrentUser
              ? userData?.location
              : profileData?.location || "Add Location"}
          </p>
        </div>
        <div className="pb-4 flex flex-row gap-2">
          <BsCalendar3 className="text-gray-400" />
          <p className="text-sm text-gray-400">
            Joined{" "}
            {new Date(profileData?.creationTime).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      {isCurrentUser && (
        <div className="text-xs pl-4 pb-4 flex flex-row gap-4 text-gray-400">
          <span
            onClick={() => navigate("/following")}
            className="hover:underline hover:cursor-pointer"
          >
            <span className="font-bold text-white ">{followingLength} </span>
            Following
          </span>
          <span
            onClick={() => navigate("/followers")}
            className="hover:underline hover:cursor-pointer"
          >
            <span className="font-bold text-white">{followerLength} </span>
            Followers
          </span>
        </div>
      )}
      <ProfileFeedNav profileData={profileData} />
    </div>
  );
}
