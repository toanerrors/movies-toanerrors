"use client";

import { useCountryMovies } from "@/hooks/useData";
import { MovieCard } from "@/components/MovieCard";
import { Pagination } from "@/components/Pagination";
import { useParams, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const CDN = "https://img.ophim.live";

function CountryContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const currentPage = Number(searchParams.get("page")) || 1;

  const { data, isLoading, error } = useCountryMovies(slug, currentPage);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-6 space-y-8">
          {/* Title skeleton */}
          <div className="text-center space-y-4">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-5 w-48 mx-auto" />
          </div>

          {/* Movies grid skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 24 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-0">
                  <Skeleton className="aspect-[2/3] w-full rounded-t-lg" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination skeleton */}
          <div className="flex justify-center">
            <Skeleton className="h-10 w-80" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold text-muted-foreground">
            Không thể tải dữ liệu quốc gia
          </div>
          <p className="text-muted-foreground">Vui lòng thử lại sau</p>
        </div>
      </main>
    );
  }

  const { movies, pagination } = data;
  const totalItems = pagination?.totalItems || 0;
  const totalItemsPerPage = pagination?.totalItemsPerPage || 24;

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-top duration-500">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Quốc gia: {decodeURIComponent(slug)}
          </h1>
          <p className="text-muted-foreground">
            Khám phá các bộ phim từ quốc gia này
          </p>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map((movie, index) => (
            <div
              key={movie._id}
              className="animate-in fade-in zoom-in duration-500"
              style={{ animationDelay: `${index * 20}ms` }}
            >
              <MovieCard movie={movie} cdnUrl={CDN} />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-4 sm:mt-8 flex justify-center animate-in fade-in slide-in-from-bottom duration-500 delay-300">
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={totalItemsPerPage}
          />
        </div>
      </div>
    </main>
  );
}

export default function Country() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
      }
    >
      <CountryContent />
    </Suspense>
  );
}
