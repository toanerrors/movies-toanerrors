import axiosClient from "@/lib/axiosClient";
import { Category, Movie, PaginatedResponse } from "@/types/common";

export const getCategories = async () => {
  try {
    const response = await axiosClient.get<PaginatedResponse<Category>>(
      "/v1/api/the-loai"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null;
  }
};

export const getCategoryMovies = async (slug: string, page: number = 1) => {
  try {
    const response = await axiosClient.get<PaginatedResponse<Movie>>(
      `/v1/api/the-loai/${slug}`,
      {
        params: { page },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching category movies:", error);
    return null;
  }
};
