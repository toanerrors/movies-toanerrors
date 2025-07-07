// Type definitions for /v1/api/home response

export interface SeoOnPage {
  titleHead: string;
  descriptionHead: string;
  og_type: string;
  og_image: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Country {
  id: string;
  name: string;
  slug: string;
}

export interface TmdbInfo {
  type: string;
  id: string;
  season: number | null;
  vote_average: number;
  vote_count: number;
}

export interface ImdbInfo {
  id: string;
  vote_average: number;
  vote_count: number;
}

export interface MovieItem {
  tmdb: TmdbInfo;
  imdb: ImdbInfo;
  modified: { time: string };
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  type: string;
  thumb_url: string;
  sub_docquyen: boolean;
  time: string;
  episode_current: string;
  quality: string;
  lang: string;
  year: number;
  category: Category[];
  country: Country[];
}

export interface Params {
  type_slug: string;
  filterCategory: any[];
  filterCountry: any[];
  filterYear: string;
  sortField: string;
  pagination: {
    totalItems: number;
    totalItemsPerPage: number;
    currentPage: number;
    pageRanges: number;
  };
  itemsUpdateInDay: number;
  totalSportsVideos: number;
  itemsSportsVideosUpdateInDay: number;
}

export interface HomeApiData {
  seoOnPage: SeoOnPage;
  items: MovieItem[];
  itemsSportsVideos: any[];
  params: Params;
  type_list: string;
  APP_DOMAIN_FRONTEND: string;
  APP_DOMAIN_CDN_IMAGE: string;
}

export interface HomeApiResponse {
  status: string;
  message: string;
  data: HomeApiData;
}
