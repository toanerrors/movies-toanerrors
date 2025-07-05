"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Play, SkipForward, Pause } from "lucide-react";

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
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
          className="fixed bottom-6 right-6 z-50 bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-5 max-w-sm min-w-[320px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <SkipForward className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold text-sm">
                Tự động phát tập tiếp
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Episode info */}
          {nextEpisodeName && (
            <div className="mb-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium text-foreground line-clamp-2">
                {nextEpisodeName}
              </p>
            </div>
          )}

          {/* Countdown */}
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <motion.div
                className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {countdown}
              </motion.div>

              {/* Animated ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-primary/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
            >
              <Pause className="h-4 w-4" />
              Dừng lại
            </Button>
            <Button
              onClick={onPlayNow}
              className="flex-1 gap-2 bg-primary hover:bg-primary/90"
            >
              <Play className="h-4 w-4" />
              Phát ngay
            </Button>
          </div>

          {/* Progress bar */}
          <div className="mt-4 w-full bg-muted/50 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: countdown, ease: "linear" }}
            />
          </div>

          {/* Bottom text */}
          <p className="text-xs text-muted-foreground text-center mt-2">
            Tập tiếp theo sẽ được phát trong {countdown} giây
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
