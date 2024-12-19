"use client";
import { MovieDetail } from "@/types/common";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Clock, Star, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

interface MovieInfoProps {
  movie: MovieDetail;
}

export default function MovieInfo({ movie }: MovieInfoProps) {
  const CDN = "https://img.ophim.live/uploads/movies/";

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return { text: "Hoàn thành", variant: "default" as const };
      case "ongoing":
        return { text: "Đang chiếu", variant: "default" as const };
      case "trailer":
        return { text: "Sắp chiếu", variant: "secondary" as const };
      default:
        return { text: status, variant: "outline" as const };
    }
  };

  const status = getStatusText(movie.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="container mx-auto border-none bg-gradient-to-b from-background/95 to-background/50 backdrop-blur-sm">
        <CardContent className="p-4">
          {/* Poster & Basic Info */}
          <div className="flex gap-4">
            <div className="w-[45%] max-w-96 relative">
              <div className="relative group">
                <Image
                  src={`${CDN}${movie.thumb_url}`}
                  alt={movie.name}
                  width={300}
                  height={450}
                  className="w-full rounded-xl shadow-lg"
                  priority
                />
                {movie.trailer_url && (
                  <Dialog>
                    <DialogTitle></DialogTitle>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      >
                        <PlayCircle className="w-10 h-10 text-white/90" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl p-0">
                      <iframe
                        src={movie.trailer_url}
                        className="w-full aspect-video"
                        allowFullScreen
                      />
                    </DialogContent>
                  </Dialog>
                )}
                <div className="absolute top-2 right-2 flex flex-col gap-1.5">
                  <Badge
                    variant="destructive"
                    className="text-[10px] font-medium"
                  >
                    {movie.quality}
                  </Badge>
                  <Badge
                    variant={status.variant}
                    className="text-[10px] font-medium"
                  >
                    {status.text}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="space-y-1.5">
                <h1 className="text-lg font-bold leading-tight">
                  {movie.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {movie.original_name}
                </p>
                <p className="text-sm">Năm: {movie.year}</p>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {movie.category.map((cat) => (
                    <Badge
                      key={cat.id}
                      variant="secondary"
                      className="text-[10px]"
                    >
                      {cat.name}
                    </Badge>
                  ))}
                </div>

                {(movie.director?.length > 0 || movie.actor?.length > 0) && (
                  <div className="space-y-2 text-sm">
                    {movie.director?.length > 0 && (
                      <p className="line-clamp-2">
                        <span className="text-muted-foreground">Đạo diễn:</span>{" "}
                        {movie.director.join(", ")}
                      </p>
                    )}
                    {movie.actor?.length > 0 && (
                      <p className="line-clamp-2">
                        <span className="text-muted-foreground">
                          Diễn viên:
                        </span>{" "}
                        {movie.actor.join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{movie.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-yellow-500" />
                  <span>{movie.view.toLocaleString()} lượt xem</span>
                </div>
                {movie.tmdb && (
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-yellow-500" />
                    <span>{movie.tmdb.vote_average.toFixed(1)}/10</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <div className="mt-6">
            <h3 className="text-base font-medium mb-2">Nội dung phim</h3>
            <div
              className="text-sm text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: movie.content }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
