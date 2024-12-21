/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  src: string;
  onTimeUpdate?: (time: number) => void;
  onEnded?: () => void;
  initialTime?: number;
}

export default function VideoPlayer({
  src,
  onTimeUpdate,
  onEnded,
  initialTime,
}: VideoPlayerProps) {
  const playerRef = useRef<HTMLIFrameElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === "timeupdate") {
          onTimeUpdate?.(data.currentTime);
        }
        if (data.event === "ended") {
          onEnded?.();
        }
      } catch (err: unknown) {
        // Ignore invalid messages
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onTimeUpdate, onEnded]);

  useEffect(() => {
    if (initialTime && initialTime > 0) {
      const player = playerRef.current;
      if (player && player.contentWindow) {
        // Đợi iframe load xong
        setTimeout(() => {
          player.contentWindow?.postMessage(
            JSON.stringify({
              event: "seek",
              time: initialTime,
            }),
            "*"
          );
        }, 2000);
      }
    }
  }, [initialTime, src]);

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <iframe
        ref={playerRef}
        src={src}
        className="absolute inset-0 w-full h-full"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
      {isHovering && (
        <div
          className="absolute inset-0 bg-transparent"
          style={{ pointerEvents: "none" }}
        />
      )}
    </div>
  );
}
