"use client";

import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "@/actions";

export const useSearchMovies = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => searchMovies(query),
    enabled: enabled && query.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => data?.data?.items || [],
  });
};
