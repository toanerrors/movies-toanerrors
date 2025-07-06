"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Home, Film, Globe, History } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMenu } from "@/contexts/MenuContext";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const BottomNav: React.FC = () => {
  const { categories, countries } = useMenu();
  const [openCategory, setOpenCategory] = useState(false);
  const [openCountry, setOpenCountry] = useState(false);

  const navItems = [
    { icon: Home, href: "/", label: "Trang chủ" },
    { icon: Film, label: "Thể loại", action: () => setOpenCategory(true) },
    { icon: Globe, label: "Quốc gia", action: () => setOpenCountry(true) },
    { icon: History, href: "/history", label: "Lịch sử" },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden bg-background/95 backdrop-blur-lg border-t border-border/50 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex w-full justify-around py-2 px-2">
          {navItems.map((item, index) => (
            <div
              key={item.label}
              className="flex-1 animate-in fade-in zoom-in duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {item.href ? (
                <Link
                  href={item.href}
                  className="flex flex-col items-center justify-center py-2 px-3 rounded-lg hover:bg-primary/10 transition-all duration-200 group"
                >
                  <item.icon className="w-6 h-6 mb-1 group-hover:text-primary transition-colors" />
                  <span className="text-xs font-medium group-hover:text-primary transition-colors">
                    {item.label}
                  </span>
                </Link>
              ) : (
                <button
                  onClick={item.action}
                  className="w-full flex flex-col items-center justify-center py-2 px-3 rounded-lg hover:bg-primary/10 transition-all duration-200 group focus:outline-none"
                >
                  <item.icon className="w-6 h-6 mb-1 group-hover:text-primary transition-colors" />
                  <span className="text-xs font-medium group-hover:text-primary transition-colors">
                    {item.label}
                  </span>
                </button>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Drawer cho Thể loại */}
      <Drawer open={openCategory} onOpenChange={setOpenCategory}>
        <DrawerContent className="max-h-[80vh]">
          <DrawerHeader className="border-b border-border/50">
            <DrawerTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                <Film className="w-5 h-5" />
              </div>
              Thể loại phim
              <Badge variant="secondary" className="ml-auto">
                {categories?.length || 0}
              </Badge>
            </DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 p-4">
            <div className="grid grid-cols-2 gap-3">
              {categories?.map((cat) => (
                <div
                  key={cat.slug}
                  className="animate-in fade-in zoom-in duration-300"
                >
                  <Link
                    href={`/the-loai/${cat.slug}`}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-primary/5 hover:border-primary/20 transition-all duration-200 group"
                    onClick={() => setOpenCategory(false)}
                  >
                    <div className="p-1.5 rounded-md bg-gradient-to-r from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all">
                      <Film className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium group-hover:text-primary transition-colors">
                      {cat.name}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      {/* Drawer cho Quốc gia */}
      <Drawer open={openCountry} onOpenChange={setOpenCountry}>
        <DrawerContent className="max-h-[80vh]">
          <DrawerHeader className="border-b border-border/50">
            <DrawerTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-blue-500/20">
                <Globe className="w-5 h-5" />
              </div>
              Quốc gia
              <Badge variant="secondary" className="ml-auto">
                {countries?.length || 0}
              </Badge>
            </DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 p-4">
            <div className="grid grid-cols-2 gap-3">
              {countries?.map((country) => (
                <div
                  key={country.slug}
                  className="animate-in fade-in zoom-in duration-300"
                >
                  <Link
                    href={`/quoc-gia/${country.slug}`}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-primary/5 hover:border-primary/20 transition-all duration-200 group"
                    onClick={() => setOpenCountry(false)}
                  >
                    <div className="p-1.5 rounded-md bg-gradient-to-r from-green-500/10 to-blue-500/10 group-hover:from-green-500/20 group-hover:to-blue-500/20 transition-all">
                      <Globe className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium group-hover:text-primary transition-colors">
                      {country.name}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default BottomNav;
