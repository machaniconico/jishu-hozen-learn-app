"use client";

import { useMemo, useState } from "react";
import { Quiz } from "@/components/quiz";
import { CATEGORIES, type Grade, type CategoryId } from "@/lib/lessons-data";
import { getQuizPool, shuffleQuestions } from "@/lib/quiz-pool";

const QUESTION_COUNTS = [5, 10, 20];

export default function QuizPage() {
  const [grade, setGrade] = useState<Grade | "all">("all");
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [count, setCount] = useState(10);
  const [started, setStarted] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);

  const questions = useMemo(() => {
    const filter: { grade?: Grade; category?: CategoryId } = {};
    if (grade !== "all") filter.grade = grade;
    if (category !== "all") filter.category = category;
    const pool = getQuizPool(filter);
    return shuffleQuestions(pool, count);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade, category, count, sessionKey]);

  if (started) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-100">
            ランダムクイズ
            <span className="ml-3 text-sm text-gray-500 font-normal">{questions.length}問</span>
          </h1>
          <button
            onClick={() => {
              setStarted(false);
              setSessionKey((k) => k + 1);
            }}
            className="text-xs text-gray-400 hover:text-gray-200 underline"
          >
            条件を変更
          </button>
        </div>
        {questions.length === 0 ? (
          <p className="text-gray-500">該当する問題がありません。</p>
        ) : (
          <Quiz key={sessionKey} questions={questions} color="amber" />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-amber-400 mb-3">ランダムクイズ</h1>
      <p className="text-gray-400 mb-8">
        全レッスンから出題されるクイズで実力をチェック。級・科目・問題数を選んでスタートしましょう。
      </p>

      <div className="space-y-6 p-6 bg-gray-900 rounded-2xl border border-gray-800">
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">級</h3>
          <div className="grid grid-cols-3 gap-2">
            {(["all", "2", "1"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGrade(g)}
                className={`py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
                  grade === g
                    ? "bg-amber-500/20 border-amber-500 text-amber-300"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                }`}
              >
                {g === "all" ? "両方" : `${g}級`}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">科目</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              onClick={() => setCategory("all")}
              className={`py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
                category === "all"
                  ? "bg-amber-500/20 border-amber-500 text-amber-300"
                  : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
              }`}
            >
              全科目
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
                  category === c.id
                    ? "bg-amber-500/20 border-amber-500 text-amber-300"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                }`}
              >
                {c.icon} {c.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">問題数</h3>
          <div className="grid grid-cols-3 gap-2">
            {QUESTION_COUNTS.map((n) => (
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
        </div>

        <button
          onClick={() => setStarted(true)}
          disabled={questions.length === 0}
          className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-gray-700 disabled:text-gray-500 text-gray-950 font-bold text-base transition-colors"
        >
          {questions.length === 0 ? "該当問題なし" : `${questions.length}問でスタート →`}
        </button>
      </div>
    </div>
  );
}
