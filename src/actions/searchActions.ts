import axiosClient from "@/lib/axiosClient";
import { Movie } from "@/types/common";

export interface OphimSearchResponse {
  status: string;
  message: string;
  data: {
    seoOnPage?: any;
    breadCrumb?: any;
    titlePage?: string;
    items: Movie[];
  };
}

export const searchMovies = async (
  keyword: string,
  page: number = 1
): Promise<OphimSearchResponse | null> => {
  try {
    const response = await axiosClient.get<OphimSearchResponse>(
      "/v1/api/tim-kiem",
      {
        params: { keyword, page },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error searching movies:", error);
    return null;
  }
};
