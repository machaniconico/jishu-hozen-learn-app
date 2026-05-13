"use client";

import { useState } from "react";
import Link from "next/link";
import { ExamRunner } from "@/components/exam-runner";
import { buildMockExam, getBankStats } from "@/lib/question-bank";
import type { BankQuestion } from "@/lib/exam-types";
import type { Grade } from "@/lib/lessons-data";

const COUNTS = [20, 30, 50, 100] as const;

/** perQ: seconds per question (null = untimed). fixedSec: a fixed total limit, overrides perQ. */
const PACE: { id: string; label: string; perQ: number | null; fixedSec?: number; note: string }[] = [
  { id: "none", label: "制限なし", perQ: null, note: "じっくり解く" },
  { id: "easy", label: "ゆったり", perQ: 100, note: "100秒/問" },
  { id: "std", label: "標準", perQ: 75, note: "75秒/問" },
  { id: "real", label: "本番ペース", perQ: 55, note: "55秒/問" },
  { id: "exam120", label: "本番想定", perQ: null, fixedSec: 7200, note: "120分固定（100問推奨）" },
];

function paceLimitSec(paceId: string, count: number): number | null {
  const p = PACE.find((x) => x.id === paceId)!;
  if (p.fixedSec != null) return p.fixedSec;
  return p.perQ != null ? p.perQ * count : null;
}

export default function ExamPage() {
  const [grade, setGrade] = useState<Grade>("2");
  const [count, setCount] = useState<number>(30);
  const [paceId, setPaceId] = useState("std");
  const [run, setRun] = useState<{ questions: BankQuestion[]; limit: number | null } | null>(null);

  const stats = getBankStats();

  const start = () => {
    const questions = buildMockExam(grade, count);
    const limit = paceLimitSec(paceId, questions.length);
    setRun({ questions, limit });
    window.scrollTo(0, 0);
  };

  if (run) {
    const pace = PACE.find((p) => p.id === paceId)!;
    return (
      <ExamRunner
        key={run.questions.map((q) => q.id).join(",")}
        questions={run.questions}
        grade={grade}
        timeLimitSec={run.limit}
        title={`${grade}級 本番模試（${run.questions.length}問・${pace.label}）`}
        examId={`g${grade}-mock-${run.questions.length}`}
        recordResult
        showSubjectBreakdown
        onExit={() => setRun(null)}
        onRestart={start}
      />
    );
  }

  const poolSize = stats.byGrade[grade];
  const limitSec = paceLimitSec(paceId, count);
  const estMin = limitSec != null ? Math.round(limitSec / 60) : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-amber-400 mb-2">本番モード（模擬試験）</h1>
      <p className="text-gray-400 text-sm mb-1">
        毎回ランダムで問題が入れ替わる、本番形式の模試。制限時間・科目別スコア・足切り判定つき。
      </p>
      <p className="text-gray-600 text-xs mb-8">
        収録問題数: 2級 {stats.byGrade["2"]}問 / 1級 {stats.byGrade["1"]}問（合計 {stats.total}問）
      </p>

      <div className="space-y-6 p-6 bg-gray-900 rounded-2xl border border-gray-800">
        {/* grade */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">受験する級</h3>
          <div className="grid grid-cols-2 gap-2">
            {(["2", "1"] as Grade[]).map((g) => (
              <button
                key={g}
                onClick={() => setGrade(g)}
                className={`py-3 rounded-lg border text-sm font-bold transition-colors ${
                  grade === g
                    ? g === "2"
                      ? "bg-green-500/20 border-green-500 text-green-300"
                      : "bg-red-500/20 border-red-500 text-red-300"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                }`}
              >
                {g}級
              </button>
            ))}
          </div>
        </div>

        {/* count */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">出題数</h3>
          <div className="grid grid-cols-4 gap-2">
            {COUNTS.map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
                  count === n
                    ? "bg-amber-500/20 border-amber-500 text-amber-300"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                }`}
              >
                {n}問
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-2">5科目からほぼ均等に出題。本番の学科は約100問・120分が目安です（「100問」＋ペース「本番想定」で本番シミュレーション）。</p>
        </div>

        {/* pace */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">ペース（制限時間）</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {PACE.map((p) => (
              <button
                key={p.id}
                onClick={() => setPaceId(p.id)}
                className={`py-2.5 px-2 rounded-lg border text-xs font-semibold transition-colors ${
                  paceId === p.id
                    ? "bg-amber-500/20 border-amber-500 text-amber-300"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                }`}
              >
                <span className="block">{p.label}</span>
                <span className="block text-[10px] opacity-70 font-normal mt-0.5">{p.note}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-gray-950/60 border border-gray-800 p-3 text-xs text-gray-400">
          {grade}級 · {count}問 ·{" "}
          {estMin != null ? `制限 約${estMin}分` : "制限なし"} · 合格判定: 全体60%以上 ＋ 各科目50%以上（足切り）
          {poolSize < count && (
            <span className="block text-amber-400 mt-1">
              ※ 現在 {grade}級は {poolSize} 問収録のため一部問題が重複する場合があります（順次追加中）。
            </span>
          )}
        </div>

        <button
          onClick={start}
          className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-base transition-colors"
        >
          模試スタート →
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <Link href="/quiz" className="text-amber-400 hover:text-amber-300">→ 軽めのランダムクイズ</Link>
        <Link href="/calc-drill" className="text-amber-400 hover:text-amber-300">→ 計算問題ドリル</Link>
        <Link href="/review" className="text-amber-400 hover:text-amber-300">→ 間違えた問題を復習</Link>
        <Link href="/dashboard" className="text-amber-400 hover:text-amber-300">→ 模試スコアの推移</Link>
      </div>
    </div>
  );
}
