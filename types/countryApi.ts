// Type definitions for /v1/api/quoc-gia response

export interface CountryItem {
  _id: string;
  name: string;
  slug: string;
}

export interface CountryApiData {
  items: CountryItem[];
}

export interface CountryApiResponse {
  status: string;
  message: string;
  data: CountryApiData;
}
