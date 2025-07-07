"use client";
import React from "react";
import { Category, Country } from "@/types/common";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Film,
  Globe,
  History,
  Tv,
  Play,
  Star,
  Clock,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarNavProps {
  categories: Category[];
  countries: Country[];
}

const SidebarNav: React.FC<SidebarNavProps> = ({ categories, countries }) => {
  const mainNavItems = [
    {
      title: "Trang chủ",
      url: "/",
      icon: Home,
      description: "Trang chủ chính",
    },
    {
      title: "Phim lẻ",
      url: "/phim-le",
      icon: Film,
      description: "Phim điện ảnh",
    },
    {
      title: "Phim bộ",
      url: "/phim-bo",
      icon: Tv,
      description: "Series & TV Shows",
    },
    {
      title: "Lịch sử",
      url: "/history",
      icon: History,
      description: "Phim đã xem",
    },
  ];

  const quickCategories = categories.slice(0, 8);
  const quickCountries = countries.slice(0, 8);

  return (
    <Sidebar className="border-r border-border/50 w-fit bg-background/95 backdrop-blur-lg">
      <SidebarHeader className="border-b border-border/50">
        <Link href="/" className="flex items-center gap-2 px-2 py-1">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
            <Play className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              MoViGo
            </span>
            <span className="text-xs text-muted-foreground">
              Xem phim online
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Danh mục chính
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.description}>
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Categories */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Thể loại phổ biến
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <Film className="w-4 h-4" />
                    <span>Thể loại</span>
                    <Badge variant="secondary" className="ml-auto">
                      {categories.length}
                    </Badge>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {quickCategories.map((cat) => (
                      <SidebarMenuSubItem key={cat.slug}>
                        <SidebarMenuSubButton asChild>
                          <Link href={`/the-loai/${cat.slug}`}>{cat.name}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                    {categories.length > 8 && (
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link href="/the-loai" className="text-primary">
                            Xem tất cả ({categories.length})
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Countries */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Quốc gia phổ biến
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <Globe className="w-4 h-4" />
                    <span>Quốc gia</span>
                    <Badge variant="secondary" className="ml-auto">
                      {countries.length}
                    </Badge>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {quickCountries.map((country) => (
                      <SidebarMenuSubItem key={country.slug}>
                        <SidebarMenuSubButton asChild>
                          <Link href={`/quoc-gia/${country.slug}`}>
                            {country.name}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                    {countries.length > 8 && (
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link href="/quoc-gia" className="text-primary">
                            Xem tất cả ({countries.length})
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Stats */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Thống kê
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tổng phim</span>
                <Badge variant="outline">10,000+</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Thể loại</span>
                <Badge variant="outline">{categories.length}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Quốc gia</span>
                <Badge variant="outline">{countries.length}</Badge>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50">
        <div className="px-2 py-4">
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p className="font-medium">© 2025 MoViGo</p>
            <p>Xem phim online miễn phí</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <Clock className="w-3 h-3" />
              <span>Cập nhật 24/7</span>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarNav;
