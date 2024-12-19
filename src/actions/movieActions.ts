import axiosClient from "@/lib/axiosClient";
import { MovieDetailResponse } from "@/types/common";

export const getMovieDetail = async (slug: string) => {
  const response = await axiosClient.get<MovieDetailResponse>(
    `/v1/api/phim/${slug}`
  );
  return response.data;
};
