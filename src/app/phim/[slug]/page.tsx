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
  // OK
  return (
    <main className="space-y-8 py-6 container mx-auto px-4 min-h-screen">
      <MovieInfo movie={data.item} />
      {data.item.episodes.length > 0 && (
        <EpisodeList episodes={data.item.episodes} movieSlug={slug} />
      )}
    </main>
  );
}

export default MovieDetail;
