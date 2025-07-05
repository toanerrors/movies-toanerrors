"use client";
import WatchHistoryManager from "@/components/WatchHistoryManager";

export default function HistoryPage() {
  return (
    <main className="container mx-auto px-4 py-6 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Lịch sử xem phim</h1>
        <p className="text-muted-foreground">
          Quản lý và theo dõi tiến độ xem phim của bạn
        </p>
      </div>

      <WatchHistoryManager />
    </main>
  );
}
