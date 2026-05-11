"use client";

import { useEffect, useState } from "react";
import {
  isLessonComplete,
  markLessonComplete,
  unmarkLessonComplete,
} from "@/lib/progress";

interface Props {
  categoryId: string;
  lessonId: string;
}

export function LessonCompleteButton({ categoryId, lessonId }: Props) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(categoryId, lessonId));
  }, [categoryId, lessonId]);

  const toggle = () => {
    if (done) {
      unmarkLessonComplete(categoryId, lessonId);
      setDone(false);
    } else {
      markLessonComplete(categoryId, lessonId);
      setDone(true);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${
        done
          ? "bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30"
          : "bg-amber-600 hover:bg-amber-500 text-white"
      }`}
    >
      {done ? "✓ 完了済み（クリックで取り消し）" : "このレッスンを完了にする"}
    </button>
  );
}
