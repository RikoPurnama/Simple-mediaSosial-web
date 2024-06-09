import React, { useRef } from "react";
import { Link } from "react-router-dom";

import { FaTrash } from "react-icons/fa";
import LoadingSpinner from "../../components/skeletons/LoadingSpinner";

const ZoomingPostMedia = ({
  post,
  postOwner,
  amIFollowing,
  isPending,
  formattedDate,
  isMyPost,
  isDeleting,
  handleDeletePost,
  follow,
}) => {
  const videoRef = useRef(null);
  return (
    <dialog
      id={`my_modal_5${post?._id}zoom`}
      className="modal modal-middle sm:modal-middle text-dark"
    >
      <div className="modal-box lg:max-w-[38rem] px-0 pt-4 pb-0 rounded-[10px] md:rounded-3xl border border-white-gray bg-white text-dark overflow-y-hidden">
        <div className="flex gap-2 justify-between px-4 mb-2">
          <div className="flex gap-2 items-center">
            <Link to={`/profile/${postOwner?.username}`}>
              <div
                style={{
                  backgroundImage: `url(${
                    postOwner?.profileImg || "profile.png"
                  })`,
                }}
                className="w-[50px] h-[50px] bg-cover bg-center rounded-full"
              ></div>
            </Link>

            <div className="flex flex-col">
              <span className="flex gap-2 items-center">
                <Link
                  to={`/profile/${postOwner?.username}`}
                  className="font-medium leading-5"
                >
                  {postOwner?.fullname}
                </Link>

                {!isMyPost && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      follow(postOwner?._id);
                    }}
                    className={`text-sm mt-0.5 ${
                      !amIFollowing ? "text-sky-400" : "text-gray/40"
                    }`}
                  >
                    {isPending && "Loading..."}
                    {!isPending && amIFollowing && "Mengikuti"}
                    {!isPending && !amIFollowing && "Ikuti"}
                  </button>
                )}
              </span>
              <span className="flex gap-2 text-gray">
                <Link
                  to={`/profile/${postOwner?.username}`}
                  className="text-sm text-gray hover:underline"
                >
                  @{postOwner?.username}
                </Link>
                <span>·</span>
                <span className="text-sm ">{formattedDate}</span>
              </span>
            </div>
          </div>
          {isMyPost && (
            <span>
              {!isDeleting && (
                <FaTrash
                  className="text-dark hover:text-red cursor-pointer"
                  onClick={handleDeletePost}
                />
              )}
              {isDeleting && <LoadingSpinner size="sm" />}
            </span>
          )}
        </div>

        <div className="mt-2 flex justify-center bg-dark">
          {post.mediaType === "image" ? (
            <img
              onClick={() =>
                document
                  .getElementById("my_modal_5" + post._id + "zoom")
                  .showModal()
              }
              src={post.mediaUrl}
              alt={post.text}
              className="cursor-pointer"
            />
          ) : (
            post.mediaType === "video" && (
              <video
                ref={videoRef}
                src={post.mediaUrl}
                controls
                className="cursor-pointer max-w-[300px]"
              />
            )
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button
          onClick={() => {
            if (videoRef.current && !videoRef.current.paused) {
              videoRef.current.pause();
            }

            document.getElementById("my_modal_5" + post._id + "zoom").close();
          }}
          className="outline-none text-dark"
        >
          close
        </button>
      </form>
    </dialog>
  );
};

export default ZoomingPostMedia;
