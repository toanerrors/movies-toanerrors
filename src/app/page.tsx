"use client";

import { useHomeData } from "@/hooks/useData";
import { MovieCard } from "@/components/MovieCard";
import { Pagination } from "@/components/Pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const CDN = "https://img.ophim.live";

function HomeContent() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const { data: homeData, isLoading } = useHomeData(currentPage);

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Movies Grid Skeleton */}
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
        </div>
      </main>
    );
  }

  if (!homeData) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold text-muted-foreground">
            Không thể tải dữ liệu
          </div>
          <p className="text-muted-foreground">Vui lòng thử lại sau</p>
        </div>
      </main>
    );
  }

  const movies = homeData.items || [];
  const totalItems = homeData.params?.pagination?.totalItems || 0;
  const totalItemsPerPage =
    homeData.params?.pagination?.totalItemsPerPage || 24;

  return (
    <main className="min-h-screen">
      <section className="py-16 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom duration-700">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tất cả phim mới cập nhật
            </h2>
            <p className="text-muted-foreground text-lg">
              Khám phá toàn bộ thư viện phim của chúng tôi
            </p>
          </div>

          {/* All Movies Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie, index) => (
              <div
                key={movie._id}
                className="animate-in fade-in zoom-in duration-500"
                style={{ animationDelay: `${index * 0.02}s` }}
              >
                <MovieCard movie={movie} cdnUrl={CDN} />
              </div>
            ))}
          </div>
          {/* Pagination */}
          <div className="mt-16 flex justify-center animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            <Card className="bg-background/60 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <Pagination
                  currentPage={currentPage}
                  totalItems={totalItems || 0}
                  itemsPerPage={totalItemsPerPage || 0}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
