import { React } from "react";
import HomeMenu from "./HomeMenu";
import AltFeed from "./AltFeed";
import ProfileFeedBar from "./ProfileFeedBar";
import { useNavigate } from "react-router-dom";

export default function NotFound({ setSignedIn, userData, setUserData }) {
  return (
    <div className="flex flex-col-reverse justify-between sm:flex sm:flex-row sm:justify-center sm:items-start sm:min-h-screen sm:h-screen sm:overflow-y-scroll sm:max-h-screen scroll-smooth min-h-screen">
      <HomeMenu
        setSignedIn={setSignedIn}
        userData={userData}
        setUserData={setUserData}
      />
      <div className="flex flex-col justify-start items-start border-r border-[#434343c4] border-l border-solid sm:max-w-[598px] sm:w-[598px] min-h-full">
        <ProfileFeedBar profileData={userData} />
        <Placeholder />
      </div>
      <AltFeed setUserData={setUserData} userData={userData} />
    </div>
  );
}

function Placeholder() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center w-full pt-8">
      <h1 className="text-2xl font-bold text-white pb-4">Page Not Found</h1>
      <div className="text-4xl pb-4">🤷‍♂️</div>
      <button
        onClick={() => navigate("/home")}
        className="flex items-center justify-center w-[154px] h-auto bg-white font-bold text-sm text-black rounded-3xl pl-5 pr-5 pt-2 pb-2 hover:brightness-90"
      >
        Return Home
      </button>
    </div>
  );
}
