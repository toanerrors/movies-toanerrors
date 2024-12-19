import axiosClient from "@/lib/axiosClient";
import { Movie, PaginatedResponse } from "@/types/common";

export const searchMovies = async (keyword: string, page: number = 1) => {
  const response = await axiosClient.get<PaginatedResponse<Movie>>(
    "/v1/api/tim-kiem",
    {
      params: { keyword, page },
    }
  );
  return response.data;
};
