"use client";

import { useState } from "react";

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}

interface QuizProps {
  questions: QuizQuestion[];
  color?: string;
  onComplete?: (score: number) => void;
}

const colorMap: Record<string, string> = {
  amber: "bg-amber-500/20 border-amber-500 text-amber-400",
  orange: "bg-orange-500/20 border-orange-500 text-orange-400",
  green: "bg-green-500/20 border-green-500 text-green-400",
  blue: "bg-blue-500/20 border-blue-500 text-blue-400",
  red: "bg-red-500/20 border-red-500 text-red-400",
  purple: "bg-purple-500/20 border-purple-500 text-purple-400",
  cyan: "bg-cyan-500/20 border-cyan-500 text-cyan-400",
};

const correctClass = "bg-green-500/20 border-green-500 text-green-300";
const wrongClass = "bg-red-500/20 border-red-500 text-red-300";
const defaultClass =
  "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-700";

export function Quiz({ questions, color = "amber", onComplete }: QuizProps) {
  const [selected, setSelected] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);

  const accentClass = colorMap[color] ?? colorMap.amber;

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    setSelected((prev) => {
      const next = [...prev];
      next[qIdx] = optIdx;
      return next;
    });
  };

  const handleSubmit = () => {
    if (selected.some((s) => s === null)) return;
    setSubmitted(true);
    if (onComplete) {
      const score = selected.filter((s, i) => s === questions[i].answer).length;
      onComplete(score);
    }
  };

  const handleReset = () => {
    setSelected(Array(questions.length).fill(null));
    setSubmitted(false);
  };

  const score = submitted
    ? selected.filter((s, i) => s === questions[i].answer).length
    : 0;

  return (
    <div className="mt-8 space-y-6">
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold ${accentClass}`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
        確認クイズ
      </div>

      <div className="space-y-6">
        {questions.map((q, qIdx) => (
          <div key={qIdx} className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
            <p className="text-gray-100 font-medium mb-4 leading-relaxed">
              <span className="text-gray-500 mr-2">Q{qIdx + 1}.</span>
              {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, optIdx) => {
                let cls = defaultClass;
                if (submitted) {
                  if (optIdx === q.answer) {
                    cls = correctClass;
                  } else if (optIdx === selected[qIdx] && selected[qIdx] !== q.answer) {
                    cls = wrongClass;
                  } else {
                    cls = "bg-gray-800 border-gray-700 text-gray-500";
                  }
                } else if (selected[qIdx] === optIdx) {
                  cls = accentClass;
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelect(qIdx, optIdx)}
                    disabled={submitted}
                    className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors ${cls}`}
                  >
                    <span className="font-mono mr-2 opacity-60">
                      {String.fromCharCode(65 + optIdx)}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {submitted && q.explanation && (
              <div className="mt-3 p-3 bg-gray-900 rounded-lg border border-gray-700">
                <p className="text-xs text-gray-400 leading-relaxed">
                  <span className="font-semibold text-gray-300 mr-1">解説:</span>
                  {q.explanation}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={selected.some((s) => s === null)}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-colors bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white"
        >
          {selected.some((s) => s === null)
            ? `あと${selected.filter((s) => s === null).length}問回答してください`
            : "回答を確認する"}
        </button>
      ) : (
        <div className="space-y-4">
          <div
            className={`p-4 rounded-xl border text-center ${
              score === questions.length
                ? "bg-green-500/10 border-green-500"
                : score >= questions.length / 2
                ? "bg-yellow-500/10 border-yellow-500"
                : "bg-red-500/10 border-red-500"
            }`}
          >
            <p className="text-2xl font-bold text-gray-100">
              {score} / {questions.length}
            </p>
            <p
              className={`text-sm mt-1 ${
                score === questions.length
                  ? "text-green-400"
                  : score >= questions.length / 2
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {score === questions.length
                ? "全問正解！素晴らしい！"
                : score >= questions.length / 2
                ? "もう少しです！"
                : "復習してもう一度挑戦しましょう"}
            </p>
          </div>
          <button
            onClick={handleReset}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-colors bg-gray-700 hover:bg-gray-600 text-gray-200"
          >
            もう一度挑戦する
          </button>
        </div>
      )}
    </div>
  );
}
