"use client";

import { useState } from "react";
import { Quiz } from "@/components/quiz";
import { EXAM_SETS, type ExamSet } from "@/lib/past-exam-data";
import { savePastExamScore } from "@/lib/progress";

export default function PastExamPage() {
  const [activeExam, setActiveExam] = useState<ExamSet | null>(null);
  const [sessionKey, setSessionKey] = useState(0);

  if (activeExam) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">{activeExam.title}</h1>
            <p className="text-xs text-gray-500 mt-1">
              全{activeExam.questions.length}問・本番形式
            </p>
          </div>
          <button
            onClick={() => {
              setActiveExam(null);
              setSessionKey((k) => k + 1);
            }}
            className="text-xs text-gray-400 hover:text-gray-200 underline"
          >
            別の試験を選ぶ
          </button>
        </div>
        <Quiz
          key={sessionKey}
          questions={activeExam.questions}
          color="red"
          onComplete={(score) =>
            savePastExamScore(activeExam.id, score, activeExam.questions.length)
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-amber-400 mb-3">模擬試験</h1>
      <p className="text-gray-400 mb-8">
        本番形式の問題で実力チェック。間違えた問題は解説を読んで弱点を補強しましょう。
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
                    isG2
                      ? "bg-green-500/15 border-green-500/40 text-green-400"
                      : "bg-red-500/15 border-red-500/40 text-red-400"
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
                  setActiveExam(exam);
                  setSessionKey((k) => k + 1);
                }}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${
                  isG2 ? "bg-green-600 hover:bg-green-500 text-white" : "bg-red-600 hover:bg-red-500 text-white"
                }`}
              >
                受験する →
              </button>
            </div>
          );
        })}
      </div>

      <section className="mt-12 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30">
        <h2 className="text-lg font-bold text-amber-400 mb-2">本番試験の概要</h2>
        <ul className="space-y-1 text-sm text-gray-300">
          <li>● 主催: 公益社団法人 日本プラントメンテナンス協会（JIPM）</li>
          <li>● 形式: 学科試験（マークシート）＋実技試験</li>
          <li>● 出題範囲: 4つの能力（異常発見・処置回復・条件設定・維持管理）× 5科目</li>
          <li>● 合格基準: おおむね70%以上（年度により変動）</li>
        </ul>
      </section>
    </div>
  );
}
