"use client";
import React, { useState } from "react";
import { Search, X, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "./mode-toggle";

const FloatingSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const trendingSearches = [
    "One Piece",
    "Naruto",
    "Attack on Titan",
    "Demon Slayer",
    "Dragon Ball",
  ];

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Handle search logic here
      console.log("Searching for:", query);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
        {/* Search Button */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <Button
            onClick={() => setIsOpen(true)}
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 backdrop-blur-sm"
          >
            <Search className="h-5 w-5" />
          </Button>
        </motion.div>

        {/* Theme Toggle */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <div className="bg-background/80 backdrop-blur-sm rounded-full p-1 shadow-lg border">
            <ModeToggle />
          </div>
        </motion.div>
      </div>

      {/* Floating Banner */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="fixed top-6 left-1/2 transform -translate-x-1/2 z-40 md:left-64 md:transform-none"
      >
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm border border-border/50 rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium hidden sm:inline">
            Khám phá hàng ngàn bộ phim chất lượng cao
          </span>
          <span className="text-sm font-medium sm:hidden">
            Xem phim miễn phí
          </span>
        </div>
      </motion.div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="w-full max-w-2xl mx-4"
              initial={{ y: -50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -50, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="shadow-2xl bg-background/95 backdrop-blur-lg border-border/50">
                <CardContent className="p-6">
                  {/* Search Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Search className="w-5 h-5 text-primary" />
                      Tìm kiếm phim
                    </h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Search Input */}
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Nhập tên phim bạn muốn tìm..."
                      className="pl-10 text-lg h-12 bg-background/50 border-border/50 focus:border-primary"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSearch(searchQuery);
                        }
                      }}
                      autoFocus
                    />
                  </div>

                  {/* Trending Searches */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="w-4 h-4" />
                      <span>Tìm kiếm phổ biến</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((term, index) => (
                        <motion.div
                          key={term}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Badge
                            variant="secondary"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-105"
                            onClick={() => handleSearch(term)}
                          >
                            {term}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingSearch;
