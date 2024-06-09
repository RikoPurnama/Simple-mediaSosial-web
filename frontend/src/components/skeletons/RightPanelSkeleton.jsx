import React from "react";

const RightPanelSkeleton = () => {
  return (
    <div
      className="flex gap-2 items-center justify-between px-4 py-1 hover:bg-input animate-pulse"
    >
      <div
        style={{ backgroundImage: `url()` }}
        className="w-[50px] h-[50px] bg-white-gray/50 bg-cover bg-center rounded-full"
      ></div>
      <div className="flex flex-col">
        <h1 className="text-lg font-medium leading-5 bg-white-gray/50 text-transparent rounded">Riko purnama</h1>
        <p className="text-sm hover:underline bg-white-gray/50 text-transparent rounded mt-1 w-20">@e.ricko</p>
      </div>
      <button
        className="py-1 px-2 text-sm bg-white-gray/50 text-transparent rounded-lg"
      >
        Follow
      </button>
    </div>
  );
};

export default RightPanelSkeleton;
