import React from 'react'

import { GoArrowLeft } from "react-icons/go";
import { FaTrash } from "react-icons/fa";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { AiOutlineMessage } from "react-icons/ai";
import { IoPaperPlaneOutline, IoBookmarkOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';

const DetailPostCard = ({post}) => {
    console.log(post)
  return (
    <section className="w-full max-w-[450px] lg:max-w-full md:max-w-[550px] min-h-[95vh] py-5 mx-auto my-5 px-4 border border-white-gray rounded-[25px]">
      <div className="w-full bg-white/20 backdrop-blur-lg px-1 sticky top-0 ">
        <Link to="/" className="flex gap-5 items-center text-xl font-semibold">
          <GoArrowLeft />
          Post
        </Link>
      </div>

      <div className="w-full p-5 my-5 border border-white-gray rounded-[25px]">
        <div className="flex gap-2 justify-between">
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

        <div>
          {!posts?.mediaUrl && (
            <span className="my-4 block">{linkify(posts?.text)}</span>
          )}

          <div className="w-full mt-2 flex justify-center bg-dark cursor-pointer">
            {posts?.mediaType === "image" ? (
              <img
                src={posts?.mediaUrl}
                alt={posts?.text}
                className="cursor-pointer"
              />
            ) : (
              posts?.mediaType === "video" && (
                <div
                  onClick={() => {
                    setIsModalOpen(true);
                    pauseVideo();
                  }}
                >
                  <video
                    ref={vidRef}
                    controls
                    loop
                    muted
                    autoPlay
                    className="cursor-pointer max-w-[230px]"
                  >
                    <source src={posts?.mediaUrl} type="video/mp4" />
                  </video>
                </div>
              )
            )}
          </div>
        </div>

        <div className="text-dark flex justify-between items-center mt-2">
          <div className="flex gap-2 items-center">
            <div
              onClick={handleLikePost}
              className="w-8 h-8 rounded-full hover:bg-red/20 flex justify-center items-center group"
            >
              {isLiking && <LoadingSpinner size="sm" />}
              {!isLiked && !isLiking && (
                <IoMdHeartEmpty className="text-2xl cursor-pointer group-hover:text-red" />
              )}
              {isLiked && !isLiking && (
                <IoMdHeart className="text-2xl cursor-pointer text-red" />
              )}
            </div>

            <div className="w-8 h-8 rounded-full hover:bg-sky-500/20 flex justify-center items-center group">
              <AiOutlineMessage
                className="text-xl cursor-pointer group-hover:text-sky-500"
                onClick={() =>
                  document.getElementById("my_modal_5" + posts?._id).showModal()
                }
              />
              <CommentBox
                post={posts}
                handlePostComment={handlePostComment}
                isCommenting={isCommenting}
                comment={comment}
                setComment={setComment}
              />
            </div>

            <div className="w-8 h-8 rounded-full hover:bg-green-500/20 flex justify-center items-center group">
              <IoPaperPlaneOutline
                className="text-xl cursor-pointer group-hover:text-green-500"
                onClick={handleShare}
              />
            </div>
          </div>
          <div
            onClick={handleSavedPost}
            className="w-8 h-8 rounded-full hover:bg-amber-400/20 flex justify-center items-center group"
          >
            {isSaving && <LoadingSpinner size="sm" />}
            {!isSaved && !isSaving && (
              <IoBookmarkOutline className="text-xl cursor-pointer group-hover:text-amber-400" />
            )}
            {isSaved && !isSaving && (
              <IoBookmarkOutline className="text-xl cursor-pointer text-amber-400" />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default DetailPostCard