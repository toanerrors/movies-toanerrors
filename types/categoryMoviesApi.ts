// Type definitions for /v1/api/the-loai/[slug] response

export interface CategoryMoviesSeoOnPage {
  og_type: string;
  titleHead: string;
  descriptionHead: string;
  og_image: string[];
  og_url: string;
}

export interface CategoryMoviesBreadCrumb {
  name: string;
  slug?: string;
  isCurrent?: boolean;
  position: number;
}

export interface CategoryMoviesCategory {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryMoviesCountry {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryMoviesTmdbInfo {
  type: string | null;
  id: string | null;
  season: number | null;
  vote_average: number | null;
  vote_count: number | null;
}

export interface CategoryMoviesImdbInfo {
  id: string | null;
  vote_average: number | null;
  vote_count: number | null;
}

export interface CategoryMoviesItem {
  tmdb: CategoryMoviesTmdbInfo;
  imdb: CategoryMoviesImdbInfo;
  modified: { time: string };
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  type: string;
  thumb_url: string;
  poster_url: string;
  sub_docquyen: boolean;
  chieurap: boolean;
  time: string;
  episode_current: string;
  quality: string;
  lang: string;
  year: number;
  category: CategoryMoviesCategory[];
  country: CategoryMoviesCountry[];
}

export interface CategoryMoviesParams {
  type_slug: string;
  slug: string;
  filterCategory: string[];
  filterCountry: string[];
  filterYear: string;
  filterType: string;
  sortField: string;
  sortType: string;
  pagination: {
    totalItems: number;
    totalItemsPerPage: number;
    currentPage: number;
    pageRanges: number;
  };
}

export interface CategoryMoviesApiData {
  seoOnPage: CategoryMoviesSeoOnPage;
  breadCrumb: CategoryMoviesBreadCrumb[];
  titlePage: string;
  items: CategoryMoviesItem[];
  params: CategoryMoviesParams;
  type_list: string;
  APP_DOMAIN_FRONTEND: string;
  APP_DOMAIN_CDN_IMAGE: string;
}

export interface CategoryMoviesApiResponse {
  status: string;
  message: string;
  data: CategoryMoviesApiData;
}
