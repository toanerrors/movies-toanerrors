"use client";
import { getWatchHistory } from "@/lib/watch-history";
import { WatchHistoryItem } from "@/types/common";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function HistoryPage() {
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);

  useEffect(() => {
    const history = getWatchHistory();
    if (history) {
      setHistory(history);
    }
  }, []);

  const groupedHistory = history.reduce<Record<string, WatchHistoryItem[]>>(
    (acc, item) => {
      (acc[item.movieSlug] = acc[item.movieSlug] || []).push(item);
      return acc;
    },
    {}
  );

  return (
    <main className="container mx-auto px-4 py-6 min-h-screen space-y-4">
      <h1 className="text-xl font-bold">Lịch sử xem</h1>
      <ul className="space-y-2">
        {Object.entries(groupedHistory).map(([slug, items], i) => (
          <div key={i}>
            <h2 className="text-lg font-semibold">
              <Link href={`/phim/${slug}`}>{slug}</Link>
            </h2>
            <ul>
              {items.map((item, idx) => (
                <li key={idx} className="bg-gray-100 p-2 rounded text-sm">
                  <div>Tập: {item.episodeSlug}</div>
                  <div>
                    Thời gian xem gần nhất:{" "}
                    {new Date(item.lastWatched).toLocaleString()}
                  </div>
                  <div>Đã xem: {Math.floor(item.timestamp / 60)} phút</div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </ul>
      {history.length < 1 && <div>Không có lịch sử xem nào</div>}
    </main>
  );
}
