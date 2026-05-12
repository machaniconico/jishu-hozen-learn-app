"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORIES, type Grade, type CategoryId } from "@/lib/lessons-data";
import {
  PRACTICAL_CASES,
  getPracticalCases,
  ABILITIES,
  type PracticalCase,
} from "@/lib/practical-data";
import { recordStudyToday } from "@/lib/progress";

const CAT_NAME: Record<string, string> = Object.fromEntries(CATEGORIES.map((c) => [c.id, `${c.icon} ${c.name}`]));
const ABILITY_NAME: Record<string, string> = Object.fromEntries(ABILITIES.map((a) => [a.id, a.label]));

export default function PracticalPage() {
  const [grade, setGrade] = useState<Grade | "all">("all");
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [active, setActive] = useState<PracticalCase | null>(null);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [checked, setChecked] = useState<boolean[]>([]);

  const list = useMemo(() => {
    const f: { grade?: Grade; category?: CategoryId } = {};
    if (grade !== "all") f.grade = grade;
    if (category !== "all") f.category = category;
    return getPracticalCases(f);
  }, [grade, category]);

  const open = (c: PracticalCase) => {
    setActive(c);
    setAnswer("");
    setRevealed(false);
    setChecked(Array(c.rubric.length).fill(false));
    window.scrollTo(0, 0);
  };

  const openRandom = () => {
    if (list.length === 0) return;
    open(list[Math.floor(Math.random() * list.length)]);
  };

  const reveal = () => {
    setRevealed(true);
    recordStudyToday();
    window.scrollTo(0, 0);
  };

  if (active) {
    const score = checked.filter(Boolean).length;
    const pct = active.rubric.length ? Math.round((score / active.rubric.length) * 100) : 0;
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
          <button onClick={() => setActive(null)} className="text-xs text-gray-400 hover:text-gray-200 underline">← 一覧に戻る</button>
          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <span>{CAT_NAME[active.category]}</span>
            <span>·</span>
            <span>{active.grade}級</span>
            <span>·</span>
            <span>{ABILITY_NAME[active.ability]}</span>
          </div>
        </div>

        <h1 className="text-xl font-bold text-gray-100 mb-4">{active.title}</h1>

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">状況</p>
          <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{active.scenario}</p>
        </div>
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 mb-5">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">設問</p>
          <p className="text-sm text-gray-100 leading-relaxed whitespace-pre-wrap">{active.prompt}</p>
        </div>

        {!revealed ? (
          <>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={10}
              placeholder="ここに記述で解答してみましょう。要点を箇条書きで整理してから書くのがコツです。"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-sm text-gray-100 leading-relaxed resize-y focus:border-amber-500 focus:outline-none"
            />
            <div className="flex items-center justify-between mt-2 mb-5">
              <span className="text-xs text-gray-600">{answer.trim().length} 文字</span>
            </div>
            <button
              onClick={reveal}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-sm"
            >
              模範解答と採点ポイントを見る
            </button>
            <p className="text-xs text-gray-600 mt-3 text-center">※ 本番は記述式。要点（採点ポイント）をどれだけ押さえられたかが評価基準です。</p>
          </>
        ) : (
          <div className="space-y-5">
            {answer.trim() && (
              <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">あなたの解答</p>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{answer}</p>
              </div>
            )}

            <div className="rounded-2xl border border-gray-700 bg-gray-900 p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">模範解答</p>
              <p className="text-sm text-gray-100 leading-relaxed whitespace-pre-wrap">{active.modelAnswer}</p>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">採点ポイント（自己採点）</p>
                <span className="text-sm font-bold text-gray-100">{score} / {active.rubric.length}（{pct}%）</span>
              </div>
              <div className="space-y-2.5">
                {active.rubric.map((r, i) => (
                  <label key={i} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked[i] ?? false}
                      onChange={() => setChecked((prev) => prev.map((v, j) => (j === i ? !v : v)))}
                      className="mt-1 accent-amber-500 w-4 h-4 shrink-0"
                    />
                    <span>
                      <span className={`text-sm font-medium ${checked[i] ? "text-gray-100" : "text-gray-300"}`}>{r.point}</span>
                      <span className="block text-xs text-gray-500 leading-relaxed mt-0.5">{r.detail}</span>
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">
                {pct >= 80 ? "十分です。本番でもこの調子で要点を漏らさず書けば合格圏。" : pct >= 50 ? "あと一歩。漏れた要点を模範解答で確認しましょう。" : "要点の取りこぼしが多めです。模範解答の構成をまねて書き直してみましょう。"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={() => open(active)} className="flex-1 min-w-[120px] py-3 rounded-xl bg-gray-800 text-gray-200 font-semibold text-sm hover:bg-gray-700">この問題をもう一度</button>
              <button onClick={openRandom} className="flex-1 min-w-[120px] py-3 rounded-xl bg-amber-500 text-gray-950 font-bold text-sm hover:bg-amber-400">別の問題（ランダム）</button>
              <button onClick={() => setActive(null)} className="py-3 px-4 rounded-xl bg-gray-800 text-gray-400 font-semibold text-sm hover:bg-gray-700">一覧へ</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const byCat: Record<string, PracticalCase[]> = {};
  for (const c of list) (byCat[c.category] ??= []).push(c);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-amber-400 mb-2">実技（記述）対策</h1>
      <p className="text-gray-400 text-sm mb-1">
        現場の状況に対して「どう考え、どう対処するか」を記述で答える練習。模範解答と採点ポイントで自己採点できます。
      </p>
      <p className="text-gray-600 text-xs mb-8">収録ケース: {PRACTICAL_CASES.length}件 — 自主保全士の4能力（異常発見・処置回復・条件設定・維持管理）を網羅</p>

      {PRACTICAL_CASES.length === 0 ? (
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center text-gray-400">実技ケースを準備中です。</div>
      ) : (
        <>
          <div className="space-y-4 p-5 bg-gray-900 rounded-2xl border border-gray-800 mb-8">
            <div>
              <h3 className="text-xs font-semibold text-gray-400 mb-2">級</h3>
              <div className="grid grid-cols-3 gap-2">
                {(["all", "2", "1"] as const).map((g) => (
                  <button key={g} onClick={() => setGrade(g)} className={`py-2 rounded-lg border text-sm font-semibold transition-colors ${grade === g ? "bg-amber-500/20 border-amber-500 text-amber-300" : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"}`}>
                    {g === "all" ? "両方" : `${g}級`}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-400 mb-2">科目</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button onClick={() => setCategory("all")} className={`py-2 rounded-lg border text-sm font-semibold transition-colors ${category === "all" ? "bg-amber-500/20 border-amber-500 text-amber-300" : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"}`}>全科目</button>
                {CATEGORIES.map((c) => (
                  <button key={c.id} onClick={() => setCategory(c.id)} className={`py-2 rounded-lg border text-xs sm:text-sm font-semibold transition-colors ${category === c.id ? "bg-amber-500/20 border-amber-500 text-amber-300" : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"}`}>
                    {c.icon} {c.name}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={openRandom} disabled={list.length === 0} className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-gray-700 disabled:text-gray-500 text-gray-950 font-bold text-sm">
              {list.length === 0 ? "該当ケースなし" : "ランダムで1問やる →"}
            </button>
          </div>

          {CATEGORIES.filter((c) => byCat[c.id]?.length).map((c) => (
            <section key={c.id} className="mb-8">
              <h2 className="text-sm font-bold text-gray-300 mb-3">{c.icon} {c.name} <span className="text-gray-600 font-normal">（{byCat[c.id].length}）</span></h2>
              <div className="space-y-2">
                {byCat[c.id].map((cs) => (
                  <button key={cs.id} onClick={() => open(cs)} className="w-full text-left p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-amber-500/40 transition-colors">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-gray-100 font-medium">{cs.title}</span>
                      <span className="text-[10px] text-gray-600 shrink-0">{cs.grade}級 · {ABILITY_NAME[cs.ability]}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cs.scenario}</p>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </>
      )}

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <Link href="/exam" className="text-amber-400 hover:text-amber-300">→ 学科の本番モード</Link>
        <Link href="/cheatsheet" className="text-amber-400 hover:text-amber-300">→ 直前チートシート</Link>
      </div>
    </div>
  );
}
