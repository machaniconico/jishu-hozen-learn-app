import Link from "next/link";
import type { Lesson } from "@/lib/lessons-data";

interface LessonNavProps {
  lessons: Lesson[];
  currentId: string;
  basePath: string;
}

export function LessonNav({ lessons, currentId, basePath }: LessonNavProps) {
  const sorted = [...lessons].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((l) => l.id === currentId);
  const prev = idx > 0 ? sorted[idx - 1] : null;
  const next = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null;

  return (
    <div className="mt-12 grid grid-cols-2 gap-3">
      {prev ? (
        <Link
          href={`${basePath}/${prev.id}`}
          className="flex items-center gap-2 p-4 rounded-xl bg-gray-800/50 border border-gray-700 hover:bg-gray-800 hover:border-gray-600 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <div className="min-w-0 text-left">
            <p className="text-xs text-gray-500 mb-0.5">前のレッスン</p>
            <p className="text-sm text-gray-200 truncate">{prev.title}</p>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`${basePath}/${next.id}`}
          className="flex items-center justify-end gap-2 p-4 rounded-xl bg-gray-800/50 border border-gray-700 hover:bg-gray-800 hover:border-gray-600 transition-colors"
        >
          <div className="min-w-0 text-right">
            <p className="text-xs text-gray-500 mb-0.5">次のレッスン</p>
            <p className="text-sm text-gray-200 truncate">{next.title}</p>
          </div>
          <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <Link
          href={basePath}
          className="flex items-center justify-end gap-2 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
        >
          <div className="min-w-0 text-right">
            <p className="text-xs text-amber-400 mb-0.5">最後のレッスンです</p>
            <p className="text-sm text-amber-300">カテゴリ一覧へ戻る</p>
          </div>
          <svg className="w-5 h-5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}
