"use client";
import { ServerEpisode } from "@/types/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { useState } from "react";

interface EpisodeListProps {
  episodes: ServerEpisode[];
}

export default function EpisodeList({ episodes }: EpisodeListProps) {
  const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null);

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
                <div className="grid grid-cols-5 gap-1">
                  {server.server_data.map((episode, index) => (
                    <motion.div
                      key={episode.slug}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.01 }}
                    >
                      <Button
                        variant="secondary"
                        className="w-full h-7 text-[10px] px-1"
                        onClick={() => setSelectedEpisode(episode.link_embed)}
                      >
                        {episode.name}
                      </Button>
                    </motion.div>
                  ))}
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
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-5xl p-0 overflow-hidden">
          <div className="aspect-video relative">
            <iframe
              src={selectedEpisode || ""}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
