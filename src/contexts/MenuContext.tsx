"use client";
import { Category, Country } from "@/types/common";
import React, { createContext, useContext } from "react";

interface MenuContextType {
  categories: Category[];
  countries: Country[];
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({
  children,
  categories,
  countries,
}: {
  children: React.ReactNode;
  categories: Category[];
  countries: Country[];
}) {
  return (
    <MenuContext.Provider value={{ categories, countries }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
}
