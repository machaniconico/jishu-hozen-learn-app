import type { BankQuestion } from "@/lib/exam-types";
import type { Grade, CategoryId } from "@/lib/lessons-data";
import { CATEGORIES } from "@/lib/lessons-data";
import { BANK_SEISAN_KIHON } from "@/lib/banks/seisan-kihon";
import { BANK_LOSS_EFFICIENCY } from "@/lib/banks/loss-efficiency";
import { BANK_JISHU_HOZEN } from "@/lib/banks/jishu-hozen";
import { BANK_KAIZEN_KAISEKI } from "@/lib/banks/kaizen-kaiseki";
import { BANK_SETSUBI_HOZEN } from "@/lib/banks/setsubi-hozen";

/** Every multiple-choice question across all subjects and grades. */
export const QUESTION_BANK: BankQuestion[] = [
  ...BANK_SEISAN_KIHON,
  ...BANK_LOSS_EFFICIENCY,
  ...BANK_JISHU_HOZEN,
  ...BANK_KAIZEN_KAISEKI,
  ...BANK_SETSUBI_HOZEN,
];

const BY_ID = new Map(QUESTION_BANK.map((q) => [q.id, q]));

/** questionId → category, used by progress.ts for weak-area analysis. */
export const QUESTION_CATEGORY_MAP: Record<string, CategoryId> = Object.fromEntries(
  QUESTION_BANK.map((q) => [q.id, q.category])
);

export function getQuestionById(id: string): BankQuestion | undefined {
  return BY_ID.get(id);
}

export function getQuestionsByIds(ids: string[]): BankQuestion[] {
  return ids.map((id) => BY_ID.get(id)).filter((q): q is BankQuestion => !!q);
}

export interface BankFilter {
  grade?: Grade;
  category?: CategoryId;
  difficulty?: 1 | 2 | 3;
}

export function getBankQuestions(filter?: BankFilter): BankQuestion[] {
  return QUESTION_BANK.filter((q) => {
    if (filter?.grade && q.grade !== filter.grade) return false;
    if (filter?.category && q.category !== filter.category) return false;
    if (filter?.difficulty && q.difficulty !== filter.difficulty) return false;
    return true;
  });
}

/** Fisher–Yates shuffle (returns a new array). */
export function shuffle<T>(arr: readonly T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function pickRandom<T>(arr: readonly T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

/**
 * Build a randomized mock exam for one grade: spreads `totalCount` questions as
 * evenly as possible across the 5 subjects, drawing fresh random questions every
 * call. Falls back gracefully if some subject has fewer questions than its quota.
 */
export function buildMockExam(grade: Grade, totalCount: number): BankQuestion[] {
  const cats = CATEGORIES.map((c) => c.id);
  const perCat = Math.floor(totalCount / cats.length);
  let remainder = totalCount - perCat * cats.length;

  const chosen: BankQuestion[] = [];
  // shuffle category order so the remainder lands on different subjects each run
  for (const cat of shuffle(cats)) {
    const quota = perCat + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder--;
    const pool = getBankQuestions({ grade, category: cat });
    chosen.push(...pickRandom(pool, quota));
  }

  // If subjects were short on questions, top up from the rest of the grade's pool.
  if (chosen.length < totalCount) {
    const have = new Set(chosen.map((q) => q.id));
    const rest = getBankQuestions({ grade }).filter((q) => !have.has(q.id));
    chosen.push(...pickRandom(rest, totalCount - chosen.length));
  }

  return shuffle(chosen);
}

/** Random practice set across the whole bank (or a filtered slice). */
export function buildPracticeSet(count: number, filter?: BankFilter): BankQuestion[] {
  return pickRandom(getBankQuestions(filter), count);
}

export interface BankStats {
  total: number;
  byGrade: Record<Grade, number>;
  byCategory: Record<string, { "2": number; "1": number; total: number }>;
}

export function getBankStats(): BankStats {
  const byCategory: BankStats["byCategory"] = {};
  for (const c of CATEGORIES) byCategory[c.id] = { "2": 0, "1": 0, total: 0 };
  let g2 = 0;
  let g1 = 0;
  for (const q of QUESTION_BANK) {
    byCategory[q.category][q.grade] += 1;
    byCategory[q.category].total += 1;
    if (q.grade === "2") g2++;
    else g1++;
  }
  return { total: QUESTION_BANK.length, byGrade: { "2": g2, "1": g1 }, byCategory };
}
