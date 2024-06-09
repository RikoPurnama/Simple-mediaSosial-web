import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { AiOutlineMessage } from "react-icons/ai";
import { IoPaperPlaneOutline, IoBookmarkOutline } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";

import CommentBox from "../modal/commentBox";
import { formatPostDate } from "../../utils/date";
import LoadingSpinner from "../../components/skeletons/LoadingSpinner";
import useFollow from "../../hooks/useFollow";

const linkify = (text) => {
  const urlPattern =
    /((?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9()]{2,}(?:\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]*)?)/gi;

  return text.split(urlPattern).map((part, index) => {
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

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();
  const postOwner = post.user;
  const isLiked = post.likes.includes(authUser._id);
  const isSaved = post.saved.includes(authUser._id);

  const isMyPost = authUser._id === post.user._id;

  const formattedDate = formatPostDate(post.createdAt);

  const { follow, isPending } = useFollow();
  const amIFollowing = authUser?.following?.includes(postOwner?._id);

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/${post._id}`, {
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
        const res = await fetch(`/api/posts/like/${post._id}`, {
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
        return oldData.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: updatedLikes };
          }
          return p;
        });
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: savePost, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/save/${post._id}`, {
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
        return oldData.map((p) => {
          if (p._id === post._id) {
            return { ...p, saved: updateSaved };
          }
          return p;
        });
      });
    },
  });

  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/comment/${post._id}`, {
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
          text: post.text,
          url: `${window.location.protocol}/${postOwner.username}/${post._id}`,
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

  const vidRef = useRef(null);

  // Fungsi untuk memulai video
  const playVideo = () => {
    if (vidRef.current) {
      vidRef.current.currentTime = 0;
      vidRef.current.play();
    }
  };

  // Fungsi untuk menghentikan video
  const pauseVideo = () => {
    if (vidRef.current) {
      vidRef.current.pause();
    }
  };

  useEffect(() => {
      const videoElement = vidRef.current;

      // Callback untuk Intersection Observer
      const handleIntersection = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playVideo();
          } else {
            pauseVideo();
          }
        });
      };

      // Buat observer
      const observer = new IntersectionObserver(handleIntersection, {
        threshold: 0.5,
      });

      if (videoElement) {
        observer.observe(videoElement);
      }

      // Bersihkan observer saat komponen unmount
      return () => {
        if (videoElement) {
          observer.unobserve(videoElement);
        }
      };
    
  }, []);


  return (
    <div
      key={post._id}
      className="w-full p-4 border border-white-gray rounded-[25px]"
    >
      <div className="flex gap-2 justify-between">
        <div className="flex gap-2 items-center">
          <Link to={`/profile/${postOwner.username}`}>
            <div
              style={{
                backgroundImage: `url(${
                  postOwner.profileImg || "profile.png"
                })`,
              }}
              className="w-[45px] h-[45px] bg-cover bg-center rounded-full"
            ></div>
          </Link>

          <div className="flex flex-col">
            <span className="flex gap-2 items-center">
              <Link
                to={`/profile/${postOwner.username}`}
                className="font-medium leading-5"
              >
                {postOwner.fullname}
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
                to={`/profile/${postOwner.username}`}
                className="text-sm text-gray hover:underline"
              >
                @{postOwner.username}
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

      <Link to={`/${postOwner.username}/status/${post._id}${post.mediaType === 'image' ? '/photo/1' : ''}`}>
      {!post.mediaUrl && (
        <span className="my-4 block">{linkify(post.text)}</span>
      )}

      <div
        className="w-full mt-2 flex justify-center bg-dark cursor-pointer"
      >
        {post.mediaType === "image" ? (
          <img
            src={post.mediaUrl}
            alt={post.text}
            className="cursor-pointer"
          />
        ) : (
          post.mediaType === "video" && (
            <div onClick={() => {
                  setIsModalOpen(true);
                  pauseVideo();
                }}>
              <video
                ref={vidRef}
                controls
                loop
                muted
                autoPlay
                className="cursor-pointer max-w-[230px]"
              >
                <source src={post.mediaUrl} type="video/mp4" />
              </video>
            </div>
          )
        )}
      </div>
      </Link>

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
                document.getElementById("my_modal_5" + post._id).showModal()
              }
            />
            <CommentBox
              post={post}
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

      <span className="text-dark block">{post.likes.length} Suka</span>
      {post.mediaUrl && post.text && (
        <span className="my-2">
          <Link className="font-semibold text-dark hover:underline">
            {postOwner.username}
          </Link>{" "}
          {linkify(post.text)}
        </span>
      )}
      <span
        className="block text-gray font-normal cursor-pointer mb-2"
        onClick={() =>
          document.getElementById("my_modal_5" + post._id).showModal()
        }
      >
        Lihat semua {post.comments.length} komentar
      </span>
    </div>
  );
};

export default Post;
