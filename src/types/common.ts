export type TypeMovie = "single" | "series" | "hoathinh";

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Country {
  _id: string;
  name: string;
  slug: string;
}

export interface Movie {
  modified: {
    time: Date;
  };
  _id: string;
  name: string;
  slug: string;
  original_name: string;
  type: TypeMovie;
  thumb_url: string;
  poster_url: string;
  chieurap: boolean;
  sub_docquyen: boolean;
  time: string;
  episode_current: string;
  quality: string;
  lang: string;
  year: number;
  category: Category[];
  country: Country[];
}

export interface PaginatedResponse<T> {
  status: "success" | "error";
  message?: string;
  data: {
    items?: T[];
    params?: {
      type_slug: string;
      pagination: {
        totalItems: number;
        totalItemsPerPage: number;
        currentPage: number;
        pageRanges: number;
      };
    };
    APP_DOMAIN_CDN_IMAGE?: string;
  };
}

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

export interface SeoSchema {
  "@context": string;
  "@type": string;
  name: string;
  dateModified: string;
  dateCreated: string;
  datePublished: string;
  url: string;
  image: string;
  director: string;
}

export interface SeoOnPage {
  titleHead: string;
  descriptionHead: string;
  og_type: string;
  og_image: string[];
  updated_time: number;
  og_url: string;
  seoSchema: SeoSchema;
}

export interface BreadCrumb {
  name: string;
  slug?: string;
  position: number;
  isCurrent?: boolean;
}

export interface MovieDetail extends Movie {
  content: string;
  status: "completed" | "ongoing" | "trailer";
  is_copyright: boolean;
  trailer_url?: string;
  episode_total: string;
  view: number;
  actor: string[];
  director: string[];
  episodes: ServerEpisode[];
  notify?: string;
  showtimes?: string;
  tmdb?: {
    type: string | null;
    id: string;
    season: number | null;
    vote_average: number;
    vote_count: number;
  };
  imdb?: {
    id: string;
  };
  created: {
    time: string;
  };
}

export interface MovieDetailResponse {
  status: "success" | "error";
  message: string;
  data: {
    seoOnPage: SeoOnPage;
    breadCrumb: BreadCrumb[];
    params: {
      slug: string;
    };
    item: MovieDetail;
  };
}

export interface WatchHistoryItem {
  movieSlug: string;
  episodeSlug: string;
  timestamp: number;
  lastWatched: number;
  serverName: string;
}
