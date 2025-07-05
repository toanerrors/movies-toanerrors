"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import M3U8Player from "@/components/M3U8Player";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type ServerEpisode } from "@/types/common";

interface VideoDialogProps {
  open: boolean;
  episode: ServerEpisode["server_data"][0] | null;
  onClose: () => void;
  onTimeUpdate?: (time: number) => void;
  onEnded?: () => void;
  initialTime?: number;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
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
}: VideoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTitle className="p-2"></DialogTitle>
      <DialogContent className="max-w-5xl p-0 overflow-hidden">
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

          {/* Navigation overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute inset-y-0 left-0 flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 ml-4 bg-background/70 hover:bg-background/90 pointer-events-auto"
                onClick={onPrev}
                disabled={!hasPrev}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 mr-4 bg-background/70 hover:bg-background/90 pointer-events-auto"
                onClick={onNext}
                disabled={!hasNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
