"use client";
import React from "react";
import Header from "./header";
import { Category, Country } from "@/types/common";
import { MenuProvider } from "@/contexts/MenuContext";

type LayoutsProps = {
  children: React.ReactNode;
  categories: Category[];
  countries: Country[];
};

function Layouts({ children, categories, countries }: LayoutsProps) {
  return (
    <MenuProvider categories={categories} countries={countries}>
      <Header />
      {children}
    </MenuProvider>
  );
}

export default Layouts;
