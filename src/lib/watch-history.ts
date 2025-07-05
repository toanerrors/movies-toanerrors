import { WatchHistoryItem } from "@/types/common";

const WATCH_HISTORY_KEY = "watch_history";
const WATCH_COMPLETION_THRESHOLD = 0.85; // Consider episode watched at 85%
const SAVE_INTERVAL = 3; // Save every 3 seconds to reduce localStorage writes
const MINIMUM_WATCH_TIME = 30; // Minimum seconds to consider as "watched"

// Cache for optimizing multiple reads
let historyCache: WatchHistoryItem[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL = 1000; // 1 second cache

// Enhanced watch progress event types
export interface WatchProgressEvent {
  movieSlug: string;
  episodeSlug: string;
  timestamp: number;
  duration?: number;
  percentage?: number;
  serverName: string;
  eventType: "progress" | "completed" | "started" | "resumed";
}

export function getWatchHistory(): WatchHistoryItem[] {
  if (typeof window === "undefined") return [];

  // Use cache if recent
  const now = Date.now();
  if (historyCache && now - lastCacheTime < CACHE_TTL) {
    return historyCache;
  }

  const history = localStorage.getItem(WATCH_HISTORY_KEY);
  historyCache = history ? JSON.parse(history) : [];
  lastCacheTime = now;

  // Sort by lastWatched descending for better performance
  if (historyCache) {
    return historyCache.sort((a, b) => b.lastWatched - a.lastWatched);
  }

  return [];
}

export function saveWatchHistory(item: WatchHistoryItem) {
  const history = getWatchHistory();
  const existingIndex = history.findIndex(
    (h) => h.movieSlug === item.movieSlug && h.episodeSlug === item.episodeSlug
  );

  const now = Date.now();

  if (existingIndex !== -1) {
    // Update existing entry
    const existing = history[existingIndex];
    history[existingIndex] = {
      ...existing,
      ...item,
      lastWatched: now,
      // Keep the higher timestamp (don't go backwards)
      timestamp: Math.max(existing.timestamp || 0, item.timestamp || 0),
    };
  } else {
    // Add new entry
    const newItem = {
      ...item,
      lastWatched: now,
    };
    history.unshift(newItem); // Add to beginning for recent access
  }

  // Limit history size to prevent localStorage bloat
  const maxHistorySize = 1000;
  if (history.length > maxHistorySize) {
    history.splice(maxHistorySize);
  }

  localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(history));

  // Update cache
  historyCache = history;
  lastCacheTime = now;
}

// Enhanced progress saving with smart throttling
export function saveWatchProgress(event: WatchProgressEvent) {
  const { movieSlug, episodeSlug, timestamp, duration, serverName, eventType } =
    event;

  // Don't save progress for very short watch times unless it's a completion event
  if (eventType !== "completed" && timestamp < MINIMUM_WATCH_TIME) {
    return;
  }

  const percentage = duration ? (timestamp / duration) * 100 : 0;
  const isCompleted =
    eventType === "completed" ||
    (duration ? percentage >= WATCH_COMPLETION_THRESHOLD * 100 : false);

  saveWatchHistory({
    movieSlug,
    episodeSlug,
    timestamp,
    duration,
    lastWatched: Date.now(),
    serverName,
    isCompleted,
  });
}

export function getEpisodeProgress(
  movieSlug: string,
  episodeSlug: string
): WatchHistoryItem | undefined {
  const history = getWatchHistory();
  return history.find(
    (h) => h.movieSlug === movieSlug && h.episodeSlug === episodeSlug
  );
}

export function getLatestWatchForMovie(
  movieSlug: string
): WatchHistoryItem | null {
  const history = getWatchHistory();
  const movieHistory = history.filter((item) => item.movieSlug === movieSlug);
  if (!movieHistory.length) return null;

  // Return the most recent watch
  return movieHistory.reduce((prev, cur) =>
    cur.lastWatched > prev.lastWatched ? cur : prev
  );
}

export function markEpisodeAsWatched(
  movieSlug: string,
  episodeSlug: string,
  serverName: string,
  totalDuration?: number
) {
  const progress = getEpisodeProgress(movieSlug, episodeSlug);
  const watchedTimestamp = totalDuration || progress?.timestamp || 0;

  saveWatchHistory({
    movieSlug,
    episodeSlug,
    timestamp: watchedTimestamp,
    lastWatched: Date.now(),
    serverName,
    isCompleted: true,
  });
}

export function isEpisodeCompleted(
  movieSlug: string,
  episodeSlug: string,
  totalDuration?: number
): boolean {
  const progress = getEpisodeProgress(movieSlug, episodeSlug);
  if (!progress) return false;

  // Check if explicitly marked as completed
  if (progress.isCompleted) return true;

  // Check if watched percentage exceeds threshold
  if (totalDuration && progress.timestamp > 0) {
    const watchedPercentage = progress.timestamp / totalDuration;
    return watchedPercentage >= WATCH_COMPLETION_THRESHOLD;
  }

  return false;
}

export function shouldSaveProgress(
  lastSaveTime: number,
  currentTime: number
): boolean {
  return currentTime - lastSaveTime >= SAVE_INTERVAL;
}

// Get next unwatched episode for a movie
export function getNextUnwatchedEpisode(
  movieSlug: string,
  allEpisodes: Array<{
    episode: { slug: string; name: string };
    serverName: string;
  }>
): { episode: { slug: string; name: string }; serverName: string } | null {
  const history = getWatchHistory();
  const movieHistory = history.filter((h) => h.movieSlug === movieSlug);

  // Find the first episode that isn't completed
  for (const item of allEpisodes) {
    const progress = movieHistory.find(
      (h) => h.episodeSlug === item.episode.slug
    );
    if (!progress || !progress.isCompleted) {
      return item;
    }
  }

  return null; // All episodes watched
}

// Get watch progress for a specific movie
export function getMovieProgress(movieSlug: string) {
  const history = getWatchHistory();
  const movieHistory = history.filter((item) => item.movieSlug === movieSlug);

  if (movieHistory.length === 0) {
    return {
      hasProgress: false,
      totalEpisodes: 0,
      watchedEpisodes: 0,
      completedEpisodes: 0,
      lastWatchedEpisode: null,
      totalWatchTime: 0,
      completionPercentage: 0,
    };
  }

  const uniqueEpisodes = new Set(movieHistory.map((h) => h.episodeSlug));
  const completedEpisodes = movieHistory.filter((h) => h.isCompleted).length;
  const totalWatchTime = movieHistory.reduce(
    (sum, h) => sum + (h.timestamp || 0),
    0
  );
  const lastWatched = movieHistory.reduce((prev, cur) =>
    cur.lastWatched > prev.lastWatched ? cur : prev
  );

  return {
    hasProgress: true,
    totalEpisodes: uniqueEpisodes.size,
    watchedEpisodes: uniqueEpisodes.size,
    completedEpisodes,
    lastWatchedEpisode: lastWatched,
    totalWatchTime,
    completionPercentage:
      uniqueEpisodes.size > 0
        ? (completedEpisodes / uniqueEpisodes.size) * 100
        : 0,
  };
}

export function getMovieWatchStatistics(movieSlug: string) {
  const history = getWatchHistory();
  const movieHistory = history.filter((item) => item.movieSlug === movieSlug);

  const totalEpisodes = new Set(movieHistory.map((h) => h.episodeSlug)).size;
  const completedEpisodes = movieHistory.filter((h) => h.isCompleted).length;
  const totalWatchTime = movieHistory.reduce((sum, h) => sum + h.timestamp, 0);

  return {
    totalEpisodes,
    completedEpisodes,
    totalWatchTime,
    completionRate: totalEpisodes > 0 ? completedEpisodes / totalEpisodes : 0,
    lastWatched:
      movieHistory.length > 0
        ? Math.max(...movieHistory.map((h) => h.lastWatched))
        : 0,
  };
}

export function clearWatchHistory() {
  localStorage.removeItem(WATCH_HISTORY_KEY);
  historyCache = null;
}

export function removeFromWatchHistory(
  movieSlug: string,
  episodeSlug?: string
) {
  const history = getWatchHistory();
  const filteredHistory = history.filter((h) => {
    if (episodeSlug) {
      return !(h.movieSlug === movieSlug && h.episodeSlug === episodeSlug);
    }
    return h.movieSlug !== movieSlug;
  });

  localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(filteredHistory));
  historyCache = filteredHistory;
  lastCacheTime = Date.now();
}
