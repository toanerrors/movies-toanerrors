import { getCountryMovies } from "@/actions/countryActions";
import { MovieCard } from "@/components/MovieCard";
import { Pagination } from "@/components/Pagination";
import React from "react";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function Country({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const data = await getCountryMovies(slug, currentPage);
  const movies = data?.data?.items || [];
  const CDN = data?.data?.APP_DOMAIN_CDN_IMAGE || "";
  const { totalItems, totalItemsPerPage } =
    data?.data?.params?.pagination || {};

  return (
    <main className="container mx-auto py-4 sm:py-6 px-2 sm:px-4">
      <div className="flex justify-between items-center mb-2 sm:mb-4">
        <h1 className="text-lg sm:text-xl font-bold">Phim theo quốc gia</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} cdnUrl={CDN} />
        ))}
      </div>

      <div className="mt-4 sm:mt-8 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems || 0}
          itemsPerPage={totalItemsPerPage || 0}
        />
      </div>
    </main>
  );
}

export default Country;
