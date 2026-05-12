"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExamRunner } from "@/components/exam-runner";
import { getWrongQuestionIds, getAnswerStat } from "@/lib/progress";
import { getQuestionsByIds, shuffle } from "@/lib/question-bank";
import type { BankQuestion } from "@/lib/exam-types";
import { CATEGORIES } from "@/lib/lessons-data";

const CAT_NAME: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, `${c.icon} ${c.name}`])
);

const MAX_PER_RUN = 20;

export default function ReviewPage() {
  const [ready, setReady] = useState(false);
  const [questions, setQuestions] = useState<BankQuestion[]>([]);
  const [run, setRun] = useState<BankQuestion[] | null>(null);

  const load = () => {
    const ids = getWrongQuestionIds();
    setQuestions(getQuestionsByIds(ids));
  };

  useEffect(() => {
    load();
    setReady(true);
  }, []);

  const startRun = () => {
    setRun(shuffle(questions).slice(0, MAX_PER_RUN));
    window.scrollTo(0, 0);
  };

  if (run && run.length > 0) {
    return (
      <ExamRunner
        key={run.map((q) => q.id).join(",")}
        questions={run}
        grade={run[0].grade}
        timeLimitSec={null}
        title={`復習テスト（${run.length}問）`}
        examId="review"
        recordResult={false}
        showSubjectBreakdown={false}
        onExit={() => {
          load();
          setRun(null);
          window.scrollTo(0, 0);
        }}
        onRestart={() => {
          const ids = getWrongQuestionIds();
          const fresh = getQuestionsByIds(ids);
          setQuestions(fresh);
          setRun(shuffle(fresh).slice(0, MAX_PER_RUN));
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  if (!ready) {
    return <div className="max-w-2xl mx-auto px-4 py-10 text-gray-500">読み込み中…</div>;
  }

  const byCat: Record<string, BankQuestion[]> = {};
  for (const q of questions) {
    (byCat[q.category] ??= []).push(q);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-amber-400 mb-2">復習リスト（間違えた問題）</h1>
      <p className="text-gray-400 text-sm mb-8">
        模試・クイズ・ドリルで間違えた問題が自動でたまります。正解を重ねるとリストから外れます。
      </p>

      {questions.length === 0 ? (
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center">
          <p className="text-gray-300 mb-1">復習が必要な問題はありません 👍</p>
          <p className="text-gray-500 text-sm mb-5">
            まずは模試やクイズに挑戦しましょう。間違えるとここに記録されます。
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/exam" className="px-4 py-2.5 rounded-xl bg-amber-500 text-gray-950 font-bold text-sm hover:bg-amber-400">
              本番モードを受ける
            </Link>
            <Link href="/quiz" className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-200 font-semibold text-sm hover:bg-gray-700">
              ランダムクイズ
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 mb-8 flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-2xl font-extrabold text-gray-100">{questions.length} 問</p>
              <p className="text-xs text-gray-400">復習待ち（最大 {MAX_PER_RUN} 問ずつ出題）</p>
            </div>
            <button
              onClick={startRun}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-sm"
            >
              復習テストを始める →
            </button>
          </div>

          {CATEGORIES.filter((c) => byCat[c.id]?.length).map((c) => (
            <section key={c.id} className="mb-8">
              <h2 className="text-sm font-bold text-gray-300 mb-3">
                {CAT_NAME[c.id]} <span className="text-gray-600 font-normal">（{byCat[c.id].length}）</span>
              </h2>
              <div className="space-y-3">
                {byCat[c.id].map((q) => {
                  const stat = getAnswerStat(q.id);
                  return (
                    <div key={q.id} className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
                      <p className="text-xs text-gray-600 mb-1">
                        {"★".repeat(q.difficulty)}
                        {stat && <span className="ml-2">正 {stat.correct} / 誤 {stat.wrong}</span>}
                      </p>
                      <p className="text-sm text-gray-100 leading-relaxed mb-2.5 whitespace-pre-wrap">{q.question}</p>
                      <div className="space-y-1 mb-2.5">
                        {q.options.map((opt, oi) => (
                          <p
                            key={oi}
                            className={`text-xs ${oi === q.answer ? "text-green-300 font-semibold" : "text-gray-500"}`}
                          >
                            <span className="font-mono mr-1.5 opacity-60">{String.fromCharCode(65 + oi)}.</span>
                            {opt}
                            {oi === q.answer && <span className="ml-2 text-green-500">✓</span>}
                          </p>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed bg-gray-950/60 rounded-lg p-2.5 border border-gray-800">
                        <span className="font-semibold text-gray-300">解説：</span>
                        {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
