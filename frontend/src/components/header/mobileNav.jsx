import React from "react";
import { Link } from "react-router-dom";

import { GoHome, GoBell } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import { LuUser } from "react-icons/lu";

import { CreateMobilePost } from "../../fragments/createPost/createPost";

const MobileNav = ({authUser, scrollDirection}) => {
  return (
  <nav className={`w-full fixed left-0 bottom-0 px-4 bg-white/60 backdrop-blur-sm border-t border-t-white-gray z-30 lg:hidden ${scrollDirection === "down" ? 'opacity-25 delay-300' : "opacity-100 delay-700"}`}>
      <ul className="w-full max-w-[500px] mx-auto flex justify-between gap-2 text-sm">
        <li className="w-[78.38px] py-2 lg:px-4">
          <Link
            to="/"
            className="flex flex-col gap-1 items-center justify-center"
          >
            <GoHome className="h-5 text-lg" />
            Home
          </Link>
        </li>
        <li className="w-[78.38px] py-2 lg:px-4">
          <Link
            to="/explore"
            className="flex flex-col gap-1 items-center justify-center"
          >
            <CiSearch className="h-5 text-lg" />
            Exsplore
          </Link>
        </li>
        <li className="w-[78.38px] py-2 lg:px-4 flex justify-center items-center">
          <CreateMobilePost />
        </li>
        <li className="w-[78.38px] py-2 lg:px-4">
          <Link
            to="/notifications"
            className="flex flex-col gap-1 items-center justify-center"
          >
            <GoBell className="h-5 text-lg" />
            Notifications
          </Link>
        </li>
        <li className="w-[78.38px] py-2 lg:px-4">
          <Link
            to={`/profile/${authUser.username}`}
            className="flex flex-col gap-1 items-center justify-center"
          >
            <LuUser className="h-5 text-lg" />
            Profile
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MobileNav;
