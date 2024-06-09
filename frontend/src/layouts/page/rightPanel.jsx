import React from "react";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import RightPanelSkeleton from "../../components/skeletons/RightPanelSkeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useFollow from "../../hooks/useFollow";

const RightPanel = () => {
  const {data: authUser} = useQuery({queryKey: ["authUser"]})

  const queryClient = useQueryClient();

  const {data: suggested, isLoading} = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/suggested");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["suggestedUsers"]});
    },
  })

  const {follow, isPending} = useFollow()
  const checkFollowing = (userId) => authUser?.following?.includes(userId);

  const shortedUsers = suggested?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const latestUsers = shortedUsers?.slice(0, 6)


  return (
    <>
      <section className="w-full max-h-[882px] max-w-[35%] hidden lg:flex flex-col gap-5 py-1 md:py-5 pr-4">
        <div className="flex gap-2 items-center py-2 px-4 bg-input border border-white-gray rounded-xl">
          <label htmlFor="search">
            <CiSearch className="text-gray" />
          </label>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search"
            className="outline-none bg-input placeholder:text-gray"
          />
        </div>

        <div className="py-2 border border-white-gray rounded-[25px]">
          <h1 className="text-dark font-semibold text-2xl my-4 px-4">
            Trends for you
          </h1>
          <div className="my-3">
          </div>
        </div>
        <div className="py-2 border border-white-gray rounded-[25px]">
          <h1 className="text-dark font-semibold text-2xl my-4 px-4">
            Who to follow
          </h1>
          <div className="my-3">
            {isLoading && (
              <>
                <RightPanelSkeleton />
                <RightPanelSkeleton />
                <RightPanelSkeleton />
                <RightPanelSkeleton />
              </>
            )}
            {!isLoading &&
              latestUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex gap-1 items-center justify-between px-4 py-2 hover:bg-input"
                >
                  <div className="flex items-center gap-1">
                    <Link 
                      to={`/profile/${user.username}`}
                      style={{ backgroundImage: `url(${user.profileImg || "/profile.png"})` }}
                      className="w-[40px] h-[40px] bg-cover bg-center rounded-full"
                    ></Link>
                    <div className="flex flex-col">
                      <Link 
                        to={`/profile/${user.username}`} className=" leading-5">
                        {user.fullname.length >= 13 ? `${user.fullname.slice(0, 16)}...` : user.fullname}
                      </Link>
                      <Link to={`/profile/${user.username}`} className="text-sm text-gray hover:underline">
                        @{user.username}
                      </Link>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      follow(user._id);
                    }}
                    className="py-1 px-2 text-sm bg-dark text-white rounded-lg"
                  >
                    {checkFollowing(user._id) ? "Loading..." : "Follow"}
                  </button>
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default RightPanel;
