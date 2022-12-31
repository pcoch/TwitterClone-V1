import { React } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileAvatar({ nav }) {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("localUser"));
  const photoURL = userData?.photoURL;

  function handleNav() {
    navigate("/profile/" + userData.displayName);
  }

  return (
    <div className="relative max-h-[40px] max-w-[40px] min-h-[40px] min-w-[40px] cursor-pointer flex justify-start align-center">
      <img
        rel="preload"
        src={photoURL}
        alt="alt"
        className="rounded-full object-cover"
        onClick={nav && handleNav}
      />
    </div>
  );
}
