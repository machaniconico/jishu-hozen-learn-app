"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CATEGORIES,
  ALL_LESSONS,
  getLessons,
  getCategoryStorageId,
  type Grade,
  type CategoryId,
} from "@/lib/lessons-data";
import {
  getCategoryCompletionCount,
  getPastExamScore,
  resetAllProgress,
} from "@/lib/progress";
import { EXAM_SETS } from "@/lib/past-exam-data";

interface CategoryStats {
  grade: Grade;
  category: CategoryId;
  completed: number;
  total: number;
  percent: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<CategoryStats[]>([]);
  const [examScores, setExamScores] = useState<
    Record<string, { score: number; total: number; date: string } | null>
  >({});
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const newStats: CategoryStats[] = [];
    for (const grade of ["2", "1"] as Grade[]) {
      for (const c of CATEGORIES) {
        const lessons = getLessons(grade, c.id);
        if (lessons.length === 0) continue;
        const storageId = getCategoryStorageId(grade, c.id);
        const count = getCategoryCompletionCount(storageId, lessons.length);
        newStats.push({
          grade,
          category: c.id,
          completed: count.completed,
          total: count.total,
          percent: count.percent,
        });
      }
    }
    setStats(newStats);

    const newExamScores: Record<string, { score: number; total: number; date: string } | null> = {};
    for (const exam of EXAM_SETS) {
      newExamScores[exam.id] = getPastExamScore(exam.id);
    }
    setExamScores(newExamScores);
  }, [refreshKey]);

  const total2 = stats.filter((s) => s.grade === "2");
  const total1 = stats.filter((s) => s.grade === "1");
  const totalCompleted2 = total2.reduce((sum, s) => sum + s.completed, 0);
  const totalLessons2 = total2.reduce((sum, s) => sum + s.total, 0);
  const totalCompleted1 = total1.reduce((sum, s) => sum + s.completed, 0);
  const totalLessons1 = total1.reduce((sum, s) => sum + s.total, 0);

  const allLessonsCount = ALL_LESSONS.length;
  const allCompleted = totalCompleted2 + totalCompleted1;
  const overallPercent =
    allLessonsCount > 0 ? Math.round((allCompleted / allLessonsCount) * 100) : 0;

  const reset = () => {
    if (confirm("すべての学習進捗を削除しますか？この操作は取り消せません。")) {
      resetAllProgress();
      setRefreshKey((k) => k + 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-amber-400 mb-2">学習ダッシュボード</h1>
          <p className="text-gray-400 text-sm">
            進捗はブラウザ（localStorage）に自動保存されます。
          </p>
        </div>
        <button onClick={reset} className="text-xs text-red-400 hover:text-red-300 underline">
          進捗をリセット
        </button>
      </div>

      <section className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/30">
        <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3">
          全体の学習進捗
        </h2>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-5xl font-extrabold text-gray-100">{overallPercent}</span>
          <span className="text-xl text-gray-400">%</span>
        </div>
        <p className="text-gray-300 text-sm mb-4">
          {allCompleted} / {allLessonsCount} レッスン完了
        </p>
        <div className="h-3 rounded-full bg-gray-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-100 mb-4">級別の進捗</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <GradeSummary grade="2" color="green" completed={totalCompleted2} total={totalLessons2} stats={total2} />
          <GradeSummary grade="1" color="red" completed={totalCompleted1} total={totalLessons1} stats={total1} />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-100 mb-4">模擬試験 履歴</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {EXAM_SETS.map((exam) => {
            const r = examScores[exam.id];
            return (
              <div key={exam.id} className="p-5 rounded-xl bg-gray-900 border border-gray-800">
                <h3 className="font-bold text-gray-100 mb-2">{exam.title}</h3>
                {r ? (
                  <>
                    <p className="text-3xl font-extrabold text-amber-400">
                      {r.score} / {r.total}{" "}
                      <span className="text-sm text-gray-400 font-normal">
                        （{Math.round((r.score / r.total) * 100)}%）
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      最終: {new Date(r.date).toLocaleDateString("ja-JP")}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">未受験</p>
                )}
                <Link
                  href="/past-exam"
                  className="inline-flex items-center text-xs text-amber-400 hover:text-amber-300 mt-3"
                >
                  {r ? "再受験する" : "受験する"} →
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function GradeSummary({
  grade,
  color,
  completed,
  total,
  stats,
}: {
  grade: Grade;
  color: string;
  completed: number;
  total: number;
  stats: CategoryStats[];
}) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const colorCls: Record<string, { border: string; bg: string; bar: string; text: string }> = {
    green: {
      border: "border-green-500/30",
      bg: "bg-green-500/5",
      bar: "bg-green-500",
      text: "text-green-400",
    },
    red: {
      border: "border-red-500/30",
      bg: "bg-red-500/5",
      bar: "bg-red-500",
      text: "text-red-400",
    },
  };
  const cls = colorCls[color] ?? colorCls.green;

  return (
    <div className={`p-5 rounded-xl border ${cls.border} ${cls.bg}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-lg font-bold ${cls.text}`}>{grade}級</h3>
        <span className="text-2xl font-extrabold text-gray-100">{percent}%</span>
      </div>
      <p className="text-xs text-gray-400 mb-3">
        {completed} / {total} レッスン完了
      </p>
      <div className="h-2 rounded-full bg-gray-800 overflow-hidden mb-4">
        <div className={`h-full ${cls.bar} transition-all duration-300`} style={{ width: `${percent}%` }} />
      </div>
      <div className="space-y-1.5">
        {stats.map((s) => {
          const catInfo = CATEGORIES.find((c) => c.id === s.category);
          return (
            <Link
              key={s.category}
              href={`/learn/${grade}/${s.category}`}
              className="flex items-center justify-between gap-3 text-xs text-gray-300 hover:text-gray-100 py-1"
            >
              <span className="truncate">{catInfo?.icon} {catInfo?.name}</span>
              <span className="text-gray-500 shrink-0">{s.completed}/{s.total}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
