import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function ProfileFeedBar({ profileData }) {
  const navigate = useNavigate();

  return (
    <div className="z-20 min-w-full max-w-full flex justify-start min-h-[44px] pt-4 sticky top-0 backdrop-blur-lg bg-black/60 border-b border-[#434343c4] border-solid border-r border-l">
      <div className="flex justify-start items-center w-16 min-h-full pl-4">
        <span
          className="cursor-pointer hover:bg-[#1c1c1cc7] w-10 h-10 flex justify-center items-center rounded-3xl transition-all"
          onClick={() => navigate(-1)}
        >
          <IoMdArrowRoundBack color="white" fontSize="1.25em" />
        </span>
      </div>
      <div>
        <h3 className="text-lg font-bold text-white">
          {profileData.displayName ? profileData.displayName : "..."}
        </h3>
        {profileData?.tweetCount ? (
          <p className="text-xs text-gray-400">
            {profileData?.tweetCount ? `${profileData?.tweetCount} Tweets` : ""}
          </p>
        ) : (
          <p className="text-xs text-gray-400">
            {profileData?.name ? `${profileData?.name}` : ""}
          </p>
        )}
      </div>
    </div>
  );
}
