import React from "react";
import { NavLink } from "react-router-dom";

export default function ProfileFeedNav({ profileData }) {
  const navData = [
    { title: "Tweets", route: `/profile/${profileData.displayName}` },
    {
      title: "Tweets & replies",
      route: "/profile/with_replies",
      disabled: true,
    },
    { title: "Media", route: "/profile/media", disabled: true },
    { title: "Likes", route: "/profile/likes", disabled: true },
  ];

  const navItems = navData.map((item) => {
    const NavStyle =
      "flex grow items-center justify-center hover:bg-[#0b0b0b] cursor-pointer transition ease-in-out delay-50 text-gray-400 h-full";

    return (
      <NavLink
        to={item.route}
        key={item.title}
        onClick={(e) => {
          if (item.disabled) {
            alert("This feature is not yet available");
          }
        }}
        className={(navData) =>
          navData.isActive
            ? `${NavStyle}" border-b-4 border-solid border-sky-500 text-gray-50 h-full pt-1`
            : NavStyle
        }
      >
        <span>{item.title}</span>
      </NavLink>
    );
  });

  const borderStyle = {
    borderBottom: "1px solid rgb(31 41 5)",
  };

  return (
    <div
      className="w-full min-h-[53px] h-[53px] max-h-[53px] flex flex-row items-center text-sm border border-gray-800"
      style={borderStyle}
    >
      {navItems}
    </div>
  );
}
