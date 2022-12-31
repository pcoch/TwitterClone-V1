import { React, useState, useEffect } from "react";
import ChangeImgBtn from "./ChangeImgBtn";
import Skeleton from "react-loading-skeleton";

export default function BannerImage({
  editBtn,
  setBannerURL,
  profileData,
  userData,
}) {
  const [loading, setLoading] = useState(false);
  const [placeholderImg, setPlaceholderImg] = useState(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 850);
  }, [profileData]);

  //check if current page is signed in user's profile
  const currentUser = userData?.displayName === profileData?.displayName;
  const currentProfile = userData?.displayName !== profileData?.displayName;
  const hasBanner =
    profileData?.bannerURL || userData?.bannerURL || placeholderImg;

  return (
    <div className="max-h-[200px] min-h-[200px] w-full relative flex items-center justify-center bg-zinc-600 transition-all">
      {loading && (
        <div className="absolute min-h-[201px] min-w-full transition-all">
          <Skeleton height={201} borderRadius={0} />
        </div>
      )}

      {currentUser && hasBanner && (
        <img
          className="object-cover w-full h-full absolute"
          src={placeholderImg ? placeholderImg : userData?.bannerURL}
          alt="img"
        ></img>
      )}

      {currentProfile && (
        <img
          className="object-cover w-full h-full absolute"
          src={profileData?.bannerURL}
          alt="img"
        ></img>
      )}

      {editBtn && (
        <ChangeImgBtn
          stateType={setBannerURL}
          setPlaceholderImg={setPlaceholderImg}
        />
      )}
    </div>
  );
}
