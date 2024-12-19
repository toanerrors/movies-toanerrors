import axiosClient from "@/lib/axiosClient";
import { Category, Movie, PaginatedResponse } from "@/types/common";

export const getCategories = async () => {
  const response = await axiosClient.get<PaginatedResponse<Category>>(
    "/v1/api/the-loai"
  );
  return response.data;
};

export const getCategoryMovies = async (slug: string, page: number = 1) => {
  const response = await axiosClient.get<PaginatedResponse<Movie>>(
    `/v1/api/the-loai/${slug}`,
    {
      params: { page },
    }
  );
  return response.data;
};
