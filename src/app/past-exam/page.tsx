"use client";

import { useState } from "react";
import Link from "next/link";
import { ExamRunner } from "@/components/exam-runner";
import { EXAM_SETS, type ExamSet } from "@/lib/past-exam-data";
import { savePastExamScore } from "@/lib/progress";
import type { BankQuestion } from "@/lib/exam-types";

/** perQ seconds; null = untimed */
const PACE: { id: string; label: string; perQ: number | null; note: string }[] = [
  { id: "none", label: "制限なし", perQ: null, note: "じっくり" },
  { id: "easy", label: "ゆったり", perQ: 100, note: "100秒/問" },
  { id: "std", label: "標準", perQ: 75, note: "75秒/問" },
  { id: "real", label: "本番ペース", perQ: 55, note: "55秒/問" },
];

function toBankQuestions(set: ExamSet): BankQuestion[] {
  return set.questions.map((q, i) => ({
    id: `pe-${set.id}-${i}`,
    grade: set.grade,
    category: "seisan-kihon",
    difficulty: 2 as const,
    question: q.question,
    options: q.options.slice(0, 4) as [string, string, string, string],
    answer: q.answer,
    explanation: q.explanation ?? "",
  }));
}

export default function PastExamPage() {
  const [active, setActive] = useState<ExamSet | null>(null);
  const [paceId, setPaceId] = useState("std");
  const [run, setRun] = useState<{ set: ExamSet; questions: BankQuestion[]; limit: number | null } | null>(null);

  const startRun = (set: ExamSet) => {
    const pace = PACE.find((p) => p.id === paceId)!;
    const questions = toBankQuestions(set);
    const limit = pace.perQ != null ? pace.perQ * questions.length : null;
    setRun({ set, questions, limit });
    window.scrollTo(0, 0);
  };

  if (run) {
    const pace = PACE.find((p) => p.id === paceId)!;
    return (
      <ExamRunner
        key={`${run.set.id}-${pace.id}-${run.questions.length}`}
        questions={run.questions}
        grade={run.set.grade}
        timeLimitSec={run.limit}
        title={`${run.set.title}（${run.questions.length}問・${pace.label}）`}
        examId={run.set.id}
        recordResult={false}
        showSubjectBreakdown={false}
        onFinish={(r) => savePastExamScore(run.set.id, r.correct, r.total)}
        onExit={() => {
          setRun(null);
          setActive(null);
          window.scrollTo(0, 0);
        }}
        onRestart={() => startRun(run.set)}
      />
    );
  }

  // pace picker for the selected set
  if (active) {
    const isG2 = active.grade === "2";
    const pace = PACE.find((x) => x.id === paceId)!;
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <button onClick={() => setActive(null)} className="text-xs text-gray-400 hover:text-gray-200 underline mb-5">← 一覧に戻る</button>
        <h1 className="text-2xl font-bold text-gray-100 mb-1">{active.title}</h1>
        <p className="text-sm text-gray-400 mb-6">
          全{active.questions.length}問 · <span className={isG2 ? "text-green-400" : "text-red-400"}>{active.grade}級</span> · 本番形式
        </p>
        <div className="space-y-5 p-6 bg-gray-900 rounded-2xl border border-gray-800">
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">制限時間（ペース）</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
            <p className="text-xs text-gray-600 mt-2">
              {pace.perQ != null
                ? `制限 約${Math.round((pace.perQ * active.questions.length) / 60)}分（タイマー表示・時間切れで自動採点）`
                : "制限時間なし"}
            </p>
          </div>
          <button
            onClick={() => startRun(active)}
            className={`w-full py-3.5 rounded-xl font-bold text-base transition-colors ${
              isG2 ? "bg-green-600 hover:bg-green-500 text-white" : "bg-red-600 hover:bg-red-500 text-white"
            }`}
          >
            受験する →
          </button>
        </div>
        <p className="mt-4 text-xs text-gray-600">
          毎回ランダムで問題が入れ替わるフル模試は <Link href="/exam" className="text-amber-400 hover:underline">本番モード</Link>（「100問・本番想定120分」も選べます）。
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-amber-400 mb-3">模擬試験（固定セット）</h1>
      <p className="text-gray-400 mb-1">
        決まった問題セットで実力チェック。タイマー付きで本番に近い形で解けます。間違えた問題は解説で復習。
      </p>
      <p className="text-gray-600 text-xs mb-8">
        毎回問題が入れ替わるフル模試・タイマー・科目別足切り判定は <Link href="/exam" className="text-amber-400 hover:underline">本番モード</Link> をどうぞ。
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {EXAM_SETS.map((exam) => {
          const isG2 = exam.grade === "2";
          return (
            <div
              key={exam.id}
              className={`p-6 rounded-2xl border ${
                isG2
                  ? "border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-600/5"
                  : "border-red-500/30 bg-gradient-to-br from-red-500/10 to-orange-600/5"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-xs font-semibold ${
                    isG2 ? "bg-green-500/15 border-green-500/40 text-green-400" : "bg-red-500/15 border-red-500/40 text-red-400"
                  }`}
                >
                  {exam.grade}級
                </span>
                <span className="text-xs text-gray-500">全{exam.questions.length}問</span>
              </div>
              <h2 className="text-xl font-bold text-gray-100 mb-2">{exam.title}</h2>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">{exam.description}</p>
              <button
                onClick={() => {
                  setActive(exam);
                  window.scrollTo(0, 0);
                }}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${
                  isG2 ? "bg-green-600 hover:bg-green-500 text-white" : "bg-red-600 hover:bg-red-500 text-white"
                }`}
              >
                ペースを選んで受験 →
              </button>
            </div>
          );
        })}
      </div>

      <section className="mt-12 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30">
        <h2 className="text-lg font-bold text-amber-400 mb-2">本番試験の概要</h2>
        <ul className="space-y-1 text-sm text-gray-300">
          <li>● 主催: 公益社団法人 日本プラントメンテナンス協会（JIPM）</li>
          <li>● 形式: 学科試験（マークシートの択一問題）＋ 実技試験（記述式）</li>
          <li>● 求められる4つの能力: 異常発見 / 処置・回復 / 条件設定 / 維持管理（× 5科目）</li>
          <li>● 合格基準: 学科・実技それぞれ概ね60%以上（科目ごとの足切りがある場合あり）</li>
        </ul>
        <p className="text-xs text-amber-400/80 mt-3">※ 出題数・配点・合格基準・実施要領は年度により変わります。受験前に JIPM の公式情報をご確認ください（<Link href="/syllabus" className="underline hover:text-amber-300">出題範囲との対応</Link>）。</p>
      </section>
    </div>
  );
}
