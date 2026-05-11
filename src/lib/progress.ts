const STORAGE_KEY = "jishu-hozen-progress";

export interface LessonProgress {
  completedAt: string;
  quizScore?: number;
}

export interface CategoryProgress {
  lessons: Record<string, LessonProgress>;
}

export interface UserProgress {
  categories: Record<string, CategoryProgress>;
  pastExamScores?: Record<string, { score: number; total: number; date: string }>;
  flashcardStats?: Record<string, { knew: number; didnt: number; date: string }>;
  userName?: string;
}

function getProgress(): UserProgress {
  if (typeof window === "undefined") return { categories: {} };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // corrupted data
  }
  return { categories: {} };
}

function saveProgress(progress: UserProgress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function markLessonComplete(categoryId: string, lessonId: string, quizScore?: number) {
  const progress = getProgress();
  if (!progress.categories[categoryId]) {
    progress.categories[categoryId] = { lessons: {} };
  }
  progress.categories[categoryId].lessons[lessonId] = {
    completedAt: new Date().toISOString(),
    quizScore,
  };
  saveProgress(progress);
}

export function unmarkLessonComplete(categoryId: string, lessonId: string) {
  const progress = getProgress();
  if (progress.categories[categoryId]?.lessons[lessonId]) {
    delete progress.categories[categoryId].lessons[lessonId];
    saveProgress(progress);
  }
}

export function isLessonComplete(categoryId: string, lessonId: string): boolean {
  const progress = getProgress();
  return !!progress.categories[categoryId]?.lessons[lessonId];
}

export function getLessonProgress(categoryId: string, lessonId: string): LessonProgress | null {
  const progress = getProgress();
  return progress.categories[categoryId]?.lessons[lessonId] || null;
}

export function getCategoryCompletionCount(
  categoryId: string,
  totalLessons: number
): { completed: number; total: number; percent: number } {
  const progress = getProgress();
  const completed = Object.keys(progress.categories[categoryId]?.lessons || {}).length;
  return {
    completed,
    total: totalLessons,
    percent: totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0,
  };
}

export function isCategoryComplete(categoryId: string, totalLessons: number): boolean {
  const { completed, total } = getCategoryCompletionCount(categoryId, totalLessons);
  return completed >= total && total > 0;
}

export function getOverallProgress(
  categoriesWithCounts: Array<{ id: string; lessonCount: number }>
): {
  completedLessons: number;
  totalLessons: number;
  completedCategories: number;
  totalCategories: number;
  percent: number;
} {
  let completedLessons = 0;
  let totalLessons = 0;
  let completedCategories = 0;

  for (const cat of categoriesWithCounts) {
    const { completed, total } = getCategoryCompletionCount(cat.id, cat.lessonCount);
    completedLessons += completed;
    totalLessons += total;
    if (completed >= total && total > 0) completedCategories++;
  }

  return {
    completedLessons,
    totalLessons,
    completedCategories,
    totalCategories: categoriesWithCounts.length,
    percent: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
  };
}

export function savePastExamScore(examId: string, score: number, total: number) {
  const progress = getProgress();
  if (!progress.pastExamScores) progress.pastExamScores = {};
  progress.pastExamScores[examId] = {
    score,
    total,
    date: new Date().toISOString(),
  };
  saveProgress(progress);
}

export function getPastExamScore(examId: string) {
  return getProgress().pastExamScores?.[examId] ?? null;
}

export function saveFlashcardStats(deckId: string, knew: number, didnt: number) {
  const progress = getProgress();
  if (!progress.flashcardStats) progress.flashcardStats = {};
  progress.flashcardStats[deckId] = {
    knew,
    didnt,
    date: new Date().toISOString(),
  };
  saveProgress(progress);
}

export function setUserName(name: string) {
  const progress = getProgress();
  progress.userName = name;
  saveProgress(progress);
}

export function getUserName(): string {
  return getProgress().userName || "";
}

export function resetAllProgress() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
