"use client";

import { useCallback, useMemo, useState } from "react";
import {
  CALC_TOPICS,
  generateDrill,
  type CalcProblem,
  type CalcTopicId,
} from "@/lib/calc-generator";
import { recordStudyToday } from "@/lib/progress";

const COUNT_OPTIONS = [5, 10, 20] as const;
const ALL_TOPIC_IDS = CALC_TOPICS.map((t) => t.id);

const optionLetter = (i: number) => String.fromCharCode(65 + i);

export default function CalcDrillPage() {
  const [selectedTopics, setSelectedTopics] = useState<CalcTopicId[]>(ALL_TOPIC_IDS);
  const [count, setCount] = useState<number>(10);

  const [problems, setProblems] = useState<CalcProblem[] | null>(null);
  const [selected, setSelected] = useState<(number | null)[]>([]);
  const [scored, setScored] = useState(false);

  const toggleTopic = (id: CalcTopicId) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const selectAllTopics = () => setSelectedTopics(ALL_TOPIC_IDS);
  const clearTopics = () => setSelectedTopics([]);

  const start = useCallback(() => {
    const topics = selectedTopics.length > 0 ? selectedTopics : ALL_TOPIC_IDS;
    const drill = generateDrill(count, topics);
    setProblems(drill);
    setSelected(Array(drill.length).fill(null));
    setScored(false);
  }, [count, selectedTopics]);

  const regenerate = useCallback(() => {
    const topics = selectedTopics.length > 0 ? selectedTopics : ALL_TOPIC_IDS;
    const drill = generateDrill(problems?.length ?? count, topics);
    setProblems(drill);
    setSelected(Array(drill.length).fill(null));
    setScored(false);
  }, [count, problems, selectedTopics]);

  const backToConfig = () => {
    setProblems(null);
    setSelected([]);
    setScored(false);
  };

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (scored) return;
    setSelected((prev) => {
      const next = [...prev];
      next[qIdx] = optIdx;
      return next;
    });
  };

  const allAnswered = problems !== null && selected.length > 0 && selected.every((s) => s !== null);
  const unanswered = selected.filter((s) => s === null).length;

  const score = useMemo(() => {
    if (!problems || !scored) return 0;
    return selected.filter((s, i) => s === problems[i].answer).length;
  }, [problems, scored, selected]);

  const handleScore = () => {
    if (!problems || !allAnswered) return;
    setScored(true);
    recordStudyToday();
  };

  // -------------------------------------------------------------------------
  // Config screen
  // -------------------------------------------------------------------------
  if (problems === null) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold text-amber-400 mb-3">計算ドリル</h1>
        <p className="text-gray-400 mb-8">
          毎回ランダムで数値が変わる計算問題。設備総合効率・稼働率・タクトタイム・MTBF/MTTR・
          オームの法則・電力・信頼度・不良率など、本番の計算問題対策を無限に繰り返せます。
        </p>

        <div className="space-y-6 p-6 bg-gray-900 rounded-2xl border border-gray-800">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-300">出題する単元</h3>
              <div className="flex gap-3 text-xs">
                <button
                  onClick={selectAllTopics}
                  className="text-amber-400 hover:text-amber-300 underline"
                >
                  すべて選択
                </button>
                <button
                  onClick={clearTopics}
                  className="text-gray-400 hover:text-gray-200 underline"
                >
                  クリア
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {CALC_TOPICS.map((t) => {
                const active = selectedTopics.includes(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => toggleTopic(t.id)}
                    title={t.desc}
                    className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
                      active
                        ? "bg-amber-500/20 border-amber-500 text-amber-300"
                        : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
            {selectedTopics.length === 0 && (
              <p className="mt-2 text-xs text-gray-500">未選択のときは全単元から出題します。</p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">問題数</h3>
            <div className="grid grid-cols-3 gap-2">
              {COUNT_OPTIONS.map((n) => (
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
            onClick={start}
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-base transition-colors"
          >
            {count}問でスタート →
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Quiz screen
  // -------------------------------------------------------------------------
  const total = problems.length;
  const passed = scored && score >= Math.ceil(total * 0.6);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">
          計算ドリル
          <span className="ml-3 text-sm text-gray-500 font-normal">{total}問</span>
        </h1>
        <button
          onClick={backToConfig}
          className="text-xs text-gray-400 hover:text-gray-200 underline"
        >
          条件を変更
        </button>
      </div>

      <div className="space-y-6">
        {problems.map((p, qIdx) => (
          <div key={qIdx} className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
            <div className="mb-3">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 text-[11px] font-semibold">
                {p.topicLabel}
              </span>
            </div>
            <p className="text-gray-100 font-medium mb-4 leading-relaxed">
              <span className="text-gray-500 mr-2">Q{qIdx + 1}.</span>
              {p.question}
            </p>
            <div className="space-y-2">
              {p.options.map((opt, optIdx) => {
                let cls =
                  "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-700";
                if (scored) {
                  if (optIdx === p.answer) {
                    cls = "bg-green-500/20 border-green-500 text-green-300";
                  } else if (optIdx === selected[qIdx] && selected[qIdx] !== p.answer) {
                    cls = "bg-red-500/20 border-red-500 text-red-300";
                  } else {
                    cls = "bg-gray-800 border-gray-700 text-gray-500";
                  }
                } else if (selected[qIdx] === optIdx) {
                  cls = "bg-amber-500/20 border-amber-500 text-amber-400";
                }
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelect(qIdx, optIdx)}
                    disabled={scored}
                    className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors ${cls}`}
                  >
                    <span className="font-mono mr-2 opacity-60">{optionLetter(optIdx)}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {scored && (
              <div className="mt-3 p-3 bg-gray-950 rounded-lg border border-gray-800">
                <p className="text-xs text-gray-300 mb-1">
                  <span className="font-semibold text-amber-300 mr-1">正解:</span>
                  {p.answerText}
                  <span
                    className={`ml-2 font-semibold ${
                      selected[qIdx] === p.answer ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {selected[qIdx] === p.answer ? "○ 正解" : "× 不正解"}
                  </span>
                </p>
                <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-line">
                  <span className="font-semibold text-gray-300">解き方:</span>
                  {"\n"}
                  {p.solution}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        {!scored ? (
          <button
            onClick={handleScore}
            disabled={!allAnswered}
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-gray-950 font-bold text-base transition-colors"
          >
            {allAnswered ? "採点する" : `あと${unanswered}問 回答してください`}
          </button>
        ) : (
          <div className="space-y-4">
            <div
              className={`p-5 rounded-2xl border text-center ${
                score === total
                  ? "bg-green-500/10 border-green-500"
                  : passed
                    ? "bg-yellow-500/10 border-yellow-500"
                    : "bg-red-500/10 border-red-500"
              }`}
            >
              <p className="text-3xl font-bold text-gray-100">
                {score} / {total}
              </p>
              <p
                className={`text-sm mt-1 ${
                  score === total ? "text-green-400" : passed ? "text-yellow-400" : "text-red-400"
                }`}
              >
                {score === total
                  ? "全問正解！この調子で本番も計算問題を確実に取りましょう。"
                  : passed
                    ? "合格ライン（約6割）クリア。間違えた問題の解き方を確認しましょう。"
                    : "もう少し。解き方をおさらいして再挑戦しましょう。"}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={regenerate}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-sm transition-colors"
              >
                もう一度（新しい問題）
              </button>
              <button
                onClick={backToConfig}
                className="flex-1 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold text-sm transition-colors"
              >
                条件を変更
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
