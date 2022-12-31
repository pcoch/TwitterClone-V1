import { React, memo } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

const Avatar = memo(function Avatar({ tweetData, nav }) {
  const navigate = useNavigate();

  function handleNav() {
    navigate("/profile/" + tweetData?.displayName);
  }

  // //if tweetdata exists render avatar for tweet
  if (tweetData) {
    return (
      <div className="min-h-[40px] min-w-[40px] cursor-pointer">
        <img
          src={tweetData?.photoURL}
          alt="alt"
          className="h-[40px] min-w-auto rounded-full"
          onClick={nav && handleNav}
        />
      </div>
    );
  } else {
    return (
      <div className="min-h-[40px] min-w-[40px] cursor-pointer">
        <Skeleton circle={true} height={40} width={40} />
      </div>
    );
  }
});

export default Avatar;
