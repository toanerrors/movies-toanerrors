import axiosClient from "@/lib/axiosClient";
import { Movie, PaginatedResponse } from "@/types/common";

type ListType =
  | "phim-bo"
  | "phim-le"
  | "hoat-hinh"
  | "tv-shows"
  | "phim-vietsub"
  | "phim-thuyet-minh"
  | "phim-long-tieng"
  | "phim-bo-dang-chieu"
  | "phim-bo-hoan-thanh"
  | "phim-sap-chieu"
  | "subteam";

export const getMoviesList = async (type: ListType, page: number = 1) => {
  try {
    const response = await axiosClient.get<PaginatedResponse<Movie>>(
      `/v1/api/danh-sach/${type}`,
      {
        params: { page },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching movies list:", error);
    return null;
  }
};
