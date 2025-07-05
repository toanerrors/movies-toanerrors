/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { ServerEpisode } from "@/types/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { useState, useRef } from "react";
import {
  getWatchHistory,
  getEpisodeProgress,
  saveWatchHistory,
} from "@/lib/watch-history";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import VideoPlayer from "./VideoPlayer";
import M3U8Player from "./M3U8Player";
import VideoDialog from "@/components/VideoDialog";

function formatLastWatched(time: number) {
  return new Date(time).toLocaleString();
}

function getLatestWatchForMovie(movieSlug: string) {
  const all = getWatchHistory().filter((item) => item.movieSlug === movieSlug);
  if (!all.length) return null;
  // Return the one with the most recent lastWatched
  return all.reduce((prev, cur) =>
    cur.lastWatched > prev.lastWatched ? cur : prev
  );
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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>(null);
  const [videoEnded, setVideoEnded] = useState(false);

  // --- New: VideoDialog state and navigation helpers ---
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState<
    ServerEpisode["server_data"][0] | null
  >(null);

  // Find current server and index for navigation
  const getCurrentServerAndIndex = () => {
    if (!currentEpisode) return { server: null, index: -1 };
    const server = episodes.find((s) =>
      s.server_data.some((ep) => ep.slug === currentEpisode.slug)
    );
    if (!server) return { server: null, index: -1 };
    const index = server.server_data.findIndex(
      (ep) => ep.slug === currentEpisode.slug
    );
    return { server, index };
  };

  const handleOpenEpisode = (ep: ServerEpisode["server_data"][0]) => {
    setCurrentEpisode(ep);
    setVideoDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setVideoDialogOpen(false);
    setCurrentEpisode(null);
  };

  const handlePrev = () => {
    const { server, index } = getCurrentServerAndIndex();
    if (server && index > 0) {
      setCurrentEpisode(server.server_data[index - 1]);
    }
  };
  const handleNext = () => {
    const { server, index } = getCurrentServerAndIndex();
    if (server && index < server.server_data.length - 1) {
      setCurrentEpisode(server.server_data[index + 1]);
    }
  };
  const hasPrev = () => {
    const { index } = getCurrentServerAndIndex();
    return index > 0;
  };
  const hasNext = () => {
    const { server, index } = getCurrentServerAndIndex();
    return server ? index < server.server_data.length - 1 : false;
  };

  // --- Optimize: Save watch history only if timestamp changed ---
  const lastSavedTimestamp = useRef<number | undefined>(undefined);
  const handleTimeUpdate = (time: number) => {
    if (currentEpisode && lastSavedTimestamp.current !== time) {
      saveWatchHistory({
        movieSlug,
        episodeSlug: currentEpisode.slug,
        timestamp: time,
        lastWatched: Date.now(),
        serverName:
          episodes.find((s) =>
            s.server_data.some((ep) => ep.slug === currentEpisode.slug)
          )?.server_name || "",
      });
      lastSavedTimestamp.current = time;
    }
  };

  const progress = selectedEpisode
    ? getEpisodeProgress(movieSlug, selectedEpisode.slug)
    : undefined;

  const getWatchStatus = (episode: ServerEpisode["server_data"][0]) => {
    const progress = getEpisodeProgress(movieSlug, episode.slug);
    return progress ? true : false;
  };

  const getEpisodeStatus = (episode: ServerEpisode["server_data"][0]) => {
    const isWatched = getWatchStatus(episode);
    const isCurrentlyWatching = selectedEpisode?.slug === episode.slug;
    return { isWatched, isCurrentlyWatching };
  };

  // Find the most recent watch data and matching episode
  const lastWatched = getLatestWatchForMovie(movieSlug) || {
    episodeSlug: null,
    timestamp: 0,
  };
  const lastWatchedServer = lastWatched
    ? episodes.find((server) =>
        server.server_data.some((ep) => ep.slug === lastWatched.episodeSlug)
      )
    : null;
  const lastWatchedEpisode = lastWatchedServer
    ? lastWatchedServer.server_data.find(
        (ep) => ep.slug === lastWatched.episodeSlug
      )
    : null;

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
          {lastWatchedEpisode && (
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
                onClick={() => setSelectedEpisode(lastWatchedEpisode)}
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
                            getEpisodeStatus(episode).isWatched
                              ? "ring-1 ring-primary/50 bg-primary/10"
                              : ""
                          } ${
                            getEpisodeStatus(episode).isCurrentlyWatching
                              ? "ring-2 ring-destructive bg-destructive/20 font-bold"
                              : ""
                          }`}
                          onClick={() => handleOpenEpisode(episode)}
                        >
                          <span>{episode.name}</span>
                          {getEpisodeStatus(episode).isWatched && (
                            <Check className="w-3 h-3 absolute right-1 top-1 text-primary/70" />
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
      {/* --- VideoDialog extracted --- */}
      <VideoDialog
        open={videoDialogOpen}
        episode={currentEpisode}
        onClose={handleCloseDialog}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        initialTime={
          currentEpisode
            ? getEpisodeProgress(movieSlug, currentEpisode.slug)?.timestamp
            : 0
        }
        onPrev={handlePrev}
        onNext={handleNext}
        hasPrev={hasPrev()}
        hasNext={hasNext()}
      />
    </>
  );
}
