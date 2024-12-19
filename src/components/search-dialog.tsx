"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { searchMovies } from "@/actions/searchActions";
import { Movie } from "@/types/common";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Movie[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const CDN = "https://img.ophim.live/uploads/movies/";

  React.useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  React.useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const data = await searchMovies(query);
        setResults(data?.data?.items || []);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleMovieClick = (slug: string) => {
    router.push(`/phim/${slug}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle></DialogTitle>
      <DialogContent className="sm:max-w-3xl p-0 gap-0">
        <div className="p-4 border-b mt-6 ">
          <Input
            ref={inputRef}
            placeholder="Tìm kiếm phim..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full "
          />
        </div>
        <div className="max-h-[60vh] h-[60vh] overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : results.length > 0 ? (
            <div className="grid gap-2">
              {results.map((movie) => (
                <div
                  key={movie.slug}
                  className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => handleMovieClick(movie.slug)}
                >
                  <div className="relative h-20 w-14 flex-shrink-0">
                    <Image
                      src={`${CDN}${movie.thumb_url}`}
                      alt={movie.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-medium">{movie.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {movie.original_name} ({movie.year})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : query ? (
            <div className="text-center p-8 text-muted-foreground">
              Không tìm thấy kết quả
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
