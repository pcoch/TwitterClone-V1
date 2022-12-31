import { React, useRef } from "react";
import HomeMenu from "./HomeMenu";
import HomeFeed from "./HomeFeed";
import AltFeed from "./AltFeed";

export default function Home({
  setSignedIn,
  userData,
  setUserData,
  loading,
  setNewModalTweet,
}) {
  const scrollableDiv = useRef();

  return (
    <div
      id="scrollableDiv"
      ref={scrollableDiv}
      className="flex flex-col-reverse justify-between sm:flex sm:flex-row sm:justify-center sm:items-start sm:min-h-screen sm:h-screen sm:overflow-y-scroll sm:max-h-screen scroll-smooth min-h-screen"
    >
      <HomeMenu
        setSignedIn={setSignedIn}
        userData={userData}
        setUserData={setUserData}
        setNewModalTweet={setNewModalTweet}
      />
      <HomeFeed userData={userData} scrollableDiv={scrollableDiv} />
      <AltFeed setUserData={setUserData} userData={userData} />
    </div>
  );
}
