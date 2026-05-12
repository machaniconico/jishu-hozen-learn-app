import type { Grade, CategoryId } from "@/lib/lessons-data";

/** A single multiple-choice question stored in the master question bank. */
export interface BankQuestion {
  /** Stable unique id, e.g. "g2-seisan-001". Used for the wrong-answer review log. */
  id: string;
  grade: Grade;
  category: CategoryId;
  /** Difficulty: 1 = 基礎, 2 = 標準, 3 = 応用 */
  difficulty: 1 | 2 | 3;
  /** Optional fine-grained topic tag (e.g. "5S", "OEE", "潤滑"). */
  topic?: string;
  question: string;
  /** Always 4 options. */
  options: [string, string, string, string];
  /** Index (0-3) of the correct option. */
  answer: number;
  /** Required — every question explains why. */
  explanation: string;
}

/** Subject-level score breakdown produced after an exam attempt. */
export interface SubjectScore {
  category: CategoryId;
  correct: number;
  total: number;
  /** percent 0-100 */
  percent: number;
  /** true if this subject met the per-subject 足切り line */
  passed: boolean;
}

/** Result of one mock-exam attempt. */
export interface ExamResult {
  examId: string;
  grade: Grade;
  date: string;
  correct: number;
  total: number;
  percent: number;
  /** seconds elapsed */
  durationSec: number;
  /** overall pass = total% >= passLine AND every subject% >= subjectLine */
  passed: boolean;
  subjects: SubjectScore[];
  /** ids of questions answered incorrectly */
  wrongIds: string[];
}

/** Passing thresholds used by the exam runner. JIPM publishes ~60% per subject. */
export const PASS_LINE = 60; // overall %
export const SUBJECT_PASS_LINE = 50; // per-subject % 足切り
