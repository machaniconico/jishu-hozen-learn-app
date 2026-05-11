import type { QuizQuestion } from "@/components/quiz";
import { ALL_LESSONS, type Grade, type CategoryId } from "@/lib/lessons-data";

export interface PoolQuestion extends QuizQuestion {
  grade: Grade;
  category: CategoryId;
  lessonId: string;
  lessonTitle: string;
}

export function getQuizPool(filter?: { grade?: Grade; category?: CategoryId }): PoolQuestion[] {
  const out: PoolQuestion[] = [];
  for (const lesson of ALL_LESSONS) {
    if (filter?.grade && lesson.grade !== filter.grade) continue;
    if (filter?.category && lesson.category !== filter.category) continue;
    if (!lesson.quiz) continue;
    for (const q of lesson.quiz) {
      out.push({
        ...q,
        grade: lesson.grade,
        category: lesson.category,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
      });
    }
  }
  return out;
}

export function shuffleQuestions<T>(arr: T[], count?: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return count ? copy.slice(0, count) : copy;
}
