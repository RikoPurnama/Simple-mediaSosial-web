import React, { useEffect, useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaLink } from "react-icons/fa";

import ProfileSkeleton from "../../components/skeletons/ProfileSkeleton";
import useFollow from "../../hooks/useFollow";
import { formatMemberSinceDate } from "../../utils/date";
import Posts from "../../fragments/cardPost/posts";
import EditProfile from "../../fragments/EditProfile/editProfile";
import FollowingBox from "../../fragments/modal/followingBox";

const Profile = () => {
  const [feedType, setFeedType] = useState("posts");
  const [followType, setFollowType] = useState("");

  const { username } = useParams();

  const { follow, isPending } = useFollow();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const {
    data: user,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const { data: post } = useQuery({
    queryKey: ["post"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const isMyProfile = authUser._id === user?._id;
  const memberSinceDate = formatMemberSinceDate(user?.createdAt);
  const amIFollowing = authUser?.following.includes(user?._id);

  useEffect(() => {
    refetch();
  }, [username, refetch]);

  console.log(post)

  return (
    <>
      {isLoading || (isRefetching && <ProfileSkeleton />)}
      {!isLoading && !user && !isRefetching && (
        <p className="text-center my-5 text-lg">User not found</p>
      )}
      {!isLoading && !isRefetching && user && (
        <>
          {/* Header section */}
          <div className="w-full flex justify-between items-center mb-2">
            <span className="flex gap-2 items-center ">
              <Link to={"/"}>
                <GoArrowLeft className="text-2xl cursor-pointer" />
              </Link>
              <span className="font-medium flex flex-col leading-4">
                {user?.username}
                <span className="text-sm text-gray font-normal">
                  {post?.length} Posts
                </span>
              </span>
            </span>

            {isMyProfile && (
              <button
                className="py-1 px-3 border border-white-gray rounded-xl md:hidden"
                onClick={() =>
                  document.getElementById("my_modal_5" + user?._id).showModal()
                }
              >
                Edit profile
              </button>
            )}
          </div>

          {/* Profile section */}
          <div className="w-full py-3 px-4 mb-2 border border-white-gray rounded-[25px]">
            <div className="flex justify-between items-center">
              <div className="w-20 h-20 rounded-full border border-white-gray">
                <img
                  src={user?.profileImg || "/profile.png"}
                  alt={"Profile image"}
                  className="w-20 h-20 object-cover rounded-full"
                />
              </div>

              <div className="flex items-center gap-3 md:gap-6">
                <div className="flex flex-col items-center">
                  <span className="font-medium">{post?.length}</span>
                  <span className="text-base font-normal">Postingan</span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="font-medium">{user?.followers?.length}</span>
                  <span
                    onClick={() => setFollowType("followers")}
                    className="text-base font-normal cursor-pointer"
                  >
                    Pengikut
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="font-medium">{user?.following?.length}</span>
                  <span
                    onClick={() =>
                      document.getElementById("my_modal_3").showModal()
                    }
                    className="text-base font-normal cursor-pointer"
                  >
                    Mengikuti
                  </span>
                  <FollowingBox user={user} />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex flex-col my-2 leading-5">
                <span>{user?.bio}</span>
                {user?.link && (
                  <a
                    href={`https://${user?.link}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-600 hover:underline flex items-center gap-1"
                  >
                    <FaLink className="inline text-white-gray text-sm mt-1" />
                    {user?.link}
                  </a>
                )}
              </div>
              {isMyProfile && (
                <button
                  className="text-[12px] py-1 px-3 border border-white-gray rounded-xl hidden md:block"
                  onClick={() =>
                    document
                      .getElementById("my_modal_5" + user?._id)
                      .showModal()
                  }
                >
                  Edit profile
                </button>
              )}
              <EditProfile data={authUser} />
            </div>
          </div>

          {/* Follow button */}
          {!isMyProfile && (
            <button
              id="profileContainer"
              className={`w-full py-1.5 px-3 mb-2  ${
                amIFollowing ? "bg-input text-dark" : "bg-dark text-white"
              } rounded-xl`}
              onClick={(e) => {
                e.preventDefault();
                follow(user?._id);
              }}
            >
              {isPending && "Loading..."}
              {!isPending && amIFollowing && "Unfollow"}
              {!isPending && !amIFollowing && "Follow"}
            </button>
          )}
        </>
      )}

      {/* feedType buttons */}
      <div className={`w-full max-w-[494.3px] sticky top-0 bg-white shadow-[0_1px_0_rgba(0,0,0,0.1)] mb-2 z-10`}>
        <button
          className={`w-1/2 py-1 px-3 my-2 rounded-xl ${
            feedType === "posts"
              ? "bg-dark text-white border border-white-gray shadow"
              : ""
          }`}
          onClick={() => setFeedType("posts")}
        >
          Postingan
        </button>
        <button
          className={`w-1/2 py-1 px-3 my-2 rounded-xl ${
            feedType === "likes"
              ? "bg-dark text-white border border-white-gray shadow"
              : ""
          }`}
          onClick={() => setFeedType("likes")}
        >
          Suka
        </button>
      </div>

      {/* Post card */}
      <Posts feedType={feedType} username={username} userId={user?._id} />
    </>
  );
};

export default Profile;
