// Type definitions for /v1/api/the-loai response

export interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
}

export interface CategoryApiData {
  items: CategoryItem[];
}

export interface CategoryApiResponse {
  status: string;
  message: string;
  data: CategoryApiData;
}
