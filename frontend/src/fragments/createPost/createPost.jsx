import React, { useRef, useState } from "react";

import { IoImageOutline, IoCloseSharp } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const imgRef = useRef(null);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const {
    mutate: createPost,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ text, mediaUrl, mediaType }) => {
      try {
        const res = await fetch("/api/posts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, mediaUrl, mediaType }),
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
      setText("");
      setMediaUrl(null);
      setMediaType('');
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ text, mediaUrl, mediaType });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setMediaUrl(reader.result);
        setMediaType(file.type.startsWith("video") ? "video" : "image");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setText((prevText) => prevText + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="w-full py-3 md:py-4 md:pb-1 px-4 hidden lg:flex gap-2 border border-white-gray rounded-3xl mb-5">
      <div>
        <div
          style={{
            backgroundImage: `url(${authUser.profileImg || "/profile.png"})`,
          }}
          className="w-[40px] h-[40px] bg-cover bg-center rounded-full"
        ></div>
      </div>

      <form action="" onSubmit={handleSubmit} className="w-full flex flex-col">
        <div className="w-full border-b border-b-white-gray">
          <textarea
            type="text"
            name="post"
            id="post"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What is happening?!"
            className="outline-none w-full resize-none bg-white"
          />
          {mediaUrl && (
            <div className="relative w-full md:w-72 mx-auto">
              <IoCloseSharp
                className="absolute bottom-full right-0 text-dark bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
                onClick={() => {
                  setMediaUrl(null);
                  mediaRef.current.value = null;
                }}
              />
              {mediaType === "image" ? (
                <img
                  src={mediaUrl}
                  className="w-full mx-auto h-72 object-contain rounded"
                />
              ) : (
                <video
                  src={mediaUrl}
                  controls
                  className="w-full mx-auto h-72 object-contain rounded"
                />
              )}
            </div>
          )}
        </div>
        <div className="flex justify-between py-1">
          <div className="flex gap-1 py-2 text-gray">
            <div className="w-7 h-7 flex justify-center items-center rounded-full group hover:bg-sky-500/20">
              <IoImageOutline
                onClick={() => imgRef.current.click()}
                className="group-hover:text-sky-500 rounded cursor-pointer"
              />
            </div>
            <div className="w-7 h-7 flex justify-center items-center rounded-full group hover:bg-yellow-500/20">
              <BsEmojiSmile
                className="hover:text-yellow-500 rounded-full cursor-pointer"
                onClick={() => setShowEmojiPicker((val) => !val)}
              />
              {showEmojiPicker && (
                <div className="absolute top-8 z-10">
                  <EmojiPicker
                    onEmojiClick={(emojiObject) =>
                      handleEmojiClick(emojiObject)
                    }
                  />
                </div>
              )}
            </div>
          </div>
          <input
            type="file"
            accept="image/*, video/*"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />
          <button
            type="submit"
            className={`h-9 px-5 text-white bg-dark rounded-lg ${isPending ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
        {isError && <div className="text-red">{error.message}</div>}
      </form>
    </div>
  );
};

export const CreateMobilePost = () => {
  const [text, setText] = useState("");
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediatype] = useState("");

  const mediaRef = useRef(null);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const {
    mutate: createPost,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ text, mediaUrl, mediaType }) => {
      try {
        const res = await fetch("/api/posts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, mediaUrl, mediaType }),
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
      setText("");
      setMediatype("");
      setMediaUrl(null);
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ text, mediaUrl, mediaType });
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setMediaUrl(reader.result);
        setMediatype(file.type.startsWith("video") ? "video" : "image");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <span
        onClick={() => document.getElementById("my_modal_5").showModal()}
        className="cursor-pointer"
      >
        <FaPlus className="text-3xl text-dark text-center" />
      </span>
      <dialog
        id={`my_modal_5`}
        className="modal modal-bottom sm:modal-middle text-dark"
      >
        <div className="modal-box rounded-t-[25px] md:rounded-3xl border border-white-gray bg-white text-dark">
          <h3 className="font-bold text-lg mb-4">Create post</h3>
          <div className="w-full py-3 md:py-5 px-4 flex gap-2 border border-white-gray rounded-3xl mb-5">
            <div>
              <div
                style={{
                  backgroundImage: `url(${
                    authUser.profileImg || "/profile.png"
                  })`,
                }}
                className="w-[40px] h-[40px] bg-cover bg-center rounded-full"
              ></div>
            </div>

            <form
              action=""
              onSubmit={handleSubmit}
              className="w-full flex flex-col"
            >
              <div className="w-full border-b border-b-white-gray">
                <textarea
                  type="text"
                  name="post"
                  id="post"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="What is happening?!"
                  className="outline-none w-full resize-none bg-white"
                />
                {mediaUrl && (
                  <div className="relative w-full md:w-72 mx-auto">
                    <IoCloseSharp
                      className="absolute bottom-full right-0 text-dark bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
                      onClick={() => {
                        setMediaUrl(null);
                        mediaRef.current.value = null;
                      }}
                    />
                    {mediaType === "image" ? (
                      <img
                        src={mediaUrl}
                        className="w-full mx-auto h-72 object-contain rounded"
                      />
                    ) : (
                      <video
                        src={mediaUrl}
                        controls
                        className="w-full mx-auto h-72 object-contain rounded"
                      />
                    )}
                  </div>
                )}
              </div>
              <div className="flex justify-between py-1">
                <div className="flex gap-1 py-2 text-gray">
                  <div className="w-7 h-7 flex justify-center items-center rounded-full group hover:bg-sky-500/20">
                    <IoImageOutline
                      onClick={() => mediaRef.current.click()}
                      className="group-hover:text-sky-500 rounded cursor-pointer"
                    />
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*, video/*"
                  hidden
                  ref={mediaRef}
                  onChange={handleMediaChange}
                />
                <button
                  type="submit"
                  className={`h-9 px-5 text-white bg-dark rounded-lg ${isPending ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {isPending ? "Posting..." : "Posting"}
                </button>
              </div>
              {isError && <div className="text-red">{error.message}</div>}
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className="outline-none text-dark">close</button>
        </form>
      </dialog>
    </>
  );
};

export default CreatePost;
