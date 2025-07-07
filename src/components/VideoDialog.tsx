"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import M3U8Player from "@/components/M3U8Player";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { type ServerEpisode } from "@/types/common";
import { useState, useEffect } from "react";

interface VideoDialogProps {
  open: boolean;
  episode: ServerEpisode["server_data"][0] | null;
  onClose: () => void;
  onTimeUpdate?: (time: number, duration?: number) => void;
  onEnded?: () => void;
  initialTime?: number;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  isAutoPlaying?: boolean;
  onCancelAutoPlay?: () => void;
}

export default function VideoDialog({
  open,
  episode,
  onClose,
  onTimeUpdate,
  onEnded,
  initialTime,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  isAutoPlaying = false,
  onCancelAutoPlay,
}: VideoDialogProps) {
  const [countdown, setCountdown] = useState(0);

  // Auto-play countdown
  useEffect(() => {
    if (isAutoPlaying && hasNext) {
      setCountdown(3);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setCountdown(0);
    }
  }, [isAutoPlaying, hasNext]);

  return (
    <Dialog open={open}>
      <DialogTitle className="sr-only">
        {episode ? `Playing: ${episode.name}` : "Video Player"}
      </DialogTitle>
      <DialogContent className="max-w-5xl p-0 overflow-hidden z-[120]">
        <div className="aspect-video relative group">
          {episode &&
            (episode.link_m3u8 ? (
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
            ))}

          {/* Auto-play countdown overlay */}
          {isAutoPlaying && countdown > 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-[130]">
              <div className="bg-background/90 p-6 rounded-lg text-center space-y-4">
                <h3 className="text-lg font-semibold">Tự động chuyển tập</h3>
                <div className="text-3xl font-bold">{countdown}</div>
                <Button onClick={onCancelAutoPlay} variant="outline">
                  Hủy
                </Button>
              </div>
            </div>
          )}

          {/* Navigation overlay - pointer-events enabled for buttons */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity z-[200]">
            {/* Previous button */}
            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-auto z-[210]">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 ml-4 bg-background/70 hover:bg-background/90 pointer-events-auto z-[220]"
                onClick={onPrev}
                disabled={!hasPrev}
                tabIndex={0}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            </div>

            {/* Next button */}
            <div className="absolute inset-y-0 right-0 flex items-center pointer-events-auto z-[210]">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 mr-4 bg-background/70 hover:bg-background/90 pointer-events-auto z-[220]"
                onClick={onNext}
                disabled={!hasNext}
                tabIndex={0}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </div>

            {/* Close button */}
            <div className="absolute top-4 right-4 pointer-events-auto z-[210]">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 bg-background/70 hover:bg-background/90 pointer-events-auto z-[220]"
                onClick={onClose}
                tabIndex={0}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Episode info overlay */}
          <div className="absolute bottom-4 left-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-[110]">
            <div className="bg-background/70 px-3 py-2 rounded-lg">
              <p className="text-sm font-medium">{episode?.name}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
