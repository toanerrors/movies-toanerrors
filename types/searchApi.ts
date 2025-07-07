// Type definitions for /v1/api/tim-kiem response

export interface SearchSeoOnPage {
  og_type: string;
  titleHead: string;
  descriptionHead: string;
  og_image: string[];
  og_url: string;
}

export interface SearchBreadCrumb {
  name: string;
  isCurrent: boolean;
  position: number;
}

export interface SearchCategory {
  id: string;
  name: string;
  slug: string;
}

export interface SearchCountry {
  id: string;
  name: string;
  slug: string;
}

export interface SearchTmdbInfo {
  type: string | null;
  id: string | null;
  season: number | null;
  vote_average: number | null;
  vote_count: number | null;
}

export interface SearchImdbInfo {
  id: string | null;
  vote_average: number | null;
  vote_count: number | null;
}

export interface SearchMovieItem {
  name: string;
  origin_name: string;
  slug: string;
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
  category: SearchCategory[];
  country: SearchCountry[];
  tmdb: SearchTmdbInfo;
  imdb: SearchImdbInfo;
  modified: { user_id: string; user_name: string; time: string };
  _id: string;
}

export interface SearchParams {
  type_slug: string;
  keyword: string;
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

export interface SearchApiData {
  seoOnPage: SearchSeoOnPage;
  breadCrumb: SearchBreadCrumb[];
  titlePage: string;
  items: SearchMovieItem[];
  params: SearchParams;
  type_list: string;
  APP_DOMAIN_FRONTEND: string;
  APP_DOMAIN_CDN_IMAGE: string;
}

export interface SearchApiResponse {
  status: string;
  message: string;
  data: SearchApiData;
}
