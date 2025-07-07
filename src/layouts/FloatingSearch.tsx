"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ModeToggle } from "./mode-toggle";
import { useSearchMovies } from "@/hooks/useSearch";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

        {/* Theme Toggle */}
        <div className="bg-background/80 backdrop-blur-sm rounded-full p-1 shadow-lg border transition-all duration-200 hover:scale-105">
          <ModeToggle />
        </div>
      </div>

      {/* Floating Banner */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-40 md:left-64 md:transform-none animate-in slide-in-from-top-4 duration-500">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm border border-border/50 rounded-full px-4 py-2 flex items-center gap-2 shadow-lg transition-all duration-200 hover:scale-105">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium hidden sm:inline">
            Khám phá hàng ngàn bộ phim chất lượng cao
          </span>
          <span className="text-sm font-medium sm:hidden">
            Xem phim miễn phí
          </span>
        </div>
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

          <Command className="rounded-none border-none">
            <CommandInput
              placeholder="Nhập tên phim bạn muốn tìm..."
              className="h-12 text-base"
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList className="max-h-[400px]">
              <CommandEmpty>
                <div className="text-center py-6">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {isLoading ? "Đang tìm kiếm..." : "Không tìm thấy kết quả"}
                  </p>
                </div>
              </CommandEmpty>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <CommandGroup heading="Kết quả tìm kiếm">
                  {searchResults.slice(0, 5).map((movie: any) => (
                    <CommandItem
                      key={movie.slug}
                      onSelect={() => handleMovieSelect(movie.slug)}
                      className="cursor-pointer py-3"
                    >
                      <div className="relative w-8 h-8 mr-3 flex-shrink-0">
                        <Image
                          src={
                            movie.thumb_url ||
                            movie.poster_url ||
                            "/placeholder-movie.jpg"
                          }
                          alt={movie.name}
                          fill
                          className="rounded object-cover"
                          sizes="32px"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-movie.jpg";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{movie.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {movie.year} • {movie.episode_current}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              <CommandGroup
                heading={
                  <div className="flex items-center gap-2 py-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Tìm kiếm phổ biến</span>
                  </div>
                }
              >
                {trendingSearches.map((term) => (
                  <CommandItem
                    key={term}
                    onSelect={() => handleSearch(term)}
                    className="cursor-pointer py-3"
                  >
                    <Search className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>{term}</span>
                    <Badge variant="secondary" className="ml-auto">
                      Phổ biến
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingSearch;
