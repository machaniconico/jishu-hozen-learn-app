import Link from "next/link";
import { CATEGORIES } from "@/lib/lessons-data";
import { SYLLABUS_BY_CATEGORY, EXAM_OVERVIEW } from "@/lib/exam-syllabus";

export const metadata = {
  title: "出題範囲との対応 | 自主保全士 学習アプリ",
  description:
    "JIPM 自主保全士検定の公式出題範囲（知識・技能）と、本アプリの5科目・各レッスンの対応をまとめています。",
};

const CAT = (id: string) => CATEGORIES.find((c) => c.id === id);

export default function SyllabusPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-amber-400 mb-2">出題範囲との対応</h1>
      <p className="text-gray-400 text-sm mb-8">
        JIPM 自主保全士検定の公式「出題範囲（知識・技能）」と、本アプリの科目・レッスンの対応をまとめています。
      </p>

      {/* exam overview */}
      <section className="mb-10 rounded-2xl border border-gray-800 bg-gray-900 p-6">
        <h2 className="text-lg font-bold text-gray-100 mb-4">試験の概要</h2>
        <dl className="space-y-2.5 text-sm">
          <div className="flex gap-3">
            <dt className="text-gray-500 w-20 shrink-0">主催</dt>
            <dd className="text-gray-300">{EXAM_OVERVIEW.org}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="text-gray-500 w-20 shrink-0">級</dt>
            <dd className="text-gray-300">{EXAM_OVERVIEW.grades}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="text-gray-500 w-20 shrink-0">試験形式</dt>
            <dd className="text-gray-300">{EXAM_OVERVIEW.format}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="text-gray-500 w-20 shrink-0">求められる<br className="hidden sm:block" />4つの能力</dt>
            <dd className="text-gray-300">
              <div className="flex flex-wrap gap-1.5">
                {EXAM_OVERVIEW.abilities.map((a) => (
                  <span key={a} className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs">
                    {a}
                  </span>
                ))}
              </div>
            </dd>
          </div>
          <div className="flex gap-3">
            <dt className="text-gray-500 w-20 shrink-0">合格基準</dt>
            <dd className="text-gray-300">{EXAM_OVERVIEW.pass}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="text-gray-500 w-20 shrink-0">受験資格</dt>
            <dd className="text-gray-300">{EXAM_OVERVIEW.eligibility}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-amber-400/90 bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 leading-relaxed">
          ⚠️ {EXAM_OVERVIEW.caveat}
        </p>
      </section>

      {/* category ↔ official area mapping */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-100 mb-4">科目と公式出題範囲の対応</h2>
        <div className="space-y-4">
          {SYLLABUS_BY_CATEGORY.map((s) => {
            const cat = CAT(s.category);
            return (
              <div key={s.category} className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                  <div>
                    <p className="text-sm font-bold text-gray-100">
                      <span className="mr-1.5">{cat?.icon}</span>{cat?.name}
                    </p>
                    <p className="text-xs text-amber-400 mt-0.5">公式: {s.officialArea}</p>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <Link href={`/learn/2/${s.category}`} className="px-2.5 py-1 rounded bg-green-500/15 text-green-400 hover:bg-green-500/25">2級を学ぶ</Link>
                    <Link href={`/learn/1/${s.category}`} className="px-2.5 py-1 rounded bg-red-500/15 text-red-400 hover:bg-red-500/25">1級を学ぶ</Link>
                  </div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed mb-3">{s.note}</p>
                <p className="text-[11px] text-gray-500 mb-1.5">主な出題項目</p>
                <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1">
                  {s.subItems.map((it, i) => (
                    <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                      <span className="text-amber-500/60 mt-0.5">▸</span>{it}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-800 bg-gray-900 p-5 mb-8">
        <h2 className="text-sm font-bold text-gray-200 mb-2">学習の進め方の目安</h2>
        <ol className="text-sm text-gray-400 leading-relaxed space-y-1 list-decimal list-inside">
          <li>各科目の<Link href="/learn/2/seisan-kihon" className="text-amber-400 hover:underline mx-0.5">テキスト</Link>で全体像をつかむ（各レッスンに対応する公式項目を表示しています）</li>
          <li><Link href="/exam" className="text-amber-400 hover:underline mx-0.5">本番モード</Link>で学科を、<Link href="/practical" className="text-amber-400 hover:underline mx-0.5">実技対策</Link>で記述を繰り返す</li>
          <li>苦手は<Link href="/review" className="text-amber-400 hover:underline mx-0.5">復習リスト</Link>で潰し、計算は<Link href="/calc-drill" className="text-amber-400 hover:underline mx-0.5">計算ドリル</Link>で反復</li>
          <li>直前は<Link href="/cheatsheet" className="text-amber-400 hover:underline mx-0.5">チートシート</Link>で総点検</li>
        </ol>
      </section>

      <p className="text-[11px] text-gray-600 leading-relaxed">
        ※ 上記の「公式」区分名・出題項目は、JIPM が公表する出題範囲をもとにした<strong className="text-gray-500">おおよその対応</strong>です。正式な区分・項目・配点・実施要領は年度により変わるため、受験前に JIPM の公式情報を必ずご確認ください。
      </p>
    </div>
  );
}
