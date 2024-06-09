import React from "react";

const ProfileSkeleton = () => {
  return (
    <>
      <div className="w-full py-3 px-4 mb-2  rounded-[25px] animate-pulse">
        <div className="flex justify-between items-center">
          <div className="w-20 h-20 rounded-full bg-white-gray/50 text-transparent">
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex flex-col gap-1">
              <span className="font-medium bg-white-gray/50 text-transparent rounded w-20 h-4">user</span>
              <span className="text-base font-normal bg-white-gray/50 text-transparent rounded w-14 h-4">Postingan</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-medium bg-white-gray/50 text-transparent rounded w-20 h-4">user</span>
              <span className="text-base font-normal bg-white-gray/50 text-transparent rounded w-14 h-4">Postingan</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-medium bg-white-gray/50 text-transparent rounded w-20 h-4">user</span>
              <span className="text-base font-normal bg-white-gray/50 text-transparent rounded w-14 h-4">Postingan</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex flex-col my-2 gap-1 leading-5">
            <span className="bg-white-gray/50 text-transparent rounded w-20 h-4">bio</span>
            <span
              className="bg-white-gray/50 text-transparent rounded w-14 h-3"
            >
              link
            </span>
            <span
              className="bg-white-gray/50 text-transparent rounded w-40 h-4"
            >
              link
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSkeleton;
