import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { GoArrowLeft } from "react-icons/go";
import { FaTrash } from "react-icons/fa";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { IoPaperPlaneOutline, IoBookmarkOutline } from "react-icons/io5";

import { formatPostDate } from "../../utils/date";
import LoadingSpinner from "../../components/skeletons/LoadingSpinner";
import PostSkeleton from "../../components/skeletons/PostSkeleton";
import useFollow from "../../hooks/useFollow";
import ZoomingPostMedia from "../../fragments/modal/zoomingPostMedia";

const linkify = (text) => {
  const urlPattern =
    /((?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9()]{2,}(?:\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]*)?)/gi;

  return text?.split(urlPattern).map((part, index) => {
    if (part.match(urlPattern)) {
      const href = part.match(/^https?:\/\//i) ? part : `http://${part}`;
      return (
        <a
          key={index}
          href={href}
          className="text-blue-500 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

const DetailPost = () => {
  const [comment, setComment] = useState("");
  const [showComment, setShowComment] = useState(true);
  const { id } = useParams();

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  const queryClient = useQueryClient();


  const {
    data: posts,
    isPending,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
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

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/${posts._id}`, {
          method: "DELETE",
        });
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
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/like/${posts?._id}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (updatedLikes) => {
      queryClient.setQueryData(["posts"], (oldData) => {
        if (oldData && oldData._id === posts._id) {
          return { ...oldData, likes: updatedLikes };
        }
        return oldData;
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: savePost, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/save/${posts._id}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (updateSaved) => {
      queryClient.setQueryData(["posts"], (oldData) => {
        if (oldData && oldData._id === posts._id) {
          return { ...oldData, saved: updateSaved };
        }
        return oldData;
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/comment/${posts._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: comment }),
        });
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
      toast.success("Comment posted successfully");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };

  const handleDeletePost = () => {
    deletePost();
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (isCommenting) return;
    commentPost();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          text: posts.text,
          url: `${window.location.protocol}/${postOwner.username}/${posts._id}`,
        });
      } catch (error) {
        toast.error;
      }
    } else {
      toast.error("Web Share API is not supported in your browser.");
    }
  };

  const handleSavedPost = () => {
    if (isSaving) return;
    savePost();
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  const postOwner = posts?.user;
  const isMyPost = authUser?._id === postOwner?._id;
  const amIFollowing = authUser?.following?.includes(postOwner?._id);
  const formattedDate = formatPostDate(posts?.createdAt);
  const isLiked = posts?.likes?.includes(authUser._id);
  const isSaved = posts?.saved?.includes(authUser._id);
  const { follow } = useFollow();

  console.log(posts)

  return (
    <>
      <section className="w-full max-w-[450px] lg:max-w-full md:max-w-[550px] lg:min-h-[95vh] py-5 mx-auto my-1 px-4 border border-white-gray rounded-[25px] scrollbar-thin">
        <div className="w-full bg-white/20 backdrop-blur-lg px-1 py-2 sticky -top-5 left-0">
          <Link
            to="/"
            className="flex gap-5 items-center text-xl font-semibold"
          >
            <GoArrowLeft className="text-2xl" />
            Post
          </Link>
        </div>

        {isLoading && (
          <div className="mt-5">
            <PostSkeleton />
          </div>
        )}

        {!isLoading && posts?.length === 0 && (
          <p className="text-center my-5">No posts in this tab. Switch tab</p>
        )}

        {/* post owner */}
        {!isLoading && (
          <div className="w-full p-5 my-2 border border-white-gray rounded-[25px]">
            <div className="flex gap-2 justify-between">
              <div className="flex gap-2 items-center">
                <Link to={`/profile/${postOwner?.username}`}>
                  <div
                    style={{
                      backgroundImage: `url(${
                        postOwner?.profileImg || "/profile.png"
                      })`,
                    }}
                    className="w-[50px] h-[50px] bg-cover bg-center rounded-full"
                  ></div>
                </Link>

                <div className="flex flex-col">
                  <span className="flex gap-2 items-center">
                    <Link
                      to={`/profile/${postOwner?.username}`}
                      className="font-bold leading-5"
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
                    onClick={() =>
                      document
                        .getElementById("my_modal_5" + posts?._id + "zoom")
                        .showModal()
                    }
                    className="cursor-pointer"
                  />
                ) : (
                  posts?.mediaType === "video" && (
                    <div
                      onClick={() => {
                        pauseVideo();
                      }}
                    >
                      <video
                        controls
                        loop
                        className="cursor-pointer max-w-[230px]"
                      >
                        <source src={posts?.mediaUrl} type="video/mp4" />
                      </video>
                    </div>
                  )
                )}
              </div>
              <ZoomingPostMedia
                post={posts}
                postOwner={postOwner}
                isDeleting={isDeleting}
                isMyPost={isMyPost}
                isPending={isPending}
                handleDeletePost={handleDeletePost}
                follow={follow}
                amIFollowing={amIFollowing}
                formattedDate={formattedDate}
              />
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
            <span className="text-dark block">{posts?.likes?.length} Suka</span>
            {posts?.mediaUrl && posts?.text && (
              <span className="my-2">
                <Link
                  to={`/profile/${postOwner?.username}`}
                  className="font-semibold text-dark hover:underline"
                >
                  {postOwner?.username}
                </Link>{" "}
                {linkify(posts?.text)}
              </span>
            )}

            <form
              onSubmit={handlePostComment}
              className="w-full my-2 flex justify-between"
            >
              <textarea
                type="text"
                name="comment"
                id="comment"
                placeholder="Tulis komentar"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full py-2 px-3 mr-1 border border-white-gray focus:outline-none rounded-xl resize-none placeholder:text-gray scrollbar-thin"
                cols={1}
                rows={1}
              />
              <button
                type="submit"
                className="py-1 px-3 text-sm border border-white-gray text-dark rounded-xl"
              >
                {isCommenting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Kirim"
                )}
              </button>
            </form>
          </div>
        )}

        {/* Comment */}
        {showComment &&
          posts?.comments?.map((comment) => (
            <div key={comment._id} className="flex gap-2 py-2">
              <div className="avatar">
                <Link
                  to={"/profile/" + comment.user.username}
                  className="w-[45px] h-[45px] rounded-full overflow-hidden"
                >
                  <img src={comment.user.profileImg || "/profile.png"} />
                </Link>
              </div>
              <div className="w-full flex flex-col border border-white-gray px-4 py-2 rounded-3xl">
                <div className="text-[15px] flex items-center gap-1">
                  <Link
                    to={"/profile/" + comment.user.username}
                    className="font-bold"
                  >
                    {comment.user.fullname}
                  </Link>
                  <Link
                    to={"/profile/" + comment.user.username}
                    className="text-gray text-[15px] hover:underline"
                  >
                    @{comment.user.username}
                  </Link>
                </div>
                <div className="text-base">{comment.text}</div>
              </div>
            </div>
          ))}
      </section>
    </>
  );
};

export default DetailPost;
