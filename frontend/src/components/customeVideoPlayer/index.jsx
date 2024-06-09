import React, { useRef, useState } from 'react';

const CustomVideoPlayer = ({src}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (event) => {
    const volume = event.target.value;
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
    setVolume(volume);
  };

  const handleSeek = (event) => {
    if (videoRef.current) {
      videoRef.current.currentTime = event.target.value;
    }
  };

  return (
    <div className="w-full max-w-[230px] relative">
      <video ref={videoRef} src={src} className="w-full max-w-[230px]" onTimeUpdate={() => setIsPlaying(!videoRef.current.paused)}>
        <source src="your-video-file.mp4" type="video/mp4" />
      </video>
      <div className="absolute bottom-0 bg-dark/10 flex items-center justify-between p-4 bg-gray-800 text-white">
        <button onClick={handlePlayPause} className="px-4 py-2 bg-blue-500 rounded cursor-pointer">
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <input
          type="range"
          className="mx-4 w-1/2"
          defaultValue="0"
          max={videoRef.current ? videoRef.current.duration : 0}
          onChange={handleSeek}
        />
        <input
          type="range"
          className="w-1/2"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default CustomVideoPlayer;
