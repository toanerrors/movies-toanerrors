import axiosClient from "@/lib/axiosClient";
import { MovieDetailResponse } from "@/types/common";

export const getMovieDetail = async (slug: string) => {
  try {
    const response = await axiosClient.get<MovieDetailResponse>(
      `/v1/api/phim/${slug}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching movie detail:", error);
    return null;
  }
};
