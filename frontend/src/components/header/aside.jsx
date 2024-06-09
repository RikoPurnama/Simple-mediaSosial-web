import React from "react";
import { Link } from "react-router-dom";

import { GoHome, GoBell } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import { LuUsers, LuUser } from "react-icons/lu";
import { BiLogOut } from "react-icons/bi";
import { IoBookmarkOutline } from "react-icons/io5";


import v from "/V.svg";


const Aside = ({ authUser, logout }) => {
  return (
    <aside className="h-screen lg:h-auto bg-white py-5 px-4 lg:border lg:border-white-gray lg:rounded-[25px]">
      <div
        style={{ backgroundImage: `url(${v})` }}
        className="w-[70px] h-[80px] bg-cover bg-center mx-auto pr-1 hidden lg:block"
      ></div>

      <div
        className={`lg:hidden bg-white flex gap-2 items-center justify-between bottom-5 px-4 pb-4 lg:border lg:border-white-gray rounded-[25px]`}
      >
        <Link
          to={`/profile/${authUser.username}`}
          style={{
            backgroundImage: `url(${authUser.profileImg || "/profile.png"})`,
          }}
          className="w-[50px] h-[50px] bg-cover bg-center rounded-full"
        ></Link>
        <div className="flex flex-col">
          <h1 className="text-md font-bold leading-5 hover:underline">
            {authUser.fullname}
          </h1>
          <Link
            to={`/profile/${authUser.username}`}
            className=" text-gray"
          >
            @{authUser.username}
          </Link>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            logout();
          }}
          className="text-xl cursor-pointer"
        >
          <BiLogOut />
        </button>
      </div>

      <ul className="flex flex-col py-5 text-lg lg:text-base">
        <li className="hover:bg-input py-2 px-4 rounded-xl">
          <Link to="/" className="flex gap-2 items-center">
            <GoHome />
            Home
          </Link>
        </li>
        <li className="hover:bg-input py-2 px-4 rounded-xl">
          <Link to="/explore" className="flex gap-2 items-center">
            <CiSearch />
            Exsplore
          </Link>
        </li>
        <li className="hover:bg-input py-2 px-4 rounded-xl">
          <Link to="/notifications" className="flex gap-2 items-center">
            <GoBell />
            Notifications
          </Link>
        </li>
        <li className="hover:bg-input py-2 px-4 rounded-xl">
          <Link to={`/bookmarks/${authUser._id}`} className="flex gap-2 items-center">
            <IoBookmarkOutline />
            Bookmarks
          </Link>
        </li>
        <li className="hover:bg-input py-2 px-4 rounded-xl">
          <Link to="/room" className="flex gap-2 items-center">
            <LuUsers />
            Room School
          </Link>
        </li>
        <li className="hover:bg-input py-2 px-4 rounded-xl hidden lg:block">
          <Link
            to={`/profile/${authUser.username}`}
            className="flex gap-2 items-center"
          >
            <LuUser />
            Profile
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Aside;
