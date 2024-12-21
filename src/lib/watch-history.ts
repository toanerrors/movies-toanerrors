import { WatchHistoryItem } from "@/types/common";

const WATCH_HISTORY_KEY = "watch_history";

export function getWatchHistory(): WatchHistoryItem[] {
  if (typeof window === "undefined") return [];
  const history = localStorage.getItem(WATCH_HISTORY_KEY);
  return history ? JSON.parse(history) : [];
}

export function saveWatchHistory(item: WatchHistoryItem) {
  const history = getWatchHistory();
  const existingIndex = history.findIndex(
    (h) => h.movieSlug === item.movieSlug && h.episodeSlug === item.episodeSlug
  );

  if (existingIndex !== -1) {
    history[existingIndex] = item;
  } else {
    history.push(item);
  }

  localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(history));
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
