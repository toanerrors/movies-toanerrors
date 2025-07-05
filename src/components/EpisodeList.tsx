/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { ServerEpisode } from "@/types/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { getLatestWatchForMovie, getMovieProgress } from "@/lib/watch-history";
import { Check, Clock, Play } from "lucide-react";
import EnhancedVideoDialog from "@/components/EnhancedVideoDialog";
import AutoPlayNotification from "@/components/AutoPlayNotification";
import { useVideoNavigation } from "@/hooks/useVideoNavigation";

function formatLastWatched(time: number) {
  return new Date(time).toLocaleString();
}

function formatMinutes(seconds: number) {
  return Math.floor(seconds / 60);
}

interface EpisodeListProps {
  episodes: ServerEpisode[];
  movieSlug: string;
}

export default function EpisodeList({ episodes, movieSlug }: EpisodeListProps) {
  const [selectedEpisode, setSelectedEpisode] = useState<
    ServerEpisode["server_data"][0] | null
  >(null);

  // Use the video navigation hook
  const {
    isDialogOpen,
    currentEpisode,
    currentServerName,
    isAutoPlaying,
    autoPlayCountdown,
    openEpisode,
    closeDialog,
    goToPrevious,
    goToNext,
    cancelAutoPlay,
    playNextNow,
    handleTimeUpdate,
    handleEpisodeEnd,
    hasPrevious,
    hasNext,
    getEpisodeStatus,
    getNextEpisodeName,
    getInitialTime,
    getCurrentEpisodeIndex,
    getTotalEpisodes,
  } = useVideoNavigation({
    episodes,
    movieSlug,
    autoPlayNext: true,
    autoPlayDelay: 3,
  });

  // Get enhanced movie progress information
  const movieProgress = getMovieProgress(movieSlug);
  const lastWatched = getLatestWatchForMovie(movieSlug);
  const lastWatchedServer = lastWatched
    ? episodes.find((server) =>
        server.server_data.some((ep) => ep.slug === lastWatched.episodeSlug)
      )
    : null;
  const lastWatchedEpisode =
    lastWatchedServer && lastWatched
      ? lastWatchedServer.server_data.find(
          (ep) => ep.slug === lastWatched.episodeSlug
        )
      : null;

  // Handle continue watching
  const handleContinueWatching = () => {
    if (lastWatchedEpisode) {
      openEpisode(lastWatchedEpisode);
    }
  };

  return (
    <>
      <Card className="container mx-auto border-none bg-background/95">
        <CardHeader className="p-2">
          <CardTitle className="flex items-center justify-between text-sm">
            <span>Danh sách tập phim</span>
            <Badge variant="secondary" className="text-[10px]">
              {episodes.reduce(
                (acc, server) => acc + server.server_data.length,
                0
              )}{" "}
              tập
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          {/* Display a small banner for the latest watch */}
          {lastWatchedEpisode && lastWatched && (
            <div className="mb-2 p-2 border border-primary/50 rounded-md text-sm">
              <div>
                Bạn đã xem tới:{" "}
                <span className="font-medium">{lastWatchedEpisode.name}</span>,
                <span> {formatMinutes(lastWatched.timestamp)} phút</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="mt-1"
                onClick={handleContinueWatching}
              >
                Xem tiếp
              </Button>
            </div>
          )}
          <Tabs defaultValue={episodes[0]?.server_name} className="space-y-2">
            <ScrollArea className="w-full">
              <TabsList className="inline-flex h-7 sm:h-9">
                {episodes.map((server) => (
                  <TabsTrigger
                    key={server.server_name}
                    value={server.server_name}
                    className="text-[10px] px-2 h-7"
                  >
                    {server.server_name}
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar orientation="horizontal" className="h-1.5" />
            </ScrollArea>
            {episodes.map((server) => (
              <TabsContent
                key={server.server_name}
                value={server.server_name}
                className="mt-2"
              >
                <div className="flex flex-wrap gap-2">
                  {server.server_data.map((episode, index) => {
                    const status = getEpisodeStatus(episode);
                    return (
                      <motion.div
                        key={episode.slug}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.01 }}
                      >
                        <Button
                          variant="secondary"
                          className={`w-fit min-w-20 h-7 text-[10px] px-1 relative group ${
                            status.isCompleted
                              ? "ring-1 ring-green-500/50 bg-green-500/10"
                              : status.hasProgress
                              ? "ring-1 ring-primary/50 bg-primary/10"
                              : ""
                          } ${
                            status.isCurrentlyPlaying
                              ? "ring-2 ring-destructive bg-destructive/20 font-bold"
                              : ""
                          }`}
                          onClick={() => openEpisode(episode)}
                        >
                          <span>{episode.name}</span>
                          {status.isCompleted && (
                            <Check className="w-3 h-3 absolute right-1 top-1 text-green-500/70" />
                          )}
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Enhanced VideoDialog - auto-play is handled externally via AutoPlayNotification */}
      <EnhancedVideoDialog
        open={isDialogOpen}
        episode={currentEpisode}
        serverName={currentServerName || undefined}
        onClose={closeDialog}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEpisodeEnd}
        initialTime={getInitialTime()}
        onPrev={goToPrevious}
        onNext={goToNext}
        hasPrev={hasPrevious}
        hasNext={hasNext}
        currentEpisodeIndex={getCurrentEpisodeIndex()}
        totalEpisodes={getTotalEpisodes()}
      />

      {/* External Auto-play notification - appears outside dialog */}
      <AutoPlayNotification
        isVisible={isAutoPlaying && autoPlayCountdown > 0 && isDialogOpen}
        countdown={autoPlayCountdown}
        nextEpisodeName={getNextEpisodeName()}
        onCancel={cancelAutoPlay}
        onPlayNow={playNextNow}
      />
    </>
  );
}
