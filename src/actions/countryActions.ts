import axiosClient from "@/lib/axiosClient";
import { Country, Movie, PaginatedResponse } from "@/types/common";

export const getCountries = async () => {
  const response = await axiosClient.get<PaginatedResponse<Country>>(
    "/v1/api/quoc-gia"
  );
  return response.data;
};

export const getCountryMovies = async (slug: string, page: number = 1) => {
  const response = await axiosClient.get<PaginatedResponse<Movie>>(
    `/v1/api/quoc-gia/${slug}`,
    {
      params: { page },
    }
  );
  return response.data;
};
