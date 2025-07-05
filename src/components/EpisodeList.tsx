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

  const findPreviousEpisode = () => {
    if (!selectedEpisode) return null;
    const currentServer = episodes.find((s) =>
      s.server_data.includes(selectedEpisode)
    );
    if (!currentServer) return null;

    const currentIndex = currentServer.server_data.findIndex(
      (ep) => ep.slug === selectedEpisode.slug
    );
    return currentServer.server_data[currentIndex - 1] || null;
  };

  const findNextEpisode = () => {
    if (!selectedEpisode) return null;
    const currentServer = episodes.find((s) =>
      s.server_data.includes(selectedEpisode)
    );
    if (!currentServer) return null;

    const currentIndex = currentServer.server_data.findIndex(
      (ep) => ep.slug === selectedEpisode.slug
    );
    return currentServer.server_data[currentIndex + 1] || null;
  };

  const handlePreviousEpisode = () => {
    const prevEp = findPreviousEpisode();
    if (prevEp) {
      setSelectedEpisode(prevEp);
      setVideoEnded(false);
    }
  };

  const handleNextEpisode = () => {
    const nextEp = findNextEpisode();
    if (nextEp) {
      setSelectedEpisode(nextEp);
      setVideoEnded(false);
    }
  };

  const handleTimeUpdate = (time: number) => {
    if (selectedEpisode) {
      saveWatchHistory({
        movieSlug,
        episodeSlug: selectedEpisode.slug,
        timestamp: time,
        lastWatched: Date.now(),
        serverName:
          episodes.find((s) => s.server_data.includes(selectedEpisode))
            ?.server_name || "",
      });
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
                    const progress = getEpisodeProgress(
                      movieSlug,
                      episode.slug
                    );
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
                          onClick={() => {
                            saveWatchHistory({
                              movieSlug,
                              episodeSlug: episode.slug,
                              timestamp: 0,
                              lastWatched: Date.now(),
                              serverName: server.server_name,
                            });
                            setSelectedEpisode(episode);
                          }}
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

      <Dialog
        open={!!selectedEpisode}
        onOpenChange={() => setSelectedEpisode(null)}
      >
        <DialogTitle className="p-2"></DialogTitle>
        <DialogContent className="max-w-5xl p-0 overflow-hidden">
          <div className="aspect-video relative group">
            {selectedEpisode &&
              (selectedEpisode.link_m3u8 ? (
                <M3U8Player
                  src={selectedEpisode.link_m3u8}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleNextEpisode}
                  initialTime={progress?.timestamp}
                />
              ) : (
                <VideoPlayer
                  src={selectedEpisode.link_embed}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleNextEpisode}
                  initialTime={progress?.timestamp}
                />
              ))}

            {/* Navigation overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute inset-y-0 left-0 flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 ml-4 bg-background/70 hover:bg-background/90 pointer-events-auto"
                  onClick={handlePreviousEpisode}
                  disabled={!findPreviousEpisode()}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center ">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 mr-4 bg-background/70 hover:bg-background/90 pointer-events-auto"
                  onClick={handleNextEpisode}
                  disabled={!findNextEpisode()}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
