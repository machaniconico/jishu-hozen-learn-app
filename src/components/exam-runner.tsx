"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { BankQuestion } from "@/lib/exam-types";
import {
  PASS_LINE,
  SUBJECT_PASS_LINE,
  type ExamResult,
  type SubjectScore,
} from "@/lib/exam-types";
import type { Grade } from "@/lib/lessons-data";
import { CATEGORIES } from "@/lib/lessons-data";
import { logAnswers, saveExamResult } from "@/lib/progress";

interface ExamRunnerProps {
  questions: BankQuestion[];
  grade: Grade;
  /** seconds; null = untimed */
  timeLimitSec: number | null;
  title: string;
  /** id stored on the ExamResult, e.g. "g2-mock-50" or "review" */
  examId: string;
  /** persist an ExamResult to history (true for mock exams) */
  recordResult?: boolean;
  /** show subject-by-subject 足切り judgement (true for full mock exams) */
  showSubjectBreakdown?: boolean;
  onExit?: () => void;
  /** called when the user wants a fresh randomized run */
  onRestart?: () => void;
  /** called once when the exam is scored, with the full result */
  onFinish?: (result: ExamResult) => void;
}

const CAT_NAME: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, `${c.icon} ${c.name}`])
);

function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function ExamRunner({
  questions,
  grade,
  timeLimitSec,
  title,
  examId,
  recordResult = true,
  showSubjectBreakdown = true,
  onExit,
  onRestart,
  onFinish,
}: ExamRunnerProps) {
  const total = questions.length;
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(total).fill(null));
  const [cur, setCur] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const startRef = useRef<number>(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const finishedRef = useRef(false);
  const topRef = useRef<HTMLDivElement>(null);
  const [result_, setResult_] = useState<ExamResult | null>(null);

  const remaining = timeLimitSec != null ? Math.max(0, timeLimitSec - elapsed) : null;

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const secs = Math.round((Date.now() - startRef.current) / 1000);

    const bySub: Record<string, { correct: number; total: number }> = {};
    const wrongIds: string[] = [];
    let correct = 0;
    questions.forEach((q, i) => {
      const ok = answers[i] === q.answer;
      if (ok) correct++;
      else wrongIds.push(q.id);
      if (!bySub[q.category]) bySub[q.category] = { correct: 0, total: 0 };
      bySub[q.category].total++;
      if (ok) bySub[q.category].correct++;
    });
    const subjects: SubjectScore[] = CATEGORIES.filter((c) => bySub[c.id]).map((c) => {
      const v = bySub[c.id];
      const pct = Math.round((v.correct / v.total) * 100);
      return {
        category: c.id,
        correct: v.correct,
        total: v.total,
        percent: pct,
        passed: pct >= SUBJECT_PASS_LINE,
      };
    });
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed =
      percent >= PASS_LINE && (!showSubjectBreakdown || subjects.every((s) => s.passed));
    const result: ExamResult = {
      examId,
      grade,
      date: new Date().toISOString(),
      correct,
      total,
      percent,
      durationSec: timeLimitSec != null ? Math.min(secs, timeLimitSec) : secs,
      passed,
      subjects,
      wrongIds,
    };
    if (recordResult) saveExamResult(result);
    logAnswers(questions.map((q, i) => ({ id: q.id, correct: answers[i] === q.answer })));
    onFinish?.(result);
    setResult_(result);
    setFinished(true);
    setElapsed(result.durationSec);
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: "auto" }));
  }, [answers, questions, total, grade, examId, recordResult, showSubjectBreakdown, timeLimitSec, onFinish]);

  // timer
  useEffect(() => {
    if (finished) return;
    const id = setInterval(() => {
      const e = Math.round((Date.now() - startRef.current) / 1000);
      setElapsed(e);
      if (timeLimitSec != null && e >= timeLimitSec) finish();
    }, 1000);
    return () => clearInterval(id);
  }, [finished, timeLimitSec, finish]);

  const answeredCount = answers.filter((a) => a !== null).length;

  const select = (optIdx: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[cur] = optIdx;
      return next;
    });
  };

  const goto = (i: number) => {
    setCur(Math.max(0, Math.min(total - 1, i)));
    setShowGrid(false);
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: "auto" }));
  };

  const attemptFinish = () => {
    const left = total - answeredCount;
    if (left > 0 && !confirm(`未回答が ${left} 問あります。このまま採点しますか？`)) return;
    finish();
  };

  // ---------------------------------------------------------------- results
  if (finished && result_) {
    return (
      <ExamResultView
        result={result_}
        questions={questions}
        answers={answers}
        title={title}
        showSubjectBreakdown={showSubjectBreakdown}
        onExit={onExit}
        onRestart={onRestart}
        topRef={topRef}
      />
    );
  }

  // ---------------------------------------------------------------- running
  const q = questions[cur];
  const timeCritical = remaining != null && remaining <= 60;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6" ref={topRef}>
      {/* sticky header bar */}
      <div className="sticky top-14 z-30 -mx-4 px-4 py-3 bg-gray-950/95 backdrop-blur border-b border-gray-800 mb-6">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-gray-500 truncate">{title}</p>
            <p className="text-sm font-bold text-gray-100">
              第 <span className="text-amber-400">{cur + 1}</span> / {total} 問
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {remaining != null && (
              <div
                className={`px-3 py-1.5 rounded-lg font-mono text-sm font-bold tabular-nums ${
                  timeCritical ? "bg-red-500/20 text-red-300 animate-pulse" : "bg-gray-800 text-gray-200"
                }`}
              >
                ⏱ {fmtTime(remaining)}
              </div>
            )}
            <button
              onClick={() => setShowGrid((v) => !v)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700"
            >
              一覧 {answeredCount}/{total}
            </button>
          </div>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-gray-800 overflow-hidden">
          <div className="h-full bg-amber-500 transition-all" style={{ width: `${(answeredCount / total) * 100}%` }} />
        </div>
        {showGrid && (
          <div className="mt-3 grid grid-cols-10 gap-1.5">
            {questions.map((_, i) => {
              const a = answers[i] !== null;
              return (
                <button
                  key={i}
                  onClick={() => goto(i)}
                  className={`aspect-square rounded text-[11px] font-bold transition-colors ${
                    i === cur
                      ? "bg-amber-500 text-gray-950 ring-2 ring-amber-300"
                      : a
                      ? "bg-amber-500/25 text-amber-300 hover:bg-amber-500/40"
                      : "bg-gray-800 text-gray-500 hover:bg-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* question */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-600">{CAT_NAME[q.category]}</span>
          <span className="text-[10px] text-gray-700">·</span>
          <span className="text-[10px] text-gray-600">難易度 {"★".repeat(q.difficulty)}</span>
        </div>
        <p className="text-gray-100 text-[15px] leading-relaxed font-medium mb-5 whitespace-pre-wrap">{q.question}</p>
        <div className="space-y-2.5">
          {q.options.map((opt, oi) => {
            const sel = answers[cur] === oi;
            return (
              <button
                key={oi}
                onClick={() => select(oi)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm leading-relaxed transition-colors ${
                  sel
                    ? "bg-amber-500/20 border-amber-500 text-amber-100"
                    : "bg-gray-800/60 border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800"
                }`}
              >
                <span className="font-mono mr-2 opacity-60">{String.fromCharCode(65 + oi)}.</span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* nav */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => goto(cur - 1)}
          disabled={cur === 0}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← 前へ
        </button>
        {cur < total - 1 ? (
          <button
            onClick={() => goto(cur + 1)}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 text-gray-950 hover:bg-amber-400"
          >
            次の問題 →
          </button>
        ) : (
          <button
            onClick={attemptFinish}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-green-600 text-white hover:bg-green-500"
          >
            採点する
          </button>
        )}
      </div>
      <div className="mt-4 text-center">
        <button onClick={attemptFinish} className="text-xs text-gray-500 hover:text-gray-300 underline">
          ここで終了して採点する
        </button>
        {onExit && (
          <>
            <span className="mx-2 text-gray-700">·</span>
            <button onClick={onExit} className="text-xs text-gray-500 hover:text-gray-300 underline">
              中断する
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ===========================================================================
// Result view
// ===========================================================================

function ExamResultView({
  result,
  questions,
  answers,
  title,
  showSubjectBreakdown,
  onExit,
  onRestart,
  topRef,
}: {
  result: ExamResult;
  questions: BankQuestion[];
  answers: (number | null)[];
  title: string;
  showSubjectBreakdown: boolean;
  onExit?: () => void;
  onRestart?: () => void;
  topRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [filter, setFilter] = useState<"wrong" | "all">("wrong");
  const wrongSet = useMemo(() => new Set(result.wrongIds), [result.wrongIds]);
  const shown = questions
    .map((q, i) => ({ q, i }))
    .filter(({ q }) => (filter === "wrong" ? wrongSet.has(q.id) : true));

  const pass = result.passed;
  const failedSubjects = result.subjects.filter((s) => !s.passed);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8" ref={topRef}>
      {/* verdict */}
      <div
        className={`rounded-2xl border p-6 text-center mb-6 ${
          pass ? "bg-green-500/10 border-green-500/40" : "bg-red-500/10 border-red-500/40"
        }`}
      >
        <p className="text-xs text-gray-500 mb-1">{title}</p>
        <p className={`text-sm font-bold mb-2 ${pass ? "text-green-400" : "text-red-400"}`}>
          {pass ? "合格ライン到達 🎉" : "合格ライン未達"}
        </p>
        <p className="text-5xl font-extrabold text-gray-100 tabular-nums">
          {result.percent}
          <span className="text-2xl text-gray-400 ml-1">%</span>
        </p>
        <p className="text-sm text-gray-400 mt-2">
          {result.correct} / {result.total} 問正解 · 所要 {fmtTime(result.durationSec)}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          判定基準: 全体 {PASS_LINE}% 以上
          {showSubjectBreakdown ? ` ＋ 各科目 ${SUBJECT_PASS_LINE}% 以上（足切り）` : ""}
        </p>
        {!pass && failedSubjects.length > 0 && (
          <p className="text-xs text-red-400 mt-2">
            足切り: {failedSubjects.map((s) => CAT_NAME[s.category]).join("・")} が基準未満
          </p>
        )}
      </div>

      {/* subject breakdown */}
      {showSubjectBreakdown && result.subjects.length > 0 && (
        <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <h3 className="text-sm font-bold text-gray-200 mb-4">科目別スコア</h3>
          <div className="space-y-3">
            {result.subjects.map((s) => (
              <div key={s.category}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-300">{CAT_NAME[s.category]}</span>
                  <span className={s.passed ? "text-gray-400" : "text-red-400 font-semibold"}>
                    {s.correct}/{s.total}（{s.percent}%）{s.passed ? "" : " ⚠ 足切り"}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                  <div
                    className={`h-full transition-all ${s.passed ? "bg-green-500" : "bg-red-500"}`}
                    style={{ width: `${s.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        {onRestart && (
          <button
            onClick={onRestart}
            className="flex-1 min-w-[140px] px-4 py-3 rounded-xl text-sm font-bold bg-amber-500 text-gray-950 hover:bg-amber-400"
          >
            もう一度（新しい問題）
          </button>
        )}
        <Link
          href="/review"
          className="flex-1 min-w-[140px] px-4 py-3 rounded-xl text-sm font-semibold bg-gray-800 text-gray-200 hover:bg-gray-700 text-center"
        >
          間違えた問題を復習 →
        </Link>
        {onExit && (
          <button onClick={onExit} className="px-4 py-3 rounded-xl text-sm font-semibold bg-gray-800 text-gray-400 hover:bg-gray-700">
            設定に戻る
          </button>
        )}
      </div>

      {/* review list */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-200">解答の確認</h3>
        <div className="flex gap-1 text-xs">
          <button
            onClick={() => setFilter("wrong")}
            className={`px-2.5 py-1 rounded ${filter === "wrong" ? "bg-red-500/20 text-red-300" : "text-gray-500 hover:text-gray-300"}`}
          >
            間違いのみ（{result.wrongIds.length}）
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-2.5 py-1 rounded ${filter === "all" ? "bg-amber-500/20 text-amber-300" : "text-gray-500 hover:text-gray-300"}`}
          >
            すべて（{result.total}）
          </button>
        </div>
      </div>
      {shown.length === 0 ? (
        <p className="text-sm text-green-400 py-6 text-center">間違いはありません。完璧です！</p>
      ) : (
        <div className="space-y-3">
          {shown.map(({ q, i }) => {
            const user = answers[i];
            const ok = user === q.answer;
            return (
              <div
                key={q.id}
                className={`rounded-xl border p-4 ${ok ? "border-gray-800 bg-gray-900/60" : "border-red-500/30 bg-red-500/5"}`}
              >
                <p className="text-xs text-gray-600 mb-1">
                  Q{i + 1} · {CAT_NAME[q.category]} · {"★".repeat(q.difficulty)}
                </p>
                <p className="text-sm text-gray-100 leading-relaxed mb-3 whitespace-pre-wrap">{q.question}</p>
                <div className="space-y-1.5 mb-3">
                  {q.options.map((opt, oi) => {
                    const isAns = oi === q.answer;
                    const isUser = oi === user;
                    let cls = "text-gray-500";
                    if (isAns) cls = "text-green-300 font-semibold";
                    else if (isUser) cls = "text-red-300 line-through";
                    return (
                      <p key={oi} className={`text-xs ${cls}`}>
                        <span className="font-mono mr-1.5 opacity-60">{String.fromCharCode(65 + oi)}.</span>
                        {opt}
                        {isAns && <span className="ml-2 text-green-500">✓ 正解</span>}
                        {isUser && !isAns && <span className="ml-2 text-red-500">← あなたの解答</span>}
                      </p>
                    );
                  })}
                  {user === null && <p className="text-xs text-gray-600 italic">（未回答）</p>}
                </div>
                <p className="text-xs text-gray-400 leading-relaxed bg-gray-950/60 rounded-lg p-2.5 border border-gray-800">
                  <span className="font-semibold text-gray-300">解説：</span>
                  {q.explanation}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
