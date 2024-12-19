import { getMovieDetail } from "@/actions";
import EpisodeList from "@/components/EpisodeList";
import MovieInfo from "@/components/MovieInfo";
import { notFound } from "next/navigation";
import React from "react";

async function MovieDetail({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const res = await getMovieDetail(slug);
  const data = res?.data;

  if (!data) return notFound();

  return (
    <main className="space-y-8 py-6 container mx-auto px-4 min-h-screen">
      <MovieInfo movie={data.item} />
      {data.item.episodes.length > 0 && (
        <EpisodeList episodes={data.item.episodes} />
      )}
    </main>
  );
}

export default MovieDetail;
