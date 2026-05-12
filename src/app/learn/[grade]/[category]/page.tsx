import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonList } from "@/components/lesson-list";
import { ProgressBar } from "@/components/progress-bar";
import { GradeBadge } from "@/components/difficulty-badge";
import {
  CATEGORIES,
  getLessons,
  getCategoryInfo,
  getCategoryStorageId,
  getAllCategoryParams,
  type Grade,
  type CategoryId,
} from "@/lib/lessons-data";
import { getSyllabusForCategory } from "@/lib/exam-syllabus";

export function generateStaticParams() {
  return getAllCategoryParams();
}

interface PageProps {
  params: Promise<{ grade: string; category: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { grade: gradeParam, category: categoryParam } = await params;
  const grade = gradeParam as Grade;
  const category = categoryParam as CategoryId;

  const categoryInfo = getCategoryInfo(category);
  const lessons = getLessons(grade, category);

  if (!categoryInfo || lessons.length === 0) notFound();

  const storageId = getCategoryStorageId(grade, category);
  const otherGrade: Grade = grade === "2" ? "1" : "2";
  const syllabus = getSyllabusForCategory(category);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-amber-400">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-400">{grade}級</span>
        <span className="mx-2">/</span>
        <span className="text-gray-300">{categoryInfo.name}</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{categoryInfo.icon}</span>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GradeBadge grade={`${grade}級` as "2級" | "1級"} />
            </div>
            <h1 className="text-3xl font-extrabold text-amber-400">
              {categoryInfo.name}
            </h1>
          </div>
        </div>
        <p className="text-gray-400 leading-relaxed max-w-3xl">
          {categoryInfo.description}
        </p>
      </div>

      {syllabus && (
        <div className="mb-8 rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] p-5">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
            <p className="text-sm font-semibold text-amber-400">
              JIPM 出題範囲: <span className="text-gray-200">{syllabus.officialArea}</span>
            </p>
            <Link href="/syllabus" className="text-xs text-amber-400 hover:text-amber-300 shrink-0">出題範囲の全体を見る →</Link>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mb-3">{syllabus.note}</p>
          <p className="text-[11px] text-gray-500 mb-1.5">この科目の主な出題項目</p>
          <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1">
            {syllabus.subItems.map((it, i) => (
              <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                <span className="text-amber-500/60 mt-0.5">▸</span>{it}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-8">
        <ProgressBar
          categoryId={storageId}
          totalLessons={lessons.length}
          color={categoryInfo.color}
        />
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-100 mb-4">
          全{lessons.length}レッスン
        </h2>
        <LessonList
          lessons={lessons}
          basePath={`/learn/${grade}/${category}`}
          color={categoryInfo.color}
          categoryId={storageId}
        />
      </section>

      <section className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/30">
        <h2 className="text-lg font-bold text-amber-400 mb-3">学習のヒント</h2>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-1">●</span>
            <span>各レッスンには確認クイズが付いています。まずテキストを読んでからクイズを解いてみましょう。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-1">●</span>
            <span>「完了」ボタンを押すと進捗が保存されます。同じブラウザで継続学習できます。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-1">●</span>
            <span>
              用語の暗記は
              <Link href="/flashcards" className="text-amber-400 hover:underline mx-1">フラッシュカード</Link>
              、模擬問題は
              <Link href="/past-exam" className="text-amber-400 hover:underline mx-1">模擬試験</Link>
              で。
            </span>
          </li>
        </ul>
      </section>

      <section className="border-t border-gray-800 pt-8">
        <h2 className="text-lg font-bold text-gray-100 mb-4">他のカテゴリ</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {CATEGORIES.filter((c) => c.id !== category).map((c) => (
            <Link
              key={c.id}
              href={`/learn/${grade}/${c.id}`}
              className="p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-amber-500/40 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{c.icon}</span>
                <span className="font-semibold text-gray-200 text-sm">{c.name}</span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">{c.description}</p>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            href={`/learn/${otherGrade}/${category}`}
            className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300"
          >
            {otherGrade}級の{categoryInfo.name}を見る →
          </Link>
        </div>
      </section>
    </div>
  );
}
