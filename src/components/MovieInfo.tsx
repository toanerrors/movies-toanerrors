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
import {
  Clock,
  Star,
  PlayCircle,
  Calendar,
  Eye,
  Award,
  Users,
  Film,
  Heart,
  Share2,
  Bookmark,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface MovieInfoProps {
  movie: MovieDetail;
}

export default function MovieInfo({ movie }: MovieInfoProps) {
  const CDN = "https://img.ophim.live/uploads/movies/";

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return {
          text: "Hoàn thành",
          variant: "default" as const,
          color: "bg-green-500",
        };
      case "ongoing":
        return {
          text: "Đang chiếu",
          variant: "default" as const,
          color: "bg-blue-500",
        };
      case "trailer":
        return {
          text: "Sắp chiếu",
          variant: "secondary" as const,
          color: "bg-orange-500",
        };
      default:
        return {
          text: status,
          variant: "outline" as const,
          color: "bg-gray-500",
        };
    }
  };

  const status = getStatusText(movie.status);
  const rating = movie.tmdb?.vote_average
    ? (movie.tmdb.vote_average * 10).toFixed(0)
    : null;

  return (
    <div className="relative overflow-hidden">
      {/* Background with blur effect */}
      <div
        className="absolute inset-0 opacity-30 blur-3xl scale-110"
        style={{
          backgroundImage: `url(${CDN}${movie.thumb_url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 animate-in fade-in slide-in-from-bottom duration-700">
        <Card className="border-none bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-6 lg:p-8">
            {/* Main content */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Poster section */}
              <div className="flex-shrink-0 mx-auto lg:mx-0 animate-in fade-in zoom-in duration-500 delay-200">
                <div className="relative group w-64 lg:w-80">
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                    <Image
                      src={`${CDN}${movie.thumb_url}`}
                      alt={movie.name}
                      width={320}
                      height={480}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                      priority
                    />

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Quality and Status badges */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <Badge className="bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-1 shadow-lg">
                        {movie.quality}
                      </Badge>
                      <Badge
                        className={`${status.color} hover:opacity-90 text-white font-semibold px-3 py-1 shadow-lg`}
                      >
                        {status.text}
                      </Badge>
                    </div>

                    {/* Rating badge */}
                    {rating && (
                      <div className="absolute top-4 left-4">
                        <div className="flex items-center gap-1 bg-black/80 backdrop-blur-sm rounded-full px-3 py-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-white font-semibold text-sm">
                            {rating}%
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Play trailer button */}
                    {movie.trailer_url && (
                      <Dialog>
                        <DialogTitle className="sr-only">
                          Trailer {movie.name}
                        </DialogTitle>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute inset-0 w-full h-full bg-transparent hover:bg-black/20 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <PlayCircle className="w-16 h-16 drop-shadow-lg" />
                              <span className="text-sm font-medium">
                                Xem Trailer
                              </span>
                            </div>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl p-0 bg-black">
                          <iframe
                            src={movie.trailer_url}
                            className="w-full aspect-video"
                            allowFullScreen
                          />
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-center gap-2 mt-4">
                    <Button
                      size="sm"
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Yêu thích
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Movie details */}
              <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-right duration-500 delay-300">
                {/* Title section */}
                <div className="space-y-3">
                  <h1 className="text-3xl lg:text-4xl font-bold leading-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                    {movie.name}
                  </h1>
                  <p className="text-lg text-muted-foreground font-medium">
                    {movie.original_name}
                  </p>

                  {/* Quick stats */}
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="font-medium">{movie.year}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{movie.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-primary" />
                      <span>{movie.view.toLocaleString()} lượt xem</span>
                    </div>
                    {movie.tmdb && (
                      <div className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-primary" />
                        <span>
                          {movie.tmdb.vote_average.toFixed(1)}/10 TMDB
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Thể loại
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.category.map((cat) => (
                      <HoverCard key={cat.id}>
                        <HoverCardTrigger asChild>
                          <Badge
                            variant="secondary"
                            className="px-3 py-1.5 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                          >
                            {cat.name}
                          </Badge>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-auto">
                          <p className="text-sm">Xem thêm phim {cat.name}</p>
                        </HoverCardContent>
                      </HoverCard>
                    ))}
                  </div>
                </div>

                {/* Cast and crew */}
                {(movie.director?.length > 0 || movie.actor?.length > 0) && (
                  <div className="space-y-4">
                    {movie.director?.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Film className="w-4 h-4 text-primary" />
                          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Đạo diễn
                          </h3>
                        </div>
                        <p className="text-foreground font-medium">
                          {movie.director.join(", ")}
                        </p>
                      </div>
                    )}

                    {movie.actor?.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Diễn viên
                          </h3>
                        </div>
                        <p className="text-foreground leading-relaxed">
                          {movie.actor.slice(0, 5).join(", ")}
                          {movie.actor.length > 5 && (
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <Button
                                  variant="link"
                                  className="p-0 h-auto text-primary"
                                >
                                  {" "}
                                  và {movie.actor.length - 5} người khác
                                </Button>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80">
                                <p className="text-sm">
                                  {movie.actor.slice(5).join(", ")}
                                </p>
                              </HoverCardContent>
                            </HoverCard>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Synopsis */}
            <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom duration-500 delay-400">
              <h3 className="text-xl font-bold">Nội dung phim</h3>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <div
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: movie.content }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
