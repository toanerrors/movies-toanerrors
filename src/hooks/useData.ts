"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getCountries,
  getHomeData,
  getMovieDetail,
  getCategoryMovies,
  getCountryMovies,
} from "@/actions";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    select: (data) => data?.data?.items || [],
  });
};

export const useCountries = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
    select: (data) => data?.data?.items || [],
  });
};

export const useHomeData = (page: number = 1) => {
  return useQuery({
    queryKey: ["home", page],
    queryFn: () => getHomeData(page),
    select: (data) => data?.data || null,
  });
};

export const useMovieDetail = (slug: string) => {
  return useQuery({
    queryKey: ["movie", slug],
    queryFn: () => getMovieDetail(slug),
    select: (data) => data?.data?.item || null,
    enabled: !!slug,
  });
};

export const useCategoryMovies = (slug: string, page: number = 1) => {
  return useQuery({
    queryKey: ["category", slug, page],
    queryFn: () => getCategoryMovies(slug, page),
    select: (data) => ({
      movies: data?.data?.items || [],
      pagination: data?.data?.params?.pagination || null,
    }),
    enabled: !!slug,
  });
};

export const useCountryMovies = (slug: string, page: number = 1) => {
  return useQuery({
    queryKey: ["country", slug, page],
    queryFn: () => getCountryMovies(slug, page),
    select: (data) => ({
      movies: data?.data?.items || [],
      pagination: data?.data?.params?.pagination || null,
    }),
    enabled: !!slug,
  });
};
