"use client";

import { useMemo, useState } from "react";
import { FlashcardDeck } from "@/components/flashcard";
import { CATEGORIES, type CategoryId, type Grade } from "@/lib/lessons-data";
import { FLASHCARDS } from "@/lib/flashcard-data";
import { saveFlashcardStats } from "@/lib/progress";

export default function FlashcardsPage() {
  const [grade, setGrade] = useState<Grade | "all">("all");
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [started, setStarted] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);

  const cards = useMemo(() => {
    return FLASHCARDS.filter((c) => {
      if (grade !== "all" && c.grade !== grade && c.grade !== "共通") return false;
      if (category !== "all" && c.category !== category) return false;
      return true;
    });
  }, [grade, category]);

  const deckId = `${grade}-${category}`;

  if (started) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-100">
            フラッシュカード
            <span className="ml-3 text-sm text-gray-500 font-normal">{cards.length}枚</span>
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
        {cards.length === 0 ? (
          <p className="text-gray-500">該当するカードがありません。</p>
        ) : (
          <FlashcardDeck
            key={sessionKey}
            cards={cards}
            deckId={deckId}
            onFinish={(knew, didnt) => saveFlashcardStats(deckId, knew, didnt)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-amber-400 mb-3">フラッシュカード</h1>
      <p className="text-gray-400 mb-8">
        重要用語を暗記。カードをめくって「わかった」「復習が必要」をマーキングし、効率的に学習。
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

        <div className="p-4 bg-gray-800/50 rounded-lg text-sm text-gray-400">
          <p>抽出される枚数: <span className="text-amber-400 font-bold">{cards.length}</span> 枚</p>
        </div>

        <button
          onClick={() => setStarted(true)}
          disabled={cards.length === 0}
          className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-gray-700 disabled:text-gray-500 text-gray-950 font-bold text-base transition-colors"
        >
          {cards.length === 0 ? "該当カードなし" : `${cards.length}枚でスタート →`}
        </button>
      </div>
    </div>
  );
}
