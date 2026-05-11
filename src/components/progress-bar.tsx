"use client";

import { useEffect, useState } from "react";
import { getCategoryCompletionCount } from "@/lib/progress";

interface ProgressBarProps {
  categoryId: string;
  totalLessons: number;
  color?: string;
}

const colorMap: Record<string, string> = {
  amber: "bg-amber-500",
  orange: "bg-orange-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
  red: "bg-red-500",
  purple: "bg-purple-500",
  cyan: "bg-cyan-500",
  yellow: "bg-yellow-500",
};

export function ProgressBar({ categoryId, totalLessons, color = "amber" }: ProgressBarProps) {
  const [stats, setStats] = useState({ completed: 0, total: totalLessons, percent: 0 });

  useEffect(() => {
    const refresh = () =>
      setStats(getCategoryCompletionCount(categoryId, totalLessons));
    refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "jishu-hozen-progress") refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [categoryId, totalLessons]);

  const barColor = colorMap[color] ?? colorMap.amber;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">学習進捗</span>
        <span className="text-gray-300 font-semibold">
          {stats.completed} / {stats.total} レッスン（{stats.percent}%）
        </span>
      </div>
      <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-300`}
          style={{ width: `${stats.percent}%` }}
        />
      </div>
    </div>
  );
}
