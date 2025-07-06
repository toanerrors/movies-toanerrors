import { getHomeData } from "@/actions/homeActions";
import { MovieCard } from "@/components/MovieCard";
import { Pagination } from "@/components/Pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  TrendingUp,
  Star,
  Clock,
  Film,
  Tv,
  Eye,
  ArrowRight,
  Sparkles,
  PlayCircle,
  Calendar,
} from "lucide-react";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const data = await getHomeData(currentPage);

  const movies = data?.data?.items || [];
  const CDN = data?.data?.APP_DOMAIN_CDN_IMAGE || "";
  const { totalItems, totalItemsPerPage } =
    data?.data?.params?.pagination || {};

  // Sample data for enhanced sections (replace with real data)
  const featuredMovies = movies.slice(0, 8);
  const trendingMovies = movies.slice(8, 16);
  const recentMovies = movies.slice(16, 24);

  const stats = [
    {
      label: "Tổng phim",
      value: "10,000+",
      icon: Film,
      color: "text-blue-500",
    },
    { label: "Phim bộ", value: "5,000+", icon: Tv, color: "text-green-500" },
    { label: "Lượt xem", value: "1M+", icon: Eye, color: "text-purple-500" },
    { label: "Đánh giá", value: "4.8/5", icon: Star, color: "text-yellow-500" },
  ];

  const movieSections = [
    {
      title: "Phim nổi bật",
      description: "Những bộ phim được yêu thích nhất",
      icon: Star,
      movies: featuredMovies,
      gradient: "from-yellow-500/20 to-orange-500/20",
      badge: { text: "VIP", variant: "default" as const },
    },
    {
      title: "Thịnh hành",
      description: "Phim đang được xem nhiều nhất",
      icon: TrendingUp,
      movies: trendingMovies,
      gradient: "from-red-500/20 to-pink-500/20",
      badge: { text: "Hot", variant: "destructive" as const },
    },
    {
      title: "Mới cập nhật",
      description: "Phim mới được thêm gần đây",
      icon: Clock,
      movies: recentMovies,
      gradient: "from-blue-500/20 to-cyan-500/20",
      badge: { text: "New", variant: "secondary" as const },
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
            {/* Hero Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary px-6 py-3 rounded-full text-sm font-medium border border-primary/20 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
              <Sparkles className="w-4 h-4" />
              Xem phim online miễn phí - Chất lượng HD
              <Badge variant="outline" className="ml-2">
                New
              </Badge>
            </div>
            {/* Hero Title */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
                Khám phá thế giới
                <br />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  điện ảnh
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Hàng ngàn bộ phim chất lượng cao, cập nhật mới nhất từ khắp nơi
                trên thế giới. Trải nghiệm xem phim tuyệt vời với giao diện hiện
                đại và tính năng thông minh.
              </p>
            </div>
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom duration-700 delay-200">
              <Button size="lg" className="gap-2 px-8 py-6 text-lg">
                <PlayCircle className="w-5 h-5" />
                Bắt đầu xem ngay
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 px-8 py-6 text-lg"
              >
                <Calendar className="w-5 h-5" />
                Lịch phát sóng
              </Button>
            </div>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 animate-in fade-in zoom-in duration-700 delay-300">
              {stats.map((stat) => (
                <Card
                  key={stat.label}
                  className="bg-background/60 backdrop-blur-sm border-border/50 hover:bg-background/80 transition-all duration-300 hover:scale-105"
                >
                  <CardContent className="p-6 text-center">
                    <stat.icon
                      className={`w-8 h-8 mx-auto mb-3 ${stat.color}`}
                    />
                    <div className="text-2xl md:text-3xl font-bold">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Separator className="my-8" />
      {/* Movie Sections */}
      {movieSections.map((section, sectionIndex) => (
        <section
          key={section.title}
          className={`py-12 ${sectionIndex % 2 === 1 ? "bg-muted/20" : ""}`}
        >
          <div className="container mx-auto px-4">
            <div className="mb-8 animate-in fade-in slide-in-from-bottom duration-700">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-r ${section.gradient}`}
                    >
                      <section.icon className="w-6 h-6" />
                    </div>
                    {section.title}
                    <Badge variant={section.badge.variant} className="ml-2">
                      {section.badge.text}
                    </Badge>
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    {section.description}
                  </p>
                </div>
                <Button variant="outline" className="gap-2 shrink-0">
                  Xem tất cả
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {/* Horizontal Scroll for Featured Movies */}
            {section.title === "Phim nổi bật" ? (
              <ScrollArea className="w-full whitespace-nowrap rounded-lg">
                <div className="flex w-max space-x-4 p-4">
                  {section.movies.map((movie, index) => (
                    <div
                      key={movie._id}
                      className="w-48 flex-none animate-in fade-in slide-in-from-right duration-500"
                      style={{
                        animationDelay: `${sectionIndex * 0.2 + index * 0.1}s`,
                      }}
                    >
                      <MovieCard movie={movie} cdnUrl={CDN} />
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            ) : (
              /* Grid for other sections */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {section.movies.map((movie, index) => (
                  <div
                    key={movie._id}
                    className="animate-in fade-in zoom-in duration-500"
                    style={{
                      animationDelay: `${sectionIndex * 0.2 + index * 0.05}s`,
                    }}
                  >
                    <MovieCard movie={movie} cdnUrl={CDN} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}
      {/* All Movies Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center space-y-4 animate-in fade-in slide-in-from-bottom duration-700">
            <h2 className="text-3xl md:text-4xl font-bold">Tất cả phim</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Khám phá toàn bộ thư viện phim của chúng tôi với hàng ngàn bộ phim
              chất lượng cao
            </p>
          </div>
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
