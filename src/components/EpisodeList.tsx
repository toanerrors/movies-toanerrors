/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { ServerEpisode } from "@/types/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { getLatestWatchForMovie, getMovieProgress } from "@/lib/watch-history";
import {
  Check,
  Clock,
  Play,
  PlayCircle,
  Monitor,
  Smartphone,
  Calendar,
  Eye,
  ChevronRight,
  Download,
  History,
} from "lucide-react";
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

  const totalEpisodes = episodes.reduce(
    (acc, server) => acc + server.server_data.length,
    0
  );

  return (
    <>
      <div className="animate-in fade-in slide-in-from-bottom duration-500 delay-200">
        <Card className="border-none bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-xl shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-xl font-bold">
                <PlayCircle className="w-6 h-6 text-primary" />
                Danh sách tập phim
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  {totalEpisodes} tập
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Continue watching banner */}
            {lastWatchedEpisode && lastWatched && (
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl p-4 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <History className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        Tiếp tục xem: {lastWatchedEpisode.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Đã xem {formatMinutes(lastWatched.timestamp)} phút
                      </p>
                    </div>
                  </div>
                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={handleContinueWatching}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Xem tiếp
                  </Button>
                </div>
              </div>
            )}

            {/* Server tabs */}
            <Tabs defaultValue={episodes[0]?.server_name} className="space-y-4">
              <div className="flex items-center justify-between">
                <ScrollArea className="w-full max-w-full">
                  <TabsList className="inline-flex bg-muted/50 p-1 rounded-lg">
                    {episodes.map((server, index) => (
                      <TabsTrigger
                        key={server.server_name}
                        value={server.server_name}
                        className="relative px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                      >
                        <Monitor className="w-4 h-4 mr-2" />
                        {server.server_name}
                        <Badge
                          variant="secondary"
                          className="ml-2 text-xs bg-primary/20 text-primary"
                        >
                          {server.server_data.length}
                        </Badge>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <ScrollBar orientation="horizontal" className="h-2" />
                </ScrollArea>
              </div>

              {/* Episode grids */}
              {episodes.map((server) => (
                <TabsContent
                  key={server.server_name}
                  value={server.server_name}
                  className="mt-4"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                    {server.server_data.map((episode, index) => {
                      const status = getEpisodeStatus(episode);

                      return (
                        <div
                          key={episode.slug}
                          className="animate-in fade-in slide-in-from-bottom duration-300 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                          style={{
                            animationDelay: `${Math.min(index * 20, 500)}ms`,
                          }}
                        >
                          <Button
                            variant="outline"
                            className={`
                              relative w-full h-14 p-3 rounded-xl border-2 transition-all duration-300 overflow-hidden
                              ${
                                status.isCompleted
                                  ? "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400"
                                  : status.hasProgress
                                  ? "border-primary/50 bg-primary/10 text-primary"
                                  : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
                              }
                              ${
                                status.isCurrentlyPlaying
                                  ? "border-red-500 bg-red-500/20 text-red-700 dark:text-red-400 shadow-lg"
                                  : ""
                              }
                              group
                            `}
                            onClick={() => openEpisode(episode)}
                          >
                            {/* Background pattern */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 flex flex-col items-center justify-center gap-1 w-full">
                              <span className="font-semibold text-sm line-clamp-1">
                                {episode.name}
                              </span>

                              {/* Status indicators */}
                              <div className="flex items-center gap-1">
                                {status.isCompleted && (
                                  <Check className="w-3 h-3 text-green-500" />
                                )}
                                {status.hasProgress && !status.isCompleted && (
                                  <Clock className="w-3 h-3 text-primary" />
                                )}
                                {status.isCurrentlyPlaying && (
                                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                )}
                              </div>
                            </div>

                            {/* Progress bar */}
                            {status.hasProgress && !status.isCompleted && (
                              <div className="absolute bottom-0 left-0 right-0">
                                <div className="h-1 bg-primary/20 rounded-b-xl">
                                  <div
                                    className="h-full bg-primary rounded-b-xl transition-all duration-300"
                                    style={{
                                      width: `${status.progressPercentage}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Hover effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <div className="absolute top-2 right-2">
                                <Play className="w-3 h-3" />
                              </div>
                            </div>
                          </Button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Server info */}
                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Server:{" "}
                      <span className="font-medium">{server.server_name}</span>{" "}
                      •{" "}
                      <span className="font-medium">
                        {server.server_data.length}
                      </span>{" "}
                      tập
                    </p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {/* Quick actions */}
            <div className="flex justify-center pt-4 border-t border-border/50">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500/20 border border-green-500/50 rounded" />
                  <span>Đã xem</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-primary/20 border border-primary/50 rounded" />
                  <span>Đang xem</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-border rounded" />
                  <span>Chưa xem</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced VideoDialog */}
      <EnhancedVideoDialog
        open={isDialogOpen}
        episode={currentEpisode}
        onClose={closeDialog}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEpisodeEnd}
        initialTime={getInitialTime()}
        onPrev={goToPrevious}
        onNext={goToNext}
        hasPrev={hasPrevious}
        hasNext={hasNext}
        isAutoPlaying={isAutoPlaying}
        onCancelAutoPlay={cancelAutoPlay}
      />

      {/* Auto-play notification */}
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
