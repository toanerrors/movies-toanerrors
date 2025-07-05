"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Play } from "lucide-react";

interface AutoPlayNotificationProps {
  isVisible: boolean;
  countdown: number;
  nextEpisodeName?: string;
  onCancel: () => void;
  onPlayNow: () => void;
}

export default function AutoPlayNotification({
  isVisible,
  countdown,
  nextEpisodeName,
  onCancel,
  onPlayNow,
}: AutoPlayNotificationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="fixed bottom-4 right-4 z-50 bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-4 max-w-sm"
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Play className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">
                  Tự động phát tập tiếp theo
                </span>
              </div>

              {nextEpisodeName && (
                <p className="text-xs text-muted-foreground mb-2">
                  {nextEpisodeName}
                </p>
              )}

              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {countdown}
                </div>
                <span className="text-xs text-muted-foreground">giây</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="flex-1 text-xs"
            >
              Hủy
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onPlayNow}
              className="flex-1 text-xs"
            >
              Phát ngay
            </Button>
          </div>

          {/* Progress bar */}
          <div className="mt-3 w-full bg-muted rounded-full h-1">
            <motion.div
              className="bg-primary h-1 rounded-full"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: countdown, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
