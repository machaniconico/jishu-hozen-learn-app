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
  getExamResults,
  getBestExamPercent,
  getExamDate,
  setExamDate,
  getDaysUntilExam,
  getStreak,
  getTotalStudyDays,
  getCategoryAccuracy,
} from "@/lib/progress";
import { EXAM_SETS } from "@/lib/past-exam-data";
import { QUESTION_CATEGORY_MAP, getBankStats } from "@/lib/question-bank";
import { PASS_LINE, type ExamResult } from "@/lib/exam-types";

interface CategoryStats {
  grade: Grade;
  category: CategoryId;
  completed: number;
  total: number;
  percent: number;
}

const CAT = (id: CategoryId) => CATEGORIES.find((c) => c.id === id);

export default function DashboardPage() {
  const [stats, setStats] = useState<CategoryStats[]>([]);
  const [examScores, setExamScores] = useState<Record<string, { score: number; total: number; date: string } | null>>({});
  const [results, setResults] = useState<ExamResult[]>([]);
  const [bestPct, setBestPct] = useState<{ "2": number | null; "1": number | null }>({ "2": null, "1": null });
  const [accuracy, setAccuracy] = useState<Array<{ category: CategoryId; correct: number; total: number; percent: number }>>([]);
  const [examDate, setExamDateState] = useState<string>("");
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const newStats: CategoryStats[] = [];
    for (const grade of ["2", "1"] as Grade[]) {
      for (const c of CATEGORIES) {
        const lessons = getLessons(grade, c.id);
        if (lessons.length === 0) continue;
        const storageId = getCategoryStorageId(grade, c.id);
        const count = getCategoryCompletionCount(storageId, lessons.length);
        newStats.push({ grade, category: c.id, completed: count.completed, total: count.total, percent: count.percent });
      }
    }
    setStats(newStats);

    const es: Record<string, { score: number; total: number; date: string } | null> = {};
    for (const exam of EXAM_SETS) es[exam.id] = getPastExamScore(exam.id);
    setExamScores(es);

    setResults(getExamResults());
    setBestPct({ "2": getBestExamPercent("2"), "1": getBestExamPercent("1") });
    setAccuracy(getCategoryAccuracy(QUESTION_CATEGORY_MAP));
    setExamDateState(getExamDate() ?? "");
    setDaysLeft(getDaysUntilExam());
    setStreak(getStreak());
    setTotalDays(getTotalStudyDays());
  }, [refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  const onSetDate = (v: string) => {
    setExamDate(v || null);
    setExamDateState(v);
    setDaysLeft(getDaysUntilExam());
  };

  const total2 = stats.filter((s) => s.grade === "2");
  const total1 = stats.filter((s) => s.grade === "1");
  const totalCompleted2 = total2.reduce((s, x) => s + x.completed, 0);
  const totalLessons2 = total2.reduce((s, x) => s + x.total, 0);
  const totalCompleted1 = total1.reduce((s, x) => s + x.completed, 0);
  const totalLessons1 = total1.reduce((s, x) => s + x.total, 0);
  const allCompleted = totalCompleted2 + totalCompleted1;
  const allLessonsCount = ALL_LESSONS.length;
  const overallPercent = allLessonsCount > 0 ? Math.round((allCompleted / allLessonsCount) * 100) : 0;

  const reset = () => {
    if (confirm("すべての学習進捗（レッスン・模試・解答履歴・学習日・受験日）を削除しますか？取り消せません。")) {
      resetAllProgress();
      refresh();
    }
  };

  const bankStats = getBankStats();
  const recentResults = results.slice(-12);
  const weakest = accuracy[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-amber-400 mb-2">学習ダッシュボード</h1>
          <p className="text-gray-400 text-sm">進捗はブラウザ（localStorage）に自動保存されます。</p>
        </div>
        <button onClick={reset} className="text-xs text-red-400 hover:text-red-300 underline">進捗をリセット</button>
      </div>

      {/* study plan + streak */}
      <section className="mb-8 grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/30">
          <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3">受験日とカウントダウン</h2>
          <div className="flex items-center gap-4 flex-wrap">
            <input
              type="date"
              value={examDate}
              onChange={(e) => onSetDate(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100"
            />
            {daysLeft != null ? (
              daysLeft >= 0 ? (
                <p className="text-gray-200 text-sm">
                  本番まで <span className="text-3xl font-extrabold text-amber-300">{daysLeft}</span> 日
                  {daysLeft <= 90 && allLessonsCount > 0 && (
                    <span className="block text-xs text-gray-500 mt-1">
                      残レッスン {allLessonsCount - allCompleted} 本 → 1日 約{Math.max(1, Math.ceil((allLessonsCount - allCompleted) / Math.max(1, daysLeft)))} 本ペース ／ 毎日 模試20〜30問を推奨
                    </span>
                  )}
                </p>
              ) : (
                <p className="text-gray-400 text-sm">受験日が過ぎています。新しい日付を設定しましょう。</p>
              )
            ) : (
              <p className="text-gray-500 text-sm">受験予定日を入れると学習計画の目安が出ます。</p>
            )}
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800 text-center">
          <p className="text-3xl font-extrabold text-amber-300">🔥 {streak}</p>
          <p className="text-xs text-gray-400 mt-1">連続学習日数</p>
          <p className="text-[11px] text-gray-600 mt-2">通算 {totalDays} 日</p>
        </div>
      </section>

      {/* overall lessons */}
      <section className="mb-8 p-6 rounded-2xl bg-gray-900 border border-gray-800">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">テキスト学習の進捗</h2>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-5xl font-extrabold text-gray-100">{overallPercent}</span>
          <span className="text-xl text-gray-400">%</span>
          <span className="text-sm text-gray-500 ml-2">{allCompleted} / {allLessonsCount} レッスン完了</span>
        </div>
        <div className="h-3 rounded-full bg-gray-800 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500" style={{ width: `${overallPercent}%` }} />
        </div>
      </section>

      {/* mock exam history chart */}
      <section className="mb-8 p-6 rounded-2xl bg-gray-900 border border-gray-800">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">本番モード スコア推移</h2>
          <div className="flex gap-3 text-xs">
            <span className="text-gray-500">最高: 2級 <span className="text-green-400 font-semibold">{bestPct["2"] ?? "—"}{bestPct["2"] != null ? "%" : ""}</span></span>
            <span className="text-gray-500">1級 <span className="text-red-400 font-semibold">{bestPct["1"] ?? "—"}{bestPct["1"] != null ? "%" : ""}</span></span>
          </div>
        </div>
        {recentResults.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm mb-3">まだ本番モードの受験記録がありません。</p>
            <Link href="/exam" className="inline-block px-4 py-2 rounded-lg bg-amber-500 text-gray-950 text-sm font-bold hover:bg-amber-400">
              本番モードを受ける →
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-end gap-1.5 h-32 border-b border-gray-800 relative pt-4">
              <div className="absolute left-0 right-0 border-t border-dashed border-amber-500/40" style={{ bottom: `${PASS_LINE}%` }}>
                <span className="absolute -top-4 right-0 text-[10px] text-amber-500/70">合格ライン {PASS_LINE}%</span>
              </div>
              {recentResults.map((r, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end relative" title={`${new Date(r.date).toLocaleDateString("ja-JP")} ${r.grade}級 ${r.percent}%`}>
                  <span className="text-[10px] text-gray-500 mb-0.5">{r.percent}</span>
                  <div
                    className={`w-full rounded-t transition-all ${r.passed ? "bg-green-500/70" : r.grade === "1" ? "bg-red-500/60" : "bg-amber-500/60"}`}
                    style={{ height: `${Math.max(4, r.percent)}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-gray-600">
              <span>{new Date(recentResults[0].date).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" })}</span>
              <span>直近 {recentResults.length} 回（全{results.length}回）</span>
              <span>{new Date(recentResults[recentResults.length - 1].date).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" })}</span>
            </div>
          </>
        )}
      </section>

      {/* weak area analysis */}
      <section className="mb-8 p-6 rounded-2xl bg-gray-900 border border-gray-800">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">科目別 正答率（クイズ・模試・ドリルの累計）</h2>
        {accuracy.length === 0 ? (
          <p className="text-gray-500 text-sm py-3">まだ問題を解いていません。クイズや本番モードで解くと、ここに弱点が見えます。</p>
        ) : (
          <>
            {weakest && (
              <p className="text-xs text-amber-400 mb-4">
                最も弱い科目: <span className="font-semibold">{CAT(weakest.category)?.icon} {CAT(weakest.category)?.name}</span>（{weakest.percent}%）— まずはここを重点的に。
              </p>
            )}
            <div className="space-y-3">
              {CATEGORIES.map((c) => {
                const a = accuracy.find((x) => x.category === c.id);
                const pct = a?.percent ?? null;
                return (
                  <div key={c.id}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <Link href="/quiz" className="text-gray-300 hover:text-gray-100">{c.icon} {c.name}</Link>
                      <span className="text-gray-500">{a ? `${a.correct}/${a.total}（${pct}%）` : "未挑戦"}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                      <div
                        className={`h-full transition-all ${pct == null ? "bg-gray-700" : pct >= 70 ? "bg-green-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                        style={{ width: `${pct ?? 0}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-xs">
              <Link href="/review" className="text-amber-400 hover:text-amber-300">→ 間違えた問題を復習する</Link>
              <Link href="/quiz" className="text-amber-400 hover:text-amber-300">→ 苦手科目だけクイズする</Link>
            </div>
          </>
        )}
        <p className="text-[11px] text-gray-600 mt-3">問題バンク収録数: 合計 {bankStats.total}問（2級 {bankStats.byGrade["2"]} / 1級 {bankStats.byGrade["1"]}）</p>
      </section>

      {/* per-grade lesson progress */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-100 mb-4">級別の学習進捗</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <GradeSummary grade="2" color="green" completed={totalCompleted2} total={totalLessons2} stats={total2} />
          <GradeSummary grade="1" color="red" completed={totalCompleted1} total={totalLessons1} stats={total1} />
        </div>
      </section>

      {/* fixed mock sets */}
      <section className="mb-4">
        <h2 className="text-lg font-bold text-gray-100 mb-4">固定セットの模擬試験</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {EXAM_SETS.map((exam) => {
            const r = examScores[exam.id];
            return (
              <div key={exam.id} className="p-5 rounded-xl bg-gray-900 border border-gray-800">
                <h3 className="font-bold text-gray-100 mb-2">{exam.title}</h3>
                {r ? (
                  <>
                    <p className="text-2xl font-extrabold text-amber-400">
                      {r.score} / {r.total}{" "}
                      <span className="text-sm text-gray-400 font-normal">（{Math.round((r.score / r.total) * 100)}%）</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">最終: {new Date(r.date).toLocaleDateString("ja-JP")}</p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">未受験</p>
                )}
                <Link href="/past-exam" className="inline-flex items-center text-xs text-amber-400 hover:text-amber-300 mt-3">
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
    green: { border: "border-green-500/30", bg: "bg-green-500/5", bar: "bg-green-500", text: "text-green-400" },
    red: { border: "border-red-500/30", bg: "bg-red-500/5", bar: "bg-red-500", text: "text-red-400" },
  };
  const cls = colorCls[color] ?? colorCls.green;
  return (
    <div className={`p-5 rounded-xl border ${cls.border} ${cls.bg}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-lg font-bold ${cls.text}`}>{grade}級</h3>
        <span className="text-2xl font-extrabold text-gray-100">{percent}%</span>
      </div>
      <p className="text-xs text-gray-400 mb-3">{completed} / {total} レッスン完了</p>
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
