import { getMovieDetail } from "@/actions";
import EpisodeList from "@/components/EpisodeList";
import MovieInfo from "@/components/MovieInfo";
import { notFound } from "next/navigation";
import React from "react";

type Props = {
  params: Promise<{ slug: string }>;
};

async function MovieDetail({ params }: Props) {
  const { slug } = await params;
  const res = await getMovieDetail(slug);
  const data = res?.data;

  if (!data) return notFound();

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 space-y-8 max-w-7xl">
        <MovieInfo movie={data.item} />
        {data.item.episodes.length > 0 && (
          <EpisodeList episodes={data.item.episodes} movieSlug={slug} />
        )}
      </div>
    </main>
  );
}

export default MovieDetail;
