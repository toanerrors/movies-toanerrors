"use client";

import { useMovieDetail } from "@/hooks/useData";
import EpisodeList from "@/components/EpisodeList";
import MovieInfo from "@/components/MovieInfo";
import { notFound, useParams } from "next/navigation";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

function MovieDetailContent() {
  const params = useParams();
  const slug = params.slug as string;
  
  const { data: movie, isLoading, error } = useMovieDetail(slug);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-6 space-y-8 max-w-7xl">
          {/* Movie Info Skeleton */}
          <Card>
            <CardContent className="p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Poster skeleton */}
                <div className="flex-shrink-0 mx-auto lg:mx-0">
                  <Skeleton className="w-64 lg:w-80 aspect-[2/3] rounded-2xl" />
                </div>

                {/* Details skeleton */}
                <div className="flex-1 space-y-6">
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <div className="flex flex-wrap gap-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-5 w-20" />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <Skeleton className="h-6 w-32" />
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Episode List Skeleton */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-7 w-48" />
                  <Skeleton className="h-6 w-16" />
                </div>

                <div className="flex gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-24" />
                  ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (error || !movie) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 space-y-8 max-w-7xl">
        <MovieInfo movie={movie} />
        {movie.episodes.length > 0 && (
          <EpisodeList episodes={movie.episodes} movieSlug={slug} />
        )}
      </div>
    </main>
  );
}

export default function MovieDetail() {
  return <MovieDetailContent />;
}
