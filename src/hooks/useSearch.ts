"use client";

import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "@/actions/searchActions";

export const useSearchMovies = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      const res = await searchMovies(query);
      console.log("DEBUG useSearchMovies response:", res);
      return res;
    },
    enabled: enabled && query.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => (Array.isArray(data?.data?.items) ? data.data.items : []),
  });
};
