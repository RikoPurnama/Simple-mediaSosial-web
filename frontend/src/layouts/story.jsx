import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Story = () => {
  const queryClient = useQueryClient();

  const { data: stories } = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/stories/all");
        const data = await res.json();
        if (!res) {
          throw new Error(data.error || "Someting went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const userStories = {};
  stories?.forEach((story) => {
    if (!userStories[story.user._id]) {
      userStories[story.user._id] = {
        user: story.user,
        stories: [],
      };
    }
    userStories[story.user._id].stories.push(story);
  });

  return (
    <>
      <div className="flex space-x-4 overflow-x-auto p-4">
        <Link to={`/c/story`} className="cursor-pointer">
          <div
            style={{ backgroundImage: "url(/profile.png)" }}
            className="w-12 h-12 rounded-full bg-white-gray flex justify-end items-end bg-cover"
          >
            <div className="w-4 h-4 flex justify-center items-center bg-sky-500 rounded-full">
              <FaPlus className="text-sm  text-white rounded-full" />
            </div>
          </div>
        </Link>

        {Object.keys(userStories).map((userId) => (
          <div key={userId} className="flex flex-col items-center">
            <div className="w-[50px] h-[50px] flex justify-center items-center rounded-full bg-gradient-to-tr from-white-gray to-dark object-cover">

            <img
              src={
                userStories[userId].user.profileImg || "/default-profile.png"
              }
              alt={`${userStories[userId].user.username}'s story`}
              className="w-12 h-12 rounded-full object-cover"
            />
            </div>
            <p className="mt-1 text-sm">{userStories[userId].user.username}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Story;
