"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import M3U8Player from "@/components/M3U8Player";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { type ServerEpisode } from "@/types/common";
import { useState, useEffect } from "react";

interface EnhancedVideoDialogProps {
  open: boolean;
  episode: ServerEpisode["server_data"][0] | null;
  onClose: () => void;
  onTimeUpdate?: (time: number, duration?: number) => void;
  onEnded?: () => void;
  initialTime?: number;
  isAutoPlaying?: boolean;
  onCancelAutoPlay?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export default function EnhancedVideoDialog({
  open,
  episode,
  onClose,
  onTimeUpdate,
  onEnded,
  initialTime,
  isAutoPlaying = false,
  onCancelAutoPlay,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}: EnhancedVideoDialogProps) {
  const [countdown, setCountdown] = useState(0);

  // Auto-play countdown
  useEffect(() => {
    if (isAutoPlaying) {
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
  }, [isAutoPlaying]);

  return (
    <Dialog open={open}>
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
                hasPrev={hasPrev}
                hasNext={hasNext}
                onPrev={onPrev}
                onNext={onNext}
                onClose={onClose}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
