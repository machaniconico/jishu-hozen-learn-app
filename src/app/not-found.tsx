import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-7xl mb-4">🔧</div>
      <h1 className="text-3xl font-extrabold text-amber-400 mb-2">404</h1>
      <p className="text-gray-300 mb-8 text-lg">お探しのページが見つかりません。</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        ホームへ戻る
      </Link>
    </div>
  );
}
