"use client";
import React from "react";
import { Category, Country } from "@/types/common";
import { MenuProvider } from "@/contexts/MenuContext";
import SidebarNav from "./SidebarNav";
import BottomNav from "./BottomNav";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import FloatingSearch from "./FloatingSearch";

type LayoutsProps = {
  children: React.ReactNode;
  categories: Category[];
  countries: Country[];
};

function Layouts({ children, categories, countries }: LayoutsProps) {
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
