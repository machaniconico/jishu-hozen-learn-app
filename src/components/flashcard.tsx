"use client";

import { useState } from "react";

export interface FlashcardItem {
  term: string;
  reading?: string;
  definition: string;
  category?: string;
  grade?: "2" | "1" | "共通";
}

interface FlashcardDeckProps {
  cards: FlashcardItem[];
  deckId: string;
  onFinish?: (knew: number, didnt: number) => void;
}

export function FlashcardDeck({ cards, deckId: _deckId, onFinish }: FlashcardDeckProps) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knew, setKnew] = useState(0);
  const [didnt, setDidnt] = useState(0);
  const [finished, setFinished] = useState(false);
  const [shuffled, setShuffled] = useState(() => cards);

  const card = shuffled[idx];

  const next = (knewThis: boolean) => {
    if (knewThis) setKnew((k) => k + 1);
    else setDidnt((d) => d + 1);
    if (idx + 1 >= shuffled.length) {
      setFinished(true);
      if (onFinish) onFinish(knewThis ? knew + 1 : knew, knewThis ? didnt : didnt + 1);
    } else {
      setIdx((i) => i + 1);
      setFlipped(false);
    }
  };

  const restart = (shuffleAgain: boolean) => {
    setIdx(0);
    setFlipped(false);
    setKnew(0);
    setDidnt(0);
    setFinished(false);
    if (shuffleAgain) {
      const arr = [...cards];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      setShuffled(arr);
    } else {
      setShuffled(cards);
    }
  };

  if (cards.length === 0) {
    return <p className="text-gray-500 text-sm">フラッシュカードがありません。</p>;
  }

  if (finished) {
    const total = knew + didnt;
    const percent = total > 0 ? Math.round((knew / total) * 100) : 0;
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center space-y-6">
        <div className="text-6xl">🎉</div>
        <h2 className="text-2xl font-bold text-gray-100">学習完了！</h2>
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <div className="p-4 bg-green-500/10 border border-green-500/40 rounded-xl">
            <div className="text-3xl font-bold text-green-400">{knew}</div>
            <div className="text-xs text-gray-400 mt-1">わかった</div>
          </div>
          <div className="p-4 bg-red-500/10 border border-red-500/40 rounded-xl">
            <div className="text-3xl font-bold text-red-400">{didnt}</div>
            <div className="text-xs text-gray-400 mt-1">復習が必要</div>
          </div>
        </div>
        <p className="text-amber-400 font-semibold">正解率 {percent}%</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => restart(true)}
            className="px-6 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm transition-colors"
          >
            シャッフルしてもう一度
          </button>
          <button
            onClick={() => restart(false)}
            className="px-6 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold text-sm transition-colors"
          >
            同じ順序でもう一度
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          {idx + 1} / {shuffled.length} 枚
        </span>
        <span className="flex gap-3">
          <span className="text-green-400">○ {knew}</span>
          <span className="text-red-400">× {didnt}</span>
        </span>
      </div>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="w-full min-h-[280px] bg-gradient-to-br from-amber-500/10 to-orange-600/10 border-2 border-amber-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-transform hover:scale-[1.01]"
      >
        {!flipped ? (
          <>
            {card.grade && (
              <span className="inline-block mb-3 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-semibold">
                {card.grade === "共通" ? "共通" : `${card.grade}級`}
              </span>
            )}
            <p className="text-3xl sm:text-4xl font-bold text-gray-100 mb-2">{card.term}</p>
            {card.reading && (
              <p className="text-sm text-gray-400 mb-3">（{card.reading}）</p>
            )}
            <p className="text-xs text-gray-500 mt-6">タップで意味を表示</p>
          </>
        ) : (
          <>
            <p className="text-sm text-amber-400 mb-3 font-semibold">{card.term}</p>
            <p className="text-base sm:text-lg text-gray-200 leading-relaxed whitespace-pre-wrap">
              {card.definition}
            </p>
            <p className="text-xs text-gray-500 mt-6">タップで戻る</p>
          </>
        )}
      </button>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => next(false)}
          className="py-3 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20 font-semibold text-sm transition-colors"
        >
          ✕ 復習が必要
        </button>
        <button
          onClick={() => next(true)}
          className="py-3 rounded-xl border border-green-500/40 bg-green-500/10 text-green-400 hover:bg-green-500/20 font-semibold text-sm transition-colors"
        >
          ○ わかった
        </button>
      </div>
    </div>
  );
}
