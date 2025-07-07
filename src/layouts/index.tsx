"use client";
import React from "react";
import { MenuProvider } from "@/contexts/MenuContext";
import SidebarNav from "./SidebarNav";
import BottomNav from "./BottomNav";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import FloatingSearch from "./FloatingSearch";
import { useCategories, useCountries } from "@/hooks/useData";

type LayoutsProps = {
  children: React.ReactNode;
};

function Layouts({ children }: LayoutsProps) {
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const { data: countries = [], isLoading: countriesLoading } = useCountries();

  // Show loading state while data is being fetched
  if (categoriesLoading || countriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <MenuProvider categories={categories} countries={countries}>
      <SidebarProvider>
        {/* Desktop Sidebar */}
        <SidebarNav categories={categories} countries={countries} />

        {/* Main Content Area */}
        <SidebarInset>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/10">
            {/* Floating Search */}
            <FloatingSearch />

            {/* Page Content */}
            <div className="flex-1 pb-16 md:pb-0 pt-6">{children}</div>
          </div>
        </SidebarInset>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </SidebarProvider>
    </MenuProvider>
  );
}

export default Layouts;
