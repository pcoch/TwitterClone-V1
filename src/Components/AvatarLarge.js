import { React, useState } from "react";
import ChangeImgBtn from "./ChangeImgBtn";
import Skeleton from "react-loading-skeleton";

export default function AvatarLarge({
  editBtn,
  setPhotoURL,
  profileData,
  userData,
  isCurrentUser,
}) {
  const [placeholderAvatar, setPlaceholderAvatar] = useState(null);

  return (
    <div className="z-10 min-h-[130px] max-h-[130px] max-w-[130px] min-w-[130px] rounded-full bg-white absolute -bottom-16 left-4 flex items-center justify-center border-solid border-2 border-white">
      {profileData.photoURL && placeholderAvatar === null && (
        <img
          src={isCurrentUser ? userData?.photoURL : profileData?.photoURL}
          alt="alt"
          className="h-full w-full rounded-full absolute transition-all z-10 object-cover"
        />
      )}

      {!profileData.photoURL && placeholderAvatar === null && (
        <div className="h-full w-full rounded-full absolute transition-all z-10 object-cover">
          <Skeleton className="h-full w-full" circle={true} />
        </div>
      )}

      {placeholderAvatar && (
        <img
          src={placeholderAvatar}
          alt="alt"
          className="h-full w-full rounded-full absolute transition-all z-10 object-cover"
        />
      )}
      {editBtn && (
        <ChangeImgBtn
          stateType={setPhotoURL}
          setPlaceholderAvatar={setPlaceholderAvatar}
        />
      )}
    </div>
  );
}
