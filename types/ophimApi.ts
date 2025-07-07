// Tổng hợp type cho toàn bộ API OPhim

// --- Common ---
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

export interface BreadCrumb {
  name: string;
  slug?: string;
  isCurrent?: boolean;
  position: number;
}

// --- SEO ---
export interface SeoSchema {
  "@context": string;
  "@type": string;
  name: string;
  dateModified: string;
  dateCreated: string;
  url: string;
  datePublished: string;
  image: string;
  director: string;
}

export interface SeoOnPage {
  og_type: string;
  titleHead: string;
  descriptionHead: string;
  og_image: string[];
  og_url: string;
  seoSchema?: SeoSchema;
  updated_time?: number;
}

// --- Movie Item (dùng cho list/search/category) ---
export interface TmdbInfo {
  type: string | null;
  id: string | null;
  season: number | null;
  vote_average: number | null;
  vote_count: number | null;
}

export interface ImdbInfo {
  id: string | null;
  vote_average: number | null;
  vote_count: number | null;
}

export interface MovieItem {
  tmdb: TmdbInfo;
  imdb: ImdbInfo;
  modified:
    | { time: string }
    | { user_id: string; user_name: string; time: string };
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
  category: Category[];
  country: Country[];
}

// --- Movie Detail ---
export interface Episode {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

export interface ServerEpisode {
  server_name: string;
  server_data: Episode[];
}

export interface MovieDetailItem extends MovieItem {
  created: { time: string };
  content: string;
  status: string;
  is_copyright: boolean;
  trailer_url: string;
  episode_total: string;
  notify: string;
  showtimes: string;
  view: number;
  actor: string[];
  director: string[];
  episodes: ServerEpisode[];
}

// --- Params chung cho list/search/category ---
export interface Pagination {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  pageRanges: number;
}

export interface ListParams {
  type_slug: string;
  slug?: string;
  keyword?: string;
  filterCategory: string[];
  filterCountry: string[];
  filterYear: string;
  filterType?: string;
  sortField: string;
  sortType?: string;
  pagination: Pagination;
}

// --- Response ---
export interface ListApiResponse {
  status: string;
  message: string;
  data: {
    seoOnPage: SeoOnPage;
    breadCrumb?: BreadCrumb[];
    titlePage?: string;
    items: MovieItem[];
    params: ListParams;
    type_list?: string;
    APP_DOMAIN_FRONTEND?: string;
    APP_DOMAIN_CDN_IMAGE?: string;
  };
}

export interface MovieDetailApiResponse {
  status: string;
  message: string;
  data: {
    seoOnPage: SeoOnPage;
    breadCrumb: BreadCrumb[];
    params: { slug: string };
    item: MovieDetailItem;
    APP_DOMAIN_CDN_IMAGE: string;
  };
}

export interface CategoryApiResponse {
  status: string;
  message: string;
  data: { items: Category[] };
}

export interface CountryApiResponse {
  status: string;
  message: string;
  data: { items: Country[] };
}

export interface SearchApiResponse {
  status: string;
  message: string;
  data: {
    seoOnPage: SeoOnPage;
    breadCrumb: BreadCrumb[];
    titlePage: string;
    items: MovieItem[];
    params: ListParams;
    type_list: string;
    APP_DOMAIN_FRONTEND: string;
    APP_DOMAIN_CDN_IMAGE: string;
  };
}
