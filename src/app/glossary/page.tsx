"use client";

import { useMemo, useState } from "react";
import { FLASHCARDS, type FlashcardEntry } from "@/lib/flashcard-data";
import { CATEGORIES, type CategoryId, type Grade } from "@/lib/lessons-data";

export default function GlossaryPage() {
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState<Grade | "all">("all");
  const [category, setCategory] = useState<CategoryId | "all">("all");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return FLASHCARDS.filter((f) => {
      if (grade !== "all" && f.grade !== grade && f.grade !== "共通") return false;
      if (category !== "all" && f.category !== category) return false;
      if (
        q &&
        !f.term.toLowerCase().includes(q) &&
        !f.reading?.toLowerCase().includes(q) &&
        !f.definition.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [query, grade, category]);

  const grouped: Record<string, FlashcardEntry[]> = {};
  for (const f of filtered) {
    if (!grouped[f.category]) grouped[f.category] = [];
    grouped[f.category].push(f);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-amber-400 mb-3">用語集</h1>
      <p className="text-gray-400 mb-8">
        自主保全士試験で押さえておくべき重要用語を一覧できます。検索・絞り込みが可能。
      </p>

      <div className="space-y-4 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="用語を検索（例: TPM、5S、OEE）"
          className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-gray-100 placeholder-gray-500 focus:border-amber-500 focus:outline-none"
        />

        <div className="flex flex-wrap gap-2">
          {(["all", "2", "1"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGrade(g)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                grade === g
                  ? "bg-amber-500/20 border-amber-500 text-amber-300"
                  : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600"
              }`}
            >
              {g === "all" ? "全級" : `${g}級`}
            </button>
          ))}
          <span className="text-gray-700 self-center">|</span>
          <button
            onClick={() => setCategory("all")}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
              category === "all"
                ? "bg-amber-500/20 border-amber-500 text-amber-300"
                : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600"
            }`}
          >
            全科目
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                category === c.id
                  ? "bg-amber-500/20 border-amber-500 text-amber-300"
                  : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600"
              }`}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-500">
          {filtered.length} / {FLASHCARDS.length} 用語表示中
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-12">該当する用語がありません。</p>
      ) : (
        <div className="space-y-6">
          {CATEGORIES.map((c) =>
            grouped[c.id] && grouped[c.id].length > 0 ? (
              <section key={c.id}>
                <h2 className="text-lg font-bold text-amber-400 mb-3 flex items-center gap-2">
                  <span>{c.icon}</span>
                  <span>{c.name}</span>
                  <span className="text-xs text-gray-500 font-normal">
                    （{grouped[c.id].length}語）
                  </span>
                </h2>
                <dl className="grid gap-3 sm:grid-cols-2">
                  {grouped[c.id].map((f, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-amber-500/30 transition-colors"
                    >
                      <dt className="font-bold text-amber-400 mb-1 flex items-baseline gap-2">
                        <span>{f.term}</span>
                        {f.reading && (
                          <span className="text-xs text-gray-500 font-normal">
                            （{f.reading}）
                          </span>
                        )}
                      </dt>
                      <dd className="text-sm text-gray-300 leading-relaxed">{f.definition}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
