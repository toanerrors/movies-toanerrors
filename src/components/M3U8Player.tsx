/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useRef, useEffect } from "react";
import Hls from "hls.js";

interface M3U8PlayerProps {
  src: string;
  onTimeUpdate?: (time: number) => void;
  onEnded?: () => void;
  initialTime?: number;
}

const M3U8Player: React.FC<M3U8PlayerProps> = ({
  src,
  onTimeUpdate,
  onEnded,
  initialTime,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (initialTime && initialTime > 0) {
          video.currentTime = initialTime;
        }
        video.play();
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        // fallback or handle error
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        if (initialTime && initialTime > 0) {
          video.currentTime = initialTime;
        }
        video.play();
      });
    }
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, initialTime]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleTimeUpdate = () => {
      onTimeUpdate?.(video.currentTime);
    };
    const handleEnded = () => {
      onEnded?.();
    };
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [onTimeUpdate, onEnded]);

  return (
    <video
      ref={videoRef}
      controls
      className="w-full h-full bg-black"
      style={{ aspectRatio: "16/9" }}
    />
  );
};

export default M3U8Player;
