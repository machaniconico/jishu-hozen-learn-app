import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonRenderer } from "@/components/lesson-renderer";
import { LessonNav } from "@/components/lesson-nav";
import { LessonCompleteButton } from "@/components/lesson-complete-button";
import { Quiz } from "@/components/quiz";
import { GradeBadge } from "@/components/difficulty-badge";
import {
  getLesson,
  getLessons,
  getCategoryInfo,
  getCategoryStorageId,
  getAllStaticParams,
  type Grade,
  type CategoryId,
} from "@/lib/lessons-data";

export function generateStaticParams() {
  return getAllStaticParams();
}

interface PageProps {
  params: Promise<{ grade: string; category: string; lesson: string }>;
}

export default async function LessonPage({ params }: PageProps) {
  const { grade: gradeParam, category: categoryParam, lesson: lessonParam } = await params;
  const grade = gradeParam as Grade;
  const category = categoryParam as CategoryId;

  const lesson = getLesson(grade, category, lessonParam);
  const categoryInfo = getCategoryInfo(category);
  const allLessons = getLessons(grade, category);

  if (!lesson || !categoryInfo) notFound();

  const storageId = getCategoryStorageId(grade, category);
  const basePath = `/learn/${grade}/${category}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="mb-6 text-xs text-gray-500">
        <Link href="/" className="hover:text-amber-400">ホーム</Link>
        <span className="mx-1.5">/</span>
        <Link href={basePath} className="hover:text-amber-400">
          {grade}級 {categoryInfo.name}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-gray-400">{lesson.title}</span>
      </nav>

      <div className="mb-8 pb-6 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <GradeBadge grade={`${grade}級` as "2級" | "1級"} />
          <span className="text-amber-400 text-sm font-semibold">
            {categoryInfo.name} レッスン{lesson.order}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-100 mb-3">
          {lesson.title}
        </h1>
        <p className="text-gray-400 leading-relaxed">{lesson.description}</p>
      </div>

      <LessonRenderer sections={lesson.sections} />

      {lesson.quiz && lesson.quiz.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-100 mb-3">理解度チェック</h2>
          <Quiz questions={lesson.quiz} color="amber" />
        </section>
      )}

      <div className="mt-12">
        <LessonCompleteButton categoryId={storageId} lessonId={lesson.id} />
      </div>

      <LessonNav lessons={allLessons} currentId={lesson.id} basePath={basePath} />
    </div>
  );
}
