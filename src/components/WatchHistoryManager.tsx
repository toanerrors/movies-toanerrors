"use client";
import { useState, useEffect } from "react";
import {
  getWatchHistory,
  getMovieWatchStatistics,
  clearWatchHistory,
  removeFromWatchHistory,
} from "@/lib/watch-history";
import { WatchHistoryItem } from "@/types/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Play, Clock, TrendingUp, BarChart3, Film } from "lucide-react";
import { motion } from "framer-motion";

interface WatchHistoryManagerProps {
  className?: string;
  onEpisodeSelect?: (movieSlug: string, episodeSlug: string) => void;
}

interface MovieStats {
  movieSlug: string;
  totalEpisodes: number;
  completedEpisodes: number;
  totalWatchTime: number;
  completionPercentage: number;
  lastWatched: number;
}

function formatWatchTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Simple Progress component since we don't have ui/progress
function SimpleProgress({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className || ""}`}>
      <div
        className="bg-primary h-2 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export default function WatchHistoryManager({
  className = "",
  onEpisodeSelect,
}: WatchHistoryManagerProps) {
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [movieStats, setMovieStats] = useState<Record<string, MovieStats>>({});
  const [selectedTab, setSelectedTab] = useState<"recent" | "movies" | "stats">(
    "recent"
  );
  const [isLoading, setIsLoading] = useState(true);

  // Load history and compute stats
  useEffect(() => {
    const loadHistory = () => {
      setIsLoading(true);
      const watchHistory = getWatchHistory();
      setHistory(watchHistory);

      // Compute movie statistics
      const uniqueMovies = [...new Set(watchHistory.map((h) => h.movieSlug))];
      const stats: Record<string, MovieStats> = {};

      uniqueMovies.forEach((movieSlug) => {
        const movieData = getMovieWatchStatistics(movieSlug);
        stats[movieSlug] = {
          movieSlug,
          ...movieData,
          completionPercentage: movieData.completionRate * 100,
        };
      });

      setMovieStats(stats);
      setIsLoading(false);
    };

    loadHistory();
  }, []);

  const handleClearHistory = () => {
    if (confirm("Bạn có chắc muốn xóa toàn bộ lịch sử xem?")) {
      clearWatchHistory();
      setHistory([]);
      setMovieStats({});
    }
  };

  const handleRemoveMovie = (movieSlug: string) => {
    if (confirm(`Bạn có chắc muốn xóa lịch sử xem của "${movieSlug}"?`)) {
      removeFromWatchHistory(movieSlug);
      const updatedHistory = getWatchHistory();
      setHistory(updatedHistory);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [movieSlug]: _removed, ...rest } = movieStats;
      setMovieStats(rest);
    }
  };

  const handleRemoveEpisode = (movieSlug: string, episodeSlug: string) => {
    if (confirm(`Bạn có chắc muốn xóa lịch sử xem tập "${episodeSlug}"?`)) {
      removeFromWatchHistory(movieSlug, episodeSlug);
      const updatedHistory = getWatchHistory();
      setHistory(updatedHistory);

      // Recalculate stats for this movie
      const movieData = getMovieWatchStatistics(movieSlug);
      if (movieData.totalEpisodes > 0) {
        setMovieStats((prev) => ({
          ...prev,
          [movieSlug]: {
            movieSlug,
            ...movieData,
            completionPercentage:
              (movieData.completedEpisodes / movieData.totalEpisodes) * 100,
          },
        }));
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [movieSlug]: _removed, ...rest } = movieStats;
        setMovieStats(rest);
      }
    }
  };

  // Recent episodes (last 20)
  const recentEpisodes = history.slice(0, 20);

  // Top movies by watch time
  const topMovies = Object.values(movieStats)
    .sort((a, b) => b.totalWatchTime - a.totalWatchTime)
    .slice(0, 10);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
            <span className="ml-2">Đang tải lịch sử...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with tabs */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Lịch sử xem</CardTitle>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearHistory}
              disabled={history.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Xóa tất cả
            </Button>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant={selectedTab === "recent" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTab("recent")}
            >
              <Clock className="h-4 w-4 mr-1" />
              Gần đây
            </Button>
            <Button
              variant={selectedTab === "movies" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTab("movies")}
            >
              <Film className="h-4 w-4 mr-1" />
              Phim
            </Button>
            <Button
              variant={selectedTab === "stats" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTab("stats")}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Thống kê
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Content based on selected tab */}
      {selectedTab === "recent" && (
        <Card>
          <CardContent className="p-4">
            {recentEpisodes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Play className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Chưa có lịch sử xem nào</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentEpisodes.map((item, index) => (
                  <motion.div
                    key={`${item.movieSlug}-${item.episodeSlug}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {item.movieSlug}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.episodeSlug} • {formatDate(item.lastWatched)}
                      </div>
                      {item.duration && (
                        <SimpleProgress
                          value={(item.timestamp / item.duration) * 100}
                          className="mt-1 h-1"
                        />
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {item.isCompleted && (
                        <Badge variant="secondary" className="text-xs">
                          Hoàn thành
                        </Badge>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          onEpisodeSelect?.(item.movieSlug, item.episodeSlug)
                        }
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleRemoveEpisode(item.movieSlug, item.episodeSlug)
                        }
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedTab === "movies" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.values(movieStats).map((stats, index) => (
            <motion.div
              key={stats.movieSlug}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-sm line-clamp-2">
                      {stats.movieSlug}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMovie(stats.movieSlug)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Tiến độ:</span>
                      <span>
                        {stats.completedEpisodes}/{stats.totalEpisodes} tập
                      </span>
                    </div>
                    <SimpleProgress
                      value={stats.completionPercentage}
                      className="h-1.5"
                    />
                    <div className="flex justify-between text-muted-foreground">
                      <span>Thời gian xem:</span>
                      <span>{formatWatchTime(stats.totalWatchTime)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Lần cuối:</span>
                      <span>{formatDate(stats.lastWatched)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {selectedTab === "stats" && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Film className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Tổng phim</span>
                </div>
                <div className="text-2xl font-bold">
                  {Object.keys(movieStats).length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Play className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Tổng tập</span>
                </div>
                <div className="text-2xl font-bold">{history.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Thời gian xem</span>
                </div>
                <div className="text-2xl font-bold">
                  {formatWatchTime(
                    Object.values(movieStats).reduce(
                      (sum, stats) => sum + stats.totalWatchTime,
                      0
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Hoàn thành</span>
                </div>
                <div className="text-2xl font-bold">
                  {
                    Object.values(movieStats).filter(
                      (stats) => stats.completionPercentage === 100
                    ).length
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Movies by Watch Time */}
          {topMovies.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">
                  Top phim theo thời gian xem
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {topMovies.map((movie, index) => (
                    <div
                      key={movie.movieSlug}
                      className="flex items-center gap-3"
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {movie.movieSlug}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatWatchTime(movie.totalWatchTime)} •{" "}
                          {movie.completedEpisodes}/{movie.totalEpisodes} tập
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round(movie.completionPercentage)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
