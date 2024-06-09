import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { IoImageOutline, IoCloseSharp, IoCameraOutline } from "react-icons/io5";
import { MdOutlineSlowMotionVideo } from "react-icons/md";

const StoryPage = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [mediaType, setMediaType] = useState("image");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const videoRef = useRef(null);
  const vidRef = useRef(null);

  const queryClient = useQueryClient();

  const {
    data: createStory,
    isPending,
    isEror,
    error,
  } = useMutation({
    mutationFn: async ({ userId, mediaType, mediaBase64 }) => {
      try {
        const res = await fetch("/api/stories/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, mediaType, mediaBase64 }),
        });
        const data = await res.json();
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      setText("");
      setFile(null);
      toast.success("Story added successfully");
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });

  const openCamera = async () => {
    setIsCameraOpen(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error("Error accessing camera: ", error);
      }
    }
  };

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const dataURL = canvasRef.current.toDataURL("image/png");
        setImageSrc(dataURL);
      }
    }
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setMediaType(selectedFile.type.startsWith("video") ? "video" : "image");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64String = reader.result;
      mutation.mutate({ userId, mediaType, mediaBase64: base64String });
    };
    createStory({ text, file });
  };
  return (
    <section className="w-full max-w-[450px] lg:max-w-full md:max-w-[550px] min-h-[95vh] text-dark py-5 mx-auto my-5 px-4 border border-white-gray rounded-[25px] scrollbar-thin">
      <div className="w-full flex justify-between items-center mb-2">
        <span className="flex gap-2 items-center ">
          <Link to={"/"}>
            <IoCloseSharp className="text-2xl cursor-pointer" />
          </Link>
        </span>
        <span className="text-center font-semibold">Tambah ke cerita</span>
        <span></span>
      </div>

      <div className="w-full py-5 px-4 flex items-center gap-4 relative">
        {isCameraOpen ? (
          <div className="flex flex-col items-center gap-2 absolute top-0">
            <video ref={videoRef} className="w-80 h-60 bg-black" />
            <button
              onClick={takePicture}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Capture
            </button>
            <button
              onClick={closeCamera}
              className="px-4 py-2 bg-red-500 text-dark rounded"
            >
              Close Camera
            </button>
            <canvas
              ref={canvasRef}
              className="hidden"
              width="640"
              height="480"
            />
          </div>
        ) : (
          <div
            onClick={openCamera}
            className="w-20 h-16 flex justify-center items-center bg-input rounded-md cursor-pointer"
          >
            <span className="text-sm flex flex-col justify-center items-center">
              <IoCameraOutline className="text-3xl" />
              Kamera
            </span>
          </div>
        )}

        {imageSrc && (
          <div className="mt-4 absolute bottom-0 right-0">
            <h2 className="text-xl mb-2">Captured Image</h2>
            <img src={imageSrc} alt="Captured" className="w-80 h-auto" />
          </div>
        )}

        <div
          onClick={() => imgRef.current.click()}
          className="w-20 h-16 flex justify-center items-center bg-input rounded-md cursor-pointer"
        >
          <span className="text-sm flex flex-col justify-center items-center">
            <IoImageOutline className="text-3xl" />
            Foto
          </span>
        </div>

        <div
          onClick={() => vidRef.current.click()}
          className="w-20 h-16 flex justify-center items-center bg-input rounded-md cursor-pointer"
        >
          <span className="text-sm flex flex-col justify-center items-center">
            <MdOutlineSlowMotionVideo className="text-3xl" />
            Video
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          hidden
          ref={imgRef}
          onChange={handleFileChange}
        />
        <input
          type="file"
          accept="video/*"
          hidden
          ref={vidRef}
          onChange={handleFileChange}
        />
        <button type="submit">Upload Story</button>
      </form>
    </section>
  );
};

export default StoryPage;
