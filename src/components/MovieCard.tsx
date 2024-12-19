import { Movie } from "@/types/common";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface MovieCardProps {
  movie: Movie;
  cdnUrl: string;
}

export function MovieCard({ movie, cdnUrl }: MovieCardProps) {
  return (
    <Link href={`/phim/${movie.slug}`}>
      <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            src={`${cdnUrl}/uploads/movies/${movie.thumb_url}`}
            alt={movie.name}
          />
          <div className="absolute top-1 sm:top-2 right-1 sm:right-2 flex gap-1 sm:gap-2">
            <Badge className="bg-black/60 hover:bg-black/70 text-[10px] sm:text-xs px-1 sm:px-2">
              {movie.quality}
            </Badge>
            <Badge className="bg-primary/60 hover:bg-primary/70 text-[10px] sm:text-xs px-1 sm:px-2">
              {movie.lang}
            </Badge>
          </div>

          {movie.type === "series" && (
            <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2">
              <Badge
                variant="destructive"
                className="bg-red-500/80 text-[10px] sm:text-xs px-1 sm:px-2"
              >
                {movie.episode_current}
              </Badge>
            </div>
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        </div>

        <CardContent className="p-2 sm:p-4">
          <h2 className="font-semibold text-sm sm:text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {movie.name}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
            {movie.original_name}
          </p>

          <div className="flex gap-1 sm:gap-2 mt-1 sm:mt-2 flex-wrap">
            <Badge
              variant="outline"
              className="bg-background/60 text-[10px] sm:text-xs px-1 sm:px-2"
            >
              {movie.year}
            </Badge>
            <Badge
              variant="outline"
              className="bg-background/60 text-[10px] sm:text-xs px-1 sm:px-2"
            >
              {movie.time}
            </Badge>
          </div>

          <div className="flex gap-1 mt-1 sm:mt-2 flex-wrap">
            {movie.country.map((country) => (
              <Badge
                key={country.slug}
                variant="secondary"
                className="text-[10px] sm:text-xs bg-muted hover:bg-muted/80 px-1 sm:px-2"
              >
                {country.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
