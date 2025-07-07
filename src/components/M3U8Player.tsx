/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useRef, useEffect, useState } from "react";
import Hls from "hls.js";
import {
  PlayCircle,
  PauseCircle,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  XCircle,
  ChevronLeftCircle,
  ChevronRightCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface M3U8PlayerProps {
  src: string;
  onTimeUpdate?: (time: number, duration?: number) => void;
  onEnded?: () => void;
  initialTime?: number;
  // Navigation & Info
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  onClose?: () => void;
  episodeName?: string;
  serverName?: string;
  currentIndex?: number;
  totalEpisodes?: number;
}

const M3U8Player: React.FC<M3U8PlayerProps> = ({
  src,
  onTimeUpdate,
  onEnded,
  initialTime,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  onClose,
  episodeName,
  serverName,
  currentIndex,
  totalEpisodes,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Video state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Control timeout
  const [controlTimeout, setControlTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let ignore = false;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    let loadedMetadataHandler: (() => void) | null = null;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (ignore) return;
        setIsLoading(false);
        if (initialTime && initialTime > 0) {
          video.currentTime = initialTime;
        }
      });
      loadedMetadataHandler = () => {
        if (ignore) return;
        video.play();
      };
      video.addEventListener("loadedmetadata", loadedMetadataHandler);
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (ignore) return;
        setIsLoading(false);
        console.error("HLS error:", data);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      loadedMetadataHandler = () => {
        if (ignore) return;
        setIsLoading(false);
        if (initialTime && initialTime > 0) {
          video.currentTime = initialTime;
        }
        video.play();
      };
      video.addEventListener("loadedmetadata", loadedMetadataHandler);
    }

    // Add video event listeners
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onTimeUpdate?.(video.currentTime, video.duration);
    };
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("volumechange", handleVolumeChange);

    return () => {
      ignore = true;
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (loadedMetadataHandler) {
        video.removeEventListener("loadedmetadata", loadedMetadataHandler);
      }
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("volumechange", handleVolumeChange);
    };
  }, [src, initialTime, onTimeUpdate, onEnded]);

  // Detect touch device
  const isTouchDevice = () => {
    if (typeof window === "undefined") return false;
    return (
      "ontouchstart" in window ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)
    );
  };

  // Always show controls on mobile
  useEffect(() => {
    if (isTouchDevice()) {
      setShowControls(true);
    }
  }, []);

  // Hide controls after 3 seconds (desktop only)
  useEffect(() => {
    if (isTouchDevice()) return;
    let timeout: NodeJS.Timeout | null = null;
    if (isPlaying) {
      setShowControls(true);
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    } else {
      setShowControls(true);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isPlaying]);

  // Helper functions
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video || !duration) return;

    const seekTime = (value[0] / 100) * duration;
    video.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value[0] / 100;
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;
    // iOS Safari only supports fullscreen on video element
    const isIOS =
      typeof window !== "undefined" &&
      /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS && (video as any).webkitEnterFullscreen) {
      (video as any).webkitEnterFullscreen();
      return;
    }
    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Detect iOS
  const isIOS =
    typeof window !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);
  // Track fullscreen state for iOS
  const [isIOSFullscreen, setIsIOSFullscreen] = useState(false);

  // Listen for iOS fullscreen (webkitfullscreenchange)
  useEffect(() => {
    if (!isIOS) return;
    const video = videoRef.current;
    if (!video) return;
    function handleWebkitFullscreenChange() {
      // iOS Safari: video.webkitDisplayingFullscreen
      setIsIOSFullscreen((video as any).webkitDisplayingFullscreen === true);
    }
    video.addEventListener(
      "webkitbeginfullscreen",
      handleWebkitFullscreenChange
    );
    video.addEventListener("webkitendfullscreen", handleWebkitFullscreenChange);
    return () => {
      video.removeEventListener(
        "webkitbeginfullscreen",
        handleWebkitFullscreenChange
      );
      video.removeEventListener(
        "webkitendfullscreen",
        handleWebkitFullscreenChange
      );
    };
  }, [isIOS]);

  const handleContainerClick = () => {
    if (controlTimeout) clearTimeout(controlTimeout);
    setShowControls(true);
    const timeout = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
    setControlTimeout(timeout);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleTimeUpdate = () => {
      onTimeUpdate?.(video.currentTime, video.duration);
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
    <TooltipProvider>
      <div
        ref={containerRef}
        className="relative w-full h-full bg-black group cursor-pointer"
        onClick={handleContainerClick}
        onMouseMove={() => {
          if (!isTouchDevice()) setShowControls(true);
        }}
        onMouseLeave={() => {
          if (!isTouchDevice() && isPlaying) setShowControls(false);
        }}
      >
        <video
          ref={videoRef}
          className="w-full h-full bg-black rounded-xl shadow-lg"
          style={{ aspectRatio: "16/9" }}
          playsInline
          onClick={(e) => {
            e.stopPropagation();
            togglePlayPause();
          }}
          controls={isIOS && isIOSFullscreen}
        />
        {/* Redesigned Controls Overlay */}
        {!isIOSFullscreen && (
          <div className="absolute inset-0 z-20 pointer-events-none select-none">
            {/* Top bar: Close, Info */}
            <div
              className={`absolute z-30 top-0 left-0 right-0 flex items-center justify-between px-2 sm:px-4 h-10 sm:h-12 bg-gradient-to-b from-black/90 to-transparent transition-opacity duration-300 ${
                showControls ? "opacity-100" : "opacity-0"
              }`}
              style={{ pointerEvents: "auto" }}
            >
              {/* Info - mobile chỉ hiển thị 1 dòng, desktop giữ nguyên */}
              <div className="flex flex-col sm:flex-col gap-0.5 max-w-[65vw] sm:max-w-xs">
                <span className="text-white font-semibold text-xs sm:text-sm truncate">
                  {episodeName}
                  {serverName && (
                    <span className="ml-1 text-[10px] bg-white/20 text-white rounded px-1 py-0.5 align-middle hidden sm:inline">
                      {serverName}
                    </span>
                  )}
                  {currentIndex !== undefined &&
                    totalEpisodes !== undefined && (
                      <span className="ml-1 text-[10px] bg-white/20 text-white rounded px-1 py-0.5 align-middle hidden sm:inline">
                        {currentIndex + 1}/{totalEpisodes}
                      </span>
                    )}
                </span>
                {/* Mobile: chỉ hiện server/tập dưới dạng tooltip khi bấm vào tên tập */}
              </div>
              {/* Desktop: icon */}
              {/* Close button - icon XCircle trắng, không nền, không màu, không hiệu ứng hover/focus */}
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Đóng"
                  className="h-8 w-8 flex items-center justify-center rounded-full bg-transparent border-none p-0 m-0 focus:outline-none focus:ring-0 shadow-none hover:bg-transparent active:bg-transparent transition-none"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                ></button>
              )}
            </div>
            {/* Side navigation - Prev/Next */}
            <div
              className={`absolute inset-y-0 left-0 right-0 flex items-center justify-between transition-opacity duration-300 ${
                showControls ? "opacity-100" : "opacity-0"
              }`}
              style={{ pointerEvents: "auto" }}
            >
              {/* Previous button */}
              <div className="w-10 sm:w-14 flex items-center justify-start pl-0.5 sm:pl-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 sm:h-10 sm:w-10 bg-white/10 hover:bg-white/30 text-white border border-white/20 shadow backdrop-blur-lg"
                      onClick={onPrev}
                      aria-label="Tập trước"
                      disabled={!hasPrev || !onPrev}
                    >
                      <ChevronLeftCircle className="h-5 w-5 sm:h-7 sm:w-7" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {hasPrev ? "Tập trước" : "Không có tập trước"}
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex-1" />
              {/* Next button */}
              <div className="w-10 sm:w-14 flex items-center justify-end pr-0.5 sm:pr-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 sm:h-10 sm:w-10 bg-white/10 hover:bg-white/30 text-white border border-white/20 shadow backdrop-blur-lg"
                      onClick={onNext}
                      aria-label="Tập tiếp theo"
                      disabled={!hasNext || !onNext}
                    >
                      <ChevronRightCircle className="h-5 w-5 sm:h-7 sm:w-7" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {hasNext ? "Tập tiếp theo" : "Không có tập tiếp theo"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            {/* Bottom controls - Glassmorphic Redesign */}
            <div
              className={`absolute bottom-0 left-0 right-0 px-0.5 sm:px-2 pb-1 sm:pb-2 flex flex-col gap-0.5 sm:gap-1.5 transition-opacity duration-300 ${
                showControls ? "opacity-100" : "opacity-0"
              }`}
              style={{ pointerEvents: "auto" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Progress Bar */}
              <div className="flex items-center gap-0.5 sm:gap-2">
                <span className="text-white text-[10px] min-w-[24px] sm:text-xs sm:min-w-[36px] text-right">
                  {formatTime(currentTime)}
                </span>
                <div className="flex-1 relative">
                  <Progress
                    value={duration ? (currentTime / duration) * 100 : 0}
                    max={100}
                    className="h-1 sm:h-1.5 bg-white/30 rounded-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={duration ? (currentTime / duration) * 100 : 0}
                    onChange={(e) => handleSeek([parseFloat(e.target.value)])}
                    className="absolute left-0 top-0 w-full h-3 opacity-0 cursor-pointer z-10"
                    style={{ pointerEvents: "auto" }}
                  />
                </div>
                <span className="text-white text-[10px] min-w-[24px] sm:text-xs sm:min-w-[36px] text-left">
                  {formatTime(duration)}
                </span>
              </div>
              {/* Main Controls Row - mobile: chỉ giữ play/pause và fullscreen, căn giữa, spacing đều */}
              <div className="w-full flex items-center justify-center mt-1 sm:mt-1.5">
                <div
                  className="flex items-center justify-center gap-2 sm:gap-2.5 bg-white/10 backdrop-blur-lg rounded-2xl shadow border border-white/20 px-2 py-1 sm:px-3 sm:py-1.5 pointer-events-auto mx-auto"
                  style={{
                    boxShadow:
                      "0 2px 12px 0 rgba(0,0,0,0.14), 0 1px 4px 0 rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.14)",
                  }}
                >
                  {/* Play/Pause Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 sm:h-10 sm:w-10 text-white hover:bg-white/20 rounded-full focus:ring-2 focus:ring-white/40"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? (
                      <PauseCircle className="h-6 w-6 sm:h-7 sm:w-7" />
                    ) : (
                      <PlayCircle className="h-6 w-6 sm:h-7 sm:w-7" />
                    )}
                  </Button>
                  {/* Fullscreen Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 sm:h-10 sm:w-10 text-white hover:bg-white/20 rounded-full focus:ring-2 focus:ring-white/40"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="h-6 w-6" />
                    ) : (
                      <Maximize2 className="h-6 w-6" />
                    )}
                  </Button>
                </div>
              </div>
              {/* Mobile Volume Slider: đã ẩn hoàn toàn trên mobile */}
            </div>
          </div>
        )}
        {/* Center Play Button */}
        {!isPlaying && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-20 w-20 bg-black/60 hover:bg-black/80 text-white border-none backdrop-blur-lg rounded-full shadow-2xl"
              onClick={togglePlayPause}
            >
              <PlayCircle className="h-12 w-12" />
            </Button>
          </div>
        )}
        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div className="text-white text-center space-y-4">
              <div className="w-14 h-14 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
              <p className="text-base font-medium">Đang tải...</p>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default M3U8Player;
