import axiosClient from "@/lib/axiosClient";
import { Movie, PaginatedResponse } from "@/types/common";

export const getHomeData = async (page: number = 1) => {
  const response = await axiosClient.get<PaginatedResponse<Movie>>(
    `/v1/api/danh-sach/phim-moi-cap-nhat?page=${page}`
  );
  return response.data;
};