import type { ExamResult } from "@/lib/exam-types";
import type { CategoryId, Grade } from "@/lib/lessons-data";

const STORAGE_KEY = "jishu-hozen-progress";

export interface LessonProgress {
  completedAt: string;
  quizScore?: number;
}

export interface CategoryProgress {
  lessons: Record<string, LessonProgress>;
}

/** Per-question performance counter, keyed by BankQuestion id. */
export interface AnswerStat {
  correct: number;
  wrong: number;
  lastSeen: string;
}

export interface UserProgress {
  categories: Record<string, CategoryProgress>;
  pastExamScores?: Record<string, { score: number; total: number; date: string }>;
  flashcardStats?: Record<string, { knew: number; didnt: number; date: string }>;
  userName?: string;
  /** Full history of timed mock-exam attempts (newest last). */
  examResults?: ExamResult[];
  /** Per-question right/wrong counters for the spaced-review feature. */
  answerLog?: Record<string, AnswerStat>;
  /** Target exam date as YYYY-MM-DD. */
  examDate?: string;
  /** Days the user did any study activity, as YYYY-MM-DD strings. */
  studyDays?: string[];
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

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
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
  touchStudyDay(progress);
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
  touchStudyDay(progress);
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
  touchStudyDay(progress);
  saveProgress(progress);
}

// ---------------------------------------------------------------------------
// Timed mock exams (new exam runner)
// ---------------------------------------------------------------------------

export function saveExamResult(result: ExamResult) {
  const progress = getProgress();
  if (!progress.examResults) progress.examResults = [];
  progress.examResults.push(result);
  if (progress.examResults.length > 50) {
    progress.examResults = progress.examResults.slice(-50);
  }
  touchStudyDay(progress);
  saveProgress(progress);
}

export function getExamResults(grade?: Grade): ExamResult[] {
  const all = getProgress().examResults ?? [];
  return grade ? all.filter((r) => r.grade === grade) : all;
}

export function getBestExamPercent(grade?: Grade): number | null {
  const results = getExamResults(grade);
  if (results.length === 0) return null;
  return Math.max(...results.map((r) => r.percent));
}

export function getLatestExamResult(grade?: Grade): ExamResult | null {
  const results = getExamResults(grade);
  return results.length ? results[results.length - 1] : null;
}

// ---------------------------------------------------------------------------
// Per-question answer log → weak-area analysis & wrong-answer review
// ---------------------------------------------------------------------------

export function logAnswer(questionId: string, isCorrect: boolean) {
  const progress = getProgress();
  if (!progress.answerLog) progress.answerLog = {};
  const stat = progress.answerLog[questionId] ?? { correct: 0, wrong: 0, lastSeen: "" };
  if (isCorrect) stat.correct += 1;
  else stat.wrong += 1;
  stat.lastSeen = new Date().toISOString();
  progress.answerLog[questionId] = stat;
  saveProgress(progress);
}

/** Log a batch of answers in one write (used at the end of an exam). */
export function logAnswers(entries: Array<{ id: string; correct: boolean }>) {
  if (entries.length === 0) return;
  const progress = getProgress();
  if (!progress.answerLog) progress.answerLog = {};
  const now = new Date().toISOString();
  for (const e of entries) {
    const stat = progress.answerLog[e.id] ?? { correct: 0, wrong: 0, lastSeen: "" };
    if (e.correct) stat.correct += 1;
    else stat.wrong += 1;
    stat.lastSeen = now;
    progress.answerLog[e.id] = stat;
  }
  touchStudyDay(progress);
  saveProgress(progress);
}

export function getAnswerStat(questionId: string): AnswerStat | null {
  return getProgress().answerLog?.[questionId] ?? null;
}

export function getAnswerLog(): Record<string, AnswerStat> {
  return getProgress().answerLog ?? {};
}

/**
 * Question ids the user should review: anything gotten wrong at least once and not
 * yet clearly mastered (correct attempts have not pulled ahead by 2+).
 */
export function getWrongQuestionIds(): string[] {
  const log = getAnswerLog();
  return Object.entries(log)
    .filter(([, s]) => s.wrong > 0 && s.correct < s.wrong + 2)
    .sort((a, b) => b[1].wrong - a[1].wrong)
    .map(([id]) => id);
}

/**
 * Per-category accuracy from the answer log, given a map of questionId → category.
 * Returns categories sorted weakest-first; categories with no data are omitted.
 */
export function getCategoryAccuracy(
  questionCategoryMap: Record<string, CategoryId>
): Array<{ category: CategoryId; correct: number; total: number; percent: number }> {
  const log = getAnswerLog();
  const acc: Record<string, { correct: number; total: number }> = {};
  for (const [id, stat] of Object.entries(log)) {
    const cat = questionCategoryMap[id];
    if (!cat) continue;
    if (!acc[cat]) acc[cat] = { correct: 0, total: 0 };
    acc[cat].correct += stat.correct;
    acc[cat].total += stat.correct + stat.wrong;
  }
  return Object.entries(acc)
    .map(([category, v]) => ({
      category: category as CategoryId,
      correct: v.correct,
      total: v.total,
      percent: v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0,
    }))
    .sort((a, b) => a.percent - b.percent);
}

// ---------------------------------------------------------------------------
// Study planner — target exam date
// ---------------------------------------------------------------------------

export function setExamDate(date: string | null) {
  const progress = getProgress();
  if (date) progress.examDate = date;
  else delete progress.examDate;
  saveProgress(progress);
}

export function getExamDate(): string | null {
  return getProgress().examDate ?? null;
}

export function getDaysUntilExam(): number | null {
  const d = getExamDate();
  if (!d) return null;
  const target = new Date(d + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / 86_400_000);
}

// ---------------------------------------------------------------------------
// Study streak
// ---------------------------------------------------------------------------

function touchStudyDay(progress: UserProgress) {
  const key = todayKey();
  if (!progress.studyDays) progress.studyDays = [];
  if (!progress.studyDays.includes(key)) progress.studyDays.push(key);
  if (progress.studyDays.length > 400) {
    progress.studyDays = progress.studyDays.slice(-400);
  }
}

export function recordStudyToday() {
  const progress = getProgress();
  touchStudyDay(progress);
  saveProgress(progress);
}

export function getStudyDays(): string[] {
  return getProgress().studyDays ?? [];
}

/** Consecutive-day streak ending today (or yesterday — still "alive"). */
export function getStreak(): number {
  const days = new Set(getStudyDays());
  if (days.size === 0) return 0;
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  if (!days.has(cursor.toISOString().slice(0, 10))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(cursor.toISOString().slice(0, 10))) return 0;
  }
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function getTotalStudyDays(): number {
  return getStudyDays().length;
}

// ---------------------------------------------------------------------------
// Misc
// ---------------------------------------------------------------------------

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
