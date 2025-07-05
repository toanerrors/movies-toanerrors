"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { ServerEpisode } from "@/types/common";
import {
  saveWatchProgress,
  getEpisodeProgress,
  isEpisodeCompleted,
  shouldSaveProgress,
  markEpisodeAsWatched,
} from "@/lib/watch-history";

export interface EpisodeStatus {
  isCompleted: boolean;
  hasProgress: boolean;
  isCurrentlyPlaying: boolean;
  progressPercentage: number;
}

export interface UseVideoNavigationProps {
  episodes: ServerEpisode[];
  movieSlug: string;
  autoPlayNext?: boolean;
  autoPlayDelay?: number; // in seconds
}

export interface UseVideoNavigationReturn {
  // State
  isDialogOpen: boolean;
  currentEpisode: ServerEpisode["server_data"][0] | null;
  currentServerName: string | null;
  isAutoPlaying: boolean;
  autoPlayCountdown: number;

  // Navigation
  openEpisode: (episode: ServerEpisode["server_data"][0]) => void;
  closeDialog: () => void;
  goToPrevious: () => void;
  goToNext: () => void;

  // Auto-play control
  cancelAutoPlay: () => void;
  playNextNow: () => void;
  enableAutoPlay: () => void;
  disableAutoPlay: () => void;

  // Event handlers
  handleTimeUpdate: (time: number, duration?: number) => void;
  handleEpisodeEnd: () => void;

  // Utilities
  hasPrevious: boolean;
  hasNext: boolean;
  getEpisodeStatus: (episode: ServerEpisode["server_data"][0]) => EpisodeStatus;
  getNextEpisodeName: () => string;
  getInitialTime: () => number;
  getAllEpisodes: () => Array<{
    episode: ServerEpisode["server_data"][0];
    serverName: string;
    index: number;
  }>;
  getCurrentEpisodeIndex: () => number;
  getTotalEpisodes: () => number;
}

export function useVideoNavigation({
  episodes,
  movieSlug,
  autoPlayNext = true,
  autoPlayDelay = 3,
}: UseVideoNavigationProps): UseVideoNavigationReturn {
  // State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState<
    ServerEpisode["server_data"][0] | null
  >(null);
  const [currentServerName, setCurrentServerName] = useState<string | null>(
    null
  );
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlayCountdown, setAutoPlayCountdown] = useState(0);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(autoPlayNext);

  // Refs for tracking
  const lastSaveTimeRef = useRef(0);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Create a flat list of all episodes with their server information
  const allEpisodes = episodes.flatMap((server) =>
    server.server_data.map((episode, index) => ({
      episode,
      serverName: server.server_name,
      index,
    }))
  );

  // Get current episode index in the flat list
  const getCurrentEpisodeIndex = useCallback(() => {
    if (!currentEpisode) return -1;
    return allEpisodes.findIndex(
      (item) => item.episode.slug === currentEpisode.slug
    );
  }, [currentEpisode, allEpisodes]);

  // Navigation helpers
  const hasPrevious = getCurrentEpisodeIndex() > 0;
  const hasNext = getCurrentEpisodeIndex() < allEpisodes.length - 1;

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      const countdownInterval = countdownIntervalRef.current;

      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, []);

  // Auto-play countdown effect
  useEffect(() => {
    if (isAutoPlaying && autoPlayCountdown > 0) {
      countdownIntervalRef.current = setInterval(() => {
        setAutoPlayCountdown((prev) => {
          if (prev <= 1) {
            // Auto-play next episode
            const currentIndex = allEpisodes.findIndex(
              (item) => item.episode.slug === currentEpisode?.slug
            );
            if (currentIndex < allEpisodes.length - 1) {
              const nextItem = allEpisodes[currentIndex + 1];
              setCurrentEpisode(nextItem.episode);
              setCurrentServerName(nextItem.serverName);
              lastSaveTimeRef.current = 0;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    }

    return () => {
      const interval = countdownIntervalRef.current;
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAutoPlaying, autoPlayCountdown, allEpisodes, currentEpisode]);

  // Episode operations
  const openEpisode = useCallback(
    (episode: ServerEpisode["server_data"][0]) => {
      // Find the server that contains this episode
      const server = episodes.find((s) =>
        s.server_data.some((ep) => ep.slug === episode.slug)
      );

      if (server) {
        setCurrentEpisode(episode);
        setCurrentServerName(server.server_name);
        setIsDialogOpen(true);
        setIsAutoPlaying(false);
        setAutoPlayCountdown(0);

        // Reset last save time for progress tracking
        lastSaveTimeRef.current = 0;
      }
    },
    [episodes]
  );

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
    setCurrentEpisode(null);
    setCurrentServerName(null);
    setIsAutoPlaying(false);
    setAutoPlayCountdown(0);

    // Clear any pending timers
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
  }, []);

  const goToPrevious = useCallback(() => {
    const currentIndex = getCurrentEpisodeIndex();
    if (currentIndex > 0) {
      const prevItem = allEpisodes[currentIndex - 1];
      openEpisode(prevItem.episode);
    }
  }, [getCurrentEpisodeIndex, allEpisodes, openEpisode]);

  const goToNext = useCallback(() => {
    const currentIndex = getCurrentEpisodeIndex();
    if (currentIndex < allEpisodes.length - 1) {
      const nextItem = allEpisodes[currentIndex + 1];
      openEpisode(nextItem.episode);
    }
  }, [getCurrentEpisodeIndex, allEpisodes, openEpisode]);

  // Auto-play controls
  const cancelAutoPlay = useCallback(() => {
    setIsAutoPlaying(false);
    setAutoPlayCountdown(0);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
  }, []);

  const playNextNow = useCallback(() => {
    const currentIndex = getCurrentEpisodeIndex();
    if (currentIndex < allEpisodes.length - 1) {
      const nextItem = allEpisodes[currentIndex + 1];
      setCurrentEpisode(nextItem.episode);
      setCurrentServerName(nextItem.serverName);
      lastSaveTimeRef.current = 0;
      setIsAutoPlaying(false);
      setAutoPlayCountdown(0);
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    }
  }, [getCurrentEpisodeIndex, allEpisodes]);

  const enableAutoPlay = useCallback(() => {
    setAutoPlayEnabled(true);
  }, []);

  const disableAutoPlay = useCallback(() => {
    setAutoPlayEnabled(false);
    cancelAutoPlay();
  }, [cancelAutoPlay]);

  // Event handlers
  const handleTimeUpdate = useCallback(
    (time: number, duration?: number) => {
      if (!currentEpisode || !currentServerName) return;

      // Throttle saves to avoid excessive localStorage writes
      if (shouldSaveProgress(lastSaveTimeRef.current, time)) {
        saveWatchProgress({
          movieSlug,
          episodeSlug: currentEpisode.slug,
          timestamp: time,
          duration,
          serverName: currentServerName,
          eventType: "progress",
        });
        lastSaveTimeRef.current = time;
      }
    },
    [currentEpisode, currentServerName, movieSlug]
  );

  const handleEpisodeEnd = useCallback(() => {
    if (!currentEpisode || !currentServerName) return;

    // Mark episode as completed
    markEpisodeAsWatched(movieSlug, currentEpisode.slug, currentServerName);

    // Auto-play next episode if enabled and available
    if (autoPlayEnabled && hasNext) {
      setIsAutoPlaying(true);
      setAutoPlayCountdown(autoPlayDelay);
    }
  }, [
    currentEpisode,
    currentServerName,
    movieSlug,
    autoPlayEnabled,
    hasNext,
    autoPlayDelay,
  ]);

  // Utility functions
  const getEpisodeStatus = useCallback(
    (episode: ServerEpisode["server_data"][0]): EpisodeStatus => {
      const progress = getEpisodeProgress(movieSlug, episode.slug);
      const completed = isEpisodeCompleted(
        movieSlug,
        episode.slug,
        progress?.duration
      );

      return {
        isCompleted: completed,
        hasProgress: !!progress && progress.timestamp > 0,
        isCurrentlyPlaying:
          currentEpisode?.slug === episode.slug && isDialogOpen,
        progressPercentage: progress?.duration
          ? (progress.timestamp / progress.duration) * 100
          : 0,
      };
    },
    [movieSlug, currentEpisode, isDialogOpen]
  );

  const getNextEpisodeName = useCallback(() => {
    const currentIndex = getCurrentEpisodeIndex();
    if (currentIndex >= 0 && currentIndex < allEpisodes.length - 1) {
      return allEpisodes[currentIndex + 1].episode.name;
    }
    return "Tập tiếp theo";
  }, [getCurrentEpisodeIndex, allEpisodes]);

  const getInitialTime = useCallback(() => {
    if (!currentEpisode) return 0;
    const progress = getEpisodeProgress(movieSlug, currentEpisode.slug);
    return progress?.timestamp || 0;
  }, [currentEpisode, movieSlug]);

  const getAllEpisodes = useCallback(() => allEpisodes, [allEpisodes]);

  const getTotalEpisodes = useCallback(() => allEpisodes.length, [allEpisodes]);

  return {
    // State
    isDialogOpen,
    currentEpisode,
    currentServerName,
    isAutoPlaying,
    autoPlayCountdown,

    // Navigation
    openEpisode,
    closeDialog,
    goToPrevious,
    goToNext,

    // Auto-play control
    cancelAutoPlay,
    playNextNow,
    enableAutoPlay,
    disableAutoPlay,

    // Event handlers
    handleTimeUpdate,
    handleEpisodeEnd,

    // Utilities
    hasPrevious,
    hasNext,
    getEpisodeStatus,
    getNextEpisodeName,
    getInitialTime,
    getAllEpisodes,
    getCurrentEpisodeIndex,
    getTotalEpisodes,
  };
}
