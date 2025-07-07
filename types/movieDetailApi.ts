// Type definitions for /v1/api/phim/[slug] response

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
  seoSchema: SeoSchema;
  descriptionHead: string;
  og_image: string[];
  updated_time: number;
  og_url: string;
}

export interface BreadCrumb {
  name: string;
  slug?: string;
  isCurrent?: boolean;
  position: number;
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

export interface MovieDetailItem {
  tmdb: {
    type: string;
    id: string;
    season: number | null;
    vote_average: number;
    vote_count: number;
  };
  imdb: {
    id: string;
    vote_average: number;
    vote_count: number;
  };
  created: { time: string };
  modified: { time: string };
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  content: string;
  type: string;
  status: string;
  thumb_url: string;
  poster_url: string;
  is_copyright: boolean;
  sub_docquyen: boolean;
  chieurap: boolean;
  trailer_url: string;
  time: string;
  episode_current: string;
  episode_total: string;
  quality: string;
  lang: string;
  notify: string;
  showtimes: string;
  year: number;
  view: number;
  actor: string[];
  director: string[];
  category: Category[];
  country: Country[];
  episodes: ServerEpisode[];
}

export interface MovieDetailApiData {
  seoOnPage: SeoOnPage;
  breadCrumb: BreadCrumb[];
  params: { slug: string };
  item: MovieDetailItem;
  APP_DOMAIN_CDN_IMAGE: string;
}

export interface MovieDetailApiResponse {
  status: string;
  message: string;
  data: MovieDetailApiData;
}
