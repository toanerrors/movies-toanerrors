"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import M3U8Player from "@/components/M3U8Player";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
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
}

function VideoControls({
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  onClose,
}: VideoControlsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      {/* Previous button */}
      {hasPrev && (
        <div className="absolute inset-y-0 left-0 flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 ml-4 bg-background/80 hover:bg-background/90 backdrop-blur-sm pointer-events-auto shadow-lg"
            onClick={onPrev}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
        </div>
      )}

      {/* Next button */}
      {hasNext && (
        <div className="absolute inset-y-0 right-0 flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 mr-4 bg-background/80 hover:bg-background/90 backdrop-blur-sm pointer-events-auto shadow-lg"
            onClick={onNext}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
      )}

      {/* Close button */}
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 bg-background/80 hover:bg-background/90 backdrop-blur-sm pointer-events-auto shadow-lg"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}

interface EpisodeInfoOverlayProps {
  episode: ServerEpisode["server_data"][0];
  serverName?: string;
  currentIndex?: number;
  totalEpisodes?: number;
}

function EpisodeInfoOverlay({
  episode,
  serverName,
  currentIndex,
  totalEpisodes,
}: EpisodeInfoOverlayProps) {
  return (
    <div className="absolute bottom-4 left-4 right-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <div className="bg-background/90 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">{episode.name}</p>
            {serverName && (
              <p className="text-xs text-muted-foreground">
                Server: {serverName}
              </p>
            )}
          </div>

          {currentIndex !== undefined && totalEpisodes !== undefined && (
            <Badge variant="secondary" className="text-xs">
              {currentIndex + 1}/{totalEpisodes}
            </Badge>
          )}
        </div>
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
  showEpisodeInfo = true,
  showControls = true,
  className = "",
}: EnhancedVideoDialogProps) {
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  // Reset player ready state when episode changes
  useEffect(() => {
    if (episode) {
      setIsPlayerReady(false);
      // Small delay to ensure player is properly initialized
      const timer = setTimeout(() => setIsPlayerReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [episode]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTitle className="sr-only">
        {episode ? `Đang phát: ${episode.name}` : "Trình phát video"}
      </DialogTitle>
      <DialogContent className={`max-w-6xl p-0 overflow-hidden ${className}`}>
        <div className="aspect-video relative group bg-black">
          {episode && isPlayerReady && (
            <>
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
            </>
          )}

          {/* Loading state */}
          {!isPlayerReady && episode && (
            <div className="absolute inset-0 bg-black flex items-center justify-center">
              <div className="text-white text-center">
                <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                <p>Đang tải video...</p>
              </div>
            </div>
          )}

          {/* Navigation controls */}
          {showControls && (
            <VideoControls
              onPrev={onPrev}
              onNext={onNext}
              hasPrev={hasPrev}
              hasNext={hasNext}
              onClose={onClose}
            />
          )}

          {/* Episode info overlay */}
          {showEpisodeInfo && episode && (
            <EpisodeInfoOverlay
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
