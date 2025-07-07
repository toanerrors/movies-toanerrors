"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import M3U8Player from "@/components/M3U8Player";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { type ServerEpisode } from "@/types/common";
import { useState, useEffect } from "react";

interface EnhancedVideoDialogProps {
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

export default function EnhancedVideoDialog({
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
}: EnhancedVideoDialogProps) {
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTitle className="sr-only">
        {episode ? `Playing: ${episode.name}` : "Video Player"}
      </DialogTitle>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-background/95 rounded-2xl shadow-2xl border border-border animate-in fade-in slide-in-from-bottom duration-500">
        <div className="aspect-video relative group bg-black/80">
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
            <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm transition-all animate-in fade-in">
              <div className="bg-background/95 p-8 rounded-xl shadow-xl text-center space-y-4 border border-border">
                <h3 className="text-lg font-semibold text-foreground">
                  Tự động chuyển tập
                </h3>
                <div className="text-4xl font-bold text-primary drop-shadow-lg">
                  {countdown}
                </div>
                <Button
                  onClick={onCancelAutoPlay}
                  variant="outline"
                  className="w-full mt-2"
                >
                  Hủy
                </Button>
              </div>
            </div>
          )}

          {/* Navigation overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between">
            {/* Top bar: Close button */}
            <div className="flex justify-end p-4">
              <Button
                variant="ghost"
                size="icon"
                className="bg-background/80 hover:bg-background/90 pointer-events-auto shadow-md border border-border"
                onClick={onClose}
                aria-label="Đóng"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            {/* Middle: Prev/Next */}
            <div className="flex flex-1 items-center justify-between px-4">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 bg-background/80 hover:bg-background/90 pointer-events-auto border border-border shadow-md"
                onClick={onPrev}
                disabled={!hasPrev}
                aria-label="Tập trước"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 bg-background/80 hover:bg-background/90 pointer-events-auto border border-border shadow-md"
                onClick={onNext}
                disabled={!hasNext}
                aria-label="Tập tiếp theo"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </div>
            {/* Bottom: Episode info */}
            <div className="flex justify-start p-4">
              <div className="bg-background/80 px-4 py-2 rounded-lg shadow-md pointer-events-none">
                <p className="text-base font-medium text-foreground line-clamp-1">
                  {episode?.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
