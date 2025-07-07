"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchMovies } from "@/hooks/useSearch";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const FloatingSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const router = useRouter();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchResults = [], isLoading } = useSearchMovies(
    debouncedQuery,
    debouncedQuery.length > 2
  );

  const trendingSearches = [
    "One Piece",
    "Naruto",
    "Attack on Titan",
    "Demon Slayer",
    "Dragon Ball",
    "Jujutsu Kaisen",
    "My Hero Academia",
    "Tokyo Ghoul",
  ];

  // Optimized search handler
  const handleSearch = useCallback(
    (query: string) => {
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
        setIsOpen(false);
        setSearchQuery("");
      }
    },
    [router]
  );

  // Optimized movie selection handler
  const handleMovieSelect = useCallback(
    (movieSlug: string) => {
      router.push(`/phim/${movieSlug}`);
      setIsOpen(false);
      setSearchQuery("");
    },
    [router]
  );

  // Helper để lấy URL ảnh hợp lệ
  const getImageUrl = (movie: any) => {
    const CDN = "https://img.ophim.live/uploads/movies/";
    const url = movie.thumb_url || movie.poster_url;
    if (!url) return "/placeholder-movie.jpg";
    if (url.startsWith("http")) return url;
    return CDN + url.replace(/^\//, "");
  };

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
        {/* Search Button */}
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 backdrop-blur-sm transition-all duration-200 hover:scale-105"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {/* Search Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Tìm kiếm phim
            </DialogTitle>
            <DialogDescription>
              Nhập tên phim bạn muốn tìm kiếm hoặc chọn từ các tìm kiếm phổ biến
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 pt-0">
            <input
              type="text"
              placeholder="Nhập tên phim bạn muốn tìm..."
              className="w-full h-12 text-base px-4 py-2 rounded border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          <div className="px-6 pb-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Search className="w-8 h-8 animate-spin text-muted-foreground mr-2" />
                <span className="text-muted-foreground">Đang tìm kiếm...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <ul className="divide-y divide-border rounded-lg bg-background shadow">
                {searchResults.slice(0, 8).map((movie: any) => (
                  <li
                    key={movie.slug}
                    className="flex items-center gap-4 p-3 hover:bg-accent cursor-pointer transition"
                    onClick={() => handleMovieSelect(movie.slug)}
                  >
                    <div className="relative w-12 h-16 flex-shrink-0">
                      <Image
                        src={getImageUrl(movie)}
                        alt={movie.name}
                        fill
                        className="rounded object-cover"
                        sizes="48px"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-movie.jpg";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{movie.name}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {movie.year} • {movie.episode_current}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="w-8 h-8 mx-auto mb-2" />
                Không tìm thấy kết quả
              </div>
            )}

            {/* Trending search */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="font-semibold">Tìm kiếm phổ biến</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="px-3 py-1 rounded-full bg-accent text-sm hover:bg-primary/80 hover:text-white transition"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingSearch;
