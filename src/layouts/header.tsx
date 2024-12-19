"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useMenu } from "@/contexts/MenuContext";
import { Category, Country } from "@/types/common";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { ModeToggle } from "./mode-toggle";
import { IoMenu } from "react-icons/io5";
import { SearchDialog } from "@/components/search-dialog";

function Header() {
  const { categories, countries } = useMenu();
  const [showCategories, setShowCategories] = useState(false);
  const [showCountries, setShowCountries] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const renderMenuItems = (
    items: Category[] | Country[],
    type: "the-loai" | "quoc-gia"
  ) => {
    return items.map((item) => (
      <Link
        key={item.slug}
        href={`/${type}/${item.slug}`}
        className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
      >
        <div className="text-sm font-medium leading-relaxed">{item.name}</div>
      </Link>
    ));
  };

  const renderMobileMenuItems = () => (
    <div className="grid w-[300px] gap-1.5 p-3">
      <button
        className="text-sm w-full text-left px-4 py-2 rounded-md hover:bg-accent/50 transition-colors"
        onClick={() => setShowCategories(!showCategories)}
      >
        Thể loại {showCategories ? "▲" : "▼"}
      </button>
      {showCategories && (
        <div className="pl-4 grid grid-cols-2">
          {renderMenuItems(categories, "the-loai")}
        </div>
      )}
      <button
        className="text-sm w-full text-left px-4 py-2 rounded-md hover:bg-accent/50 transition-colors"
        onClick={() => setShowCountries(!showCountries)}
      >
        Quốc gia {showCountries ? "▲" : "▼"}
      </button>
      {showCountries && (
        <div className="pl-4 grid grid-cols-2">
          {renderMenuItems(countries, "quoc-gia")}
        </div>
      )}
      <Link href="/phim-le" legacyBehavior passHref>
        <NavigationMenuLink className="block text-sm w-full text-left px-4 py-2 rounded-md hover:bg-accent/50 transition-colors">
          Phim lẻ
        </NavigationMenuLink>
      </Link>
      <Link href="/phim-bo" legacyBehavior passHref>
        <NavigationMenuLink className="block text-sm w-full text-left px-4 py-2 rounded-md hover:bg-accent/50 transition-colors">
          Phim bộ
        </NavigationMenuLink>
      </Link>
    </div>
  );

  const searchTrigger = (
    <>
      <div className="flex items-center space-x-4 md:hidden">
        <Search
          onClick={() => setSearchOpen(true)}
          className="h-4 w-4 text-muted-foreground cursor-pointer select-none"
        />
      </div>
      <div className="hidden md:block">
        <Search
          onClick={() => setSearchOpen(true)}
          className="h-4 w-4 text-muted-foreground cursor-pointer select-none"
        />
      </div>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );

  return (
    <header className="h-auto top-0 z-50 w-full shadow-lg">
      <div className="container mx-auto flex p-2 items-center justify-between max-w-screen-2xl">
        <div className="flex items-center">
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="space-x-4">
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className="px-4 py-2 rounded-md text-sm hover:bg-accent/50 transition-colors">
                    Trang chủ
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="px-4 py-2 rounded-md hover:bg-accent/50 transition-colors">
                  Thể loại
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[500px] gap-1.5 p-3 md:w-[600px] md:grid-cols-3">
                    {renderMenuItems(categories, "the-loai")}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="px-4 py-2 rounded-md hover:bg-accent/50 transition-colors">
                  Quốc gia
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[500px] gap-1.5 p-3 md:w-[600px] md:grid-cols-4">
                    {renderMenuItems(countries, "quoc-gia")}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/phim-le" legacyBehavior passHref>
                  <NavigationMenuLink className="px-4 py-2 rounded-md text-sm hover:bg-accent/50 transition-colors">
                    Phim lẻ
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/phim-bo" legacyBehavior passHref>
                  <NavigationMenuLink className="px-4 py-2 rounded-md text-sm hover:bg-accent/50 transition-colors">
                    Phim bộ
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          {/* Mobile Menu */}
          <NavigationMenu className="flex md:hidden">
            <NavigationMenuList className="space-x-4">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="px-4 py-2 rounded-md hover:bg-accent/50 transition-colors">
                  <IoMenu size={25} />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  {renderMobileMenuItems()}
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center space-x-4">
          {searchTrigger}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

export default Header;
