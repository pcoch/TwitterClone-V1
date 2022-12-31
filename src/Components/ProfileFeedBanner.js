import { React, useState, useEffect } from "react";
import AvatarLarge from "./AvatarLarge";
import EditProfile from "./EditProfile";
import BannerImage from "./BannerImage";
import FollowButton from "./FollowButton";
import UnfollowButton from "./UnfollowButton";

export default function ProfileFeedBanner({
  userData,
  setUserData,
  profileData,
  isCurrentUser,
}) {
  //check if current user is following this profile
  const [isFollowing, setIsFollowing] = useState(
    userData?.following?.includes(profileData?.uid)
  );

  //check if signedin user is following current profile
  useEffect(() => {
    setIsFollowing(userData?.following?.includes(profileData?.uid));
  }, [userData, profileData]);

  return (
    <div
      id="profilefeedbanner"
      className="w-full max-h-[200px] min-h-[200px] bg-gray-500 relative"
    >
      <BannerImage
        editBtn={false}
        profileData={profileData}
        userData={userData}
      />
      <AvatarLarge
        userData={userData}
        profileData={profileData}
        isCurrentUser={isCurrentUser}
      />
      <div className="w-full min-h-[60px] flex justify-end items-center">
        {userData.displayName === profileData.displayName ? (
          <EditProfile
            userData={userData}
            setUserData={setUserData}
            profileData={profileData}
          />
        ) : isFollowing ? (
          <UnfollowButton profileData={profileData} setUserData={setUserData} />
        ) : (
          <FollowButton profileData={profileData} setUserData={setUserData} />
        )}
      </div>
    </div>
  );
}
