"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import M3U8Player from "@/components/M3U8Player";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Play, SkipBack, SkipForward, RotateCcw } from "lucide-react";
import { type ServerEpisode } from "@/types/common";
import { useState, useEffect } from "react";

interface EnhancedVideoDialogProps {
  open: boolean;
  episode: ServerEpisode["server_data"][0] | null;
  serverName?: string;
  onClose: () => void;
  onTimeUpdate?: (time: number, duration?: number) => void;
  onEnded?: () => void;
  initialTime?: number;

  // Navigation
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;

  // Progress tracking
  currentEpisodeIndex?: number;
  totalEpisodes?: number;

  // UI customization
  showEpisodeInfo?: boolean;
  showControls?: boolean;
  className?: string;
}

interface VideoControlsProps {
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  onClose: () => void;
  episode: ServerEpisode["server_data"][0];
  serverName?: string;
  currentIndex?: number;
  totalEpisodes?: number;
}

function VideoControls({
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  onClose,
  episode,
  serverName,
  currentIndex,
  totalEpisodes,
}: VideoControlsProps) {
  const [showControls, setShowControls] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isHovering) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    } else {
      setShowControls(true);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isHovering]);

  return (
    <div
      className="absolute inset-0 z-30 pointer-events-none"
      onMouseEnter={() => {
        setIsHovering(true);
        setShowControls(true);
      }}
      onMouseLeave={() => {
        setIsHovering(false);
      }}
      onMouseMove={() => {
        setIsHovering(true);
        setShowControls(true);
      }}
    >
      {/* Top gradient overlay */}
      <div
        className={`absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/60 to-transparent transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Close button */}
        <div className="absolute top-3 right-3 pointer-events-auto">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 bg-black/40 hover:bg-black/60 text-white border-none backdrop-blur-sm"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Episode info */}
        <div className="absolute top-3 left-3 max-w-md pointer-events-none">
          <div className="bg-black/40 backdrop-blur-sm rounded-md px-3 py-1.5">
            <h3 className="text-white font-medium text-sm line-clamp-1">
              {episode.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              {serverName && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-white/15 text-white border-none px-2 py-0.5"
                >
                  {serverName}
                </Badge>
              )}
              {currentIndex !== undefined && totalEpisodes !== undefined && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-white/15 text-white border-none px-2 py-0.5"
                >
                  {currentIndex + 1}/{totalEpisodes}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Side navigation - only show when hovering edges */}
      <div
        className={`absolute inset-y-0 left-0 right-0 flex items-center justify-between transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Previous button */}
        {hasPrev && (
          <div className="w-20 flex items-center justify-start pl-3 pointer-events-auto">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 bg-black/40 hover:bg-black/60 text-white border-none shadow-lg backdrop-blur-sm"
              onClick={onPrev}
            >
              <SkipBack className="h-6 w-6" />
            </Button>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Next button */}
        {hasNext && (
          <div className="w-20 flex items-center justify-end pr-3 pointer-events-auto">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 bg-black/40 hover:bg-black/60 text-white border-none shadow-lg backdrop-blur-sm"
              onClick={onNext}
            >
              <SkipForward className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EnhancedVideoDialog({
  open,
  episode,
  serverName,
  onClose,
  onTimeUpdate,
  onEnded,
  initialTime,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
  currentEpisodeIndex,
  totalEpisodes,
  showControls = true,
  className = "",
}: EnhancedVideoDialogProps) {
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Reset player ready state when episode changes
  useEffect(() => {
    if (episode) {
      setIsPlayerReady(false);
      setHasError(false);
      // Small delay to ensure player is properly initialized
      const timer = setTimeout(() => setIsPlayerReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [episode]);

  const handleRetry = () => {
    setHasError(false);
    setIsPlayerReady(false);
    setTimeout(() => setIsPlayerReady(true), 100);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogTitle className="sr-only">
        {episode ? `Đang phát: ${episode.name}` : "Trình phát video"}
      </DialogTitle>
      <DialogContent
        className={`max-w-7xl w-[95vw] p-0 overflow-hidden bg-black video-dialog-content ${className}`}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="aspect-video relative bg-black group">
          {/* Video player container - full interaction */}
          {episode && isPlayerReady && !hasError && (
            <div className="absolute inset-0 z-10">
              {episode.link_m3u8 ? (
                <M3U8Player
                  src={episode.link_m3u8}
                  onTimeUpdate={onTimeUpdate}
                  onEnded={onEnded}
                  initialTime={initialTime}
                />
              ) : (
                <VideoPlayer
                  src={episode.link_embed}
                  onTimeUpdate={onTimeUpdate}
                  onEnded={onEnded}
                  initialTime={initialTime}
                />
              )}
            </div>
          )}

          {/* Loading state */}
          {!isPlayerReady && episode && !hasError && (
            <div className="absolute inset-0 bg-black flex items-center justify-center z-20">
              <div className="text-white text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
                  <Play className="w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-semibold">Đang tải video...</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Vui lòng đợi một chút
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error state */}
          {hasError && episode && (
            <div className="absolute inset-0 bg-black flex items-center justify-center z-20">
              <div className="text-white text-center space-y-4 max-w-md mx-auto px-4">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                  <X className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <p className="text-lg font-semibold">Không thể phát video</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Có lỗi xảy ra khi tải video. Vui lòng thử lại hoặc chọn
                    server khác.
                  </p>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                    onClick={handleRetry}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Thử lại
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                    onClick={onClose}
                  >
                    Đóng
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Custom video controls overlay */}
          {showControls && episode && isPlayerReady && !hasError && (
            <VideoControls
              onPrev={onPrev}
              onNext={onNext}
              hasPrev={hasPrev}
              hasNext={hasNext}
              onClose={onClose}
              episode={episode}
              serverName={serverName}
              currentIndex={currentEpisodeIndex}
              totalEpisodes={totalEpisodes}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
