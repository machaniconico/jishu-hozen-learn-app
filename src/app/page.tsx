import Link from "next/link";

const features = [
  {
    icon: "📖",
    title: "テキスト学習",
    description: "5科目を体系的に学べる詳細な解説ページ。2級・1級それぞれのレベルで段階的に理解を深められます。",
  },
  {
    icon: "✅",
    title: "確認クイズ",
    description: "各レッスンに4択クイズ付き。解説を読みながら理解度をその場で確認できます。",
  },
  {
    icon: "🃏",
    title: "フラッシュカード",
    description: "重要用語を効率的に暗記。シャッフル機能で繰り返し学習し、わかった・復習が必要をマーキング。",
  },
  {
    icon: "📝",
    title: "模擬試験",
    description: "本番形式の問題で実力チェック。間違えた問題の解説で弱点を補強できます。",
  },
];

const subjects = [
  { name: "生産の基本", icon: "🏭", desc: "TPM・5S・安全衛生・QCD" },
  { name: "ロスと効率化", icon: "📊", desc: "7大ロス・OEE・原単位" },
  { name: "自主保全活動", icon: "🔧", desc: "7ステップ・清掃点検給油" },
  { name: "改善・解析", icon: "🔍", desc: "なぜなぜ・PM分析・QC七つ道具" },
  { name: "設備保全の基礎", icon: "⚙️", desc: "機械要素・潤滑・電気・計測" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/30 via-gray-950 to-orange-950/20 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 text-sm text-amber-400 mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            無料・登録不要・ブラウザだけで学習できる
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              自主保全士
            </span>
            <span className="text-gray-100">を学ぼう</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            JIPM主催「自主保全士検定」1級・2級の試験対策を
            <br className="hidden sm:block" />
            テキスト・クイズ・フラッシュカード・模擬試験で完全網羅
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/learn/2/seisan-kihon"
              className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              2級から学習を始める
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/learn/1/seisan-kihon"
              className="inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-100 font-semibold px-8 py-3 rounded-lg transition-colors border border-gray-700"
            >
              1級コースを見る
            </Link>
          </div>
        </div>
      </section>

      {/* Grade selection */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-100 mb-3">学習コース</h2>
            <p className="text-gray-400">受験する級を選んで学習を始めましょう</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="relative flex flex-col rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-500/20 to-emerald-600/10 overflow-hidden">
              <div className="p-6 pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl font-extrabold text-green-400">2</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-100">自主保全士 2級</h3>
                    <p className="text-sm text-green-400 font-medium">現場オペレーター向け基礎</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  設備の日常点検、5S、安全衛生、基本的な機械要素など、自主保全活動の基礎を学びます。
                </p>
              </div>
              <div className="px-6 pb-4 flex-1">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">主な学習トピック</h4>
                <ul className="space-y-1.5">
                  {[
                    "TPMと自主保全活動の基本",
                    "5S・安全衛生・KYT",
                    "7大ロスと設備総合効率",
                    "自主保全7ステップ",
                    "なぜなぜ分析・QC七つ道具",
                    "機械要素・潤滑・油圧の基礎",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm text-gray-300">
                      <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 pt-2">
                <Link
                  href="/learn/2/seisan-kihon"
                  className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  2級コースを始める
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="relative flex flex-col rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-500/20 to-orange-600/10 overflow-hidden">
              <div className="p-6 pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl font-extrabold text-red-400">1</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-100">自主保全士 1級</h3>
                    <p className="text-sm text-red-400 font-medium">リーダー・指導者向け応用</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  自主保全活動の指導・改善活動の推進・設備診断技術など、現場リーダーに必要な知識を学びます。
                </p>
              </div>
              <div className="px-6 pb-4 flex-1">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">主な学習トピック</h4>
                <ul className="space-y-1.5">
                  {[
                    "TPM8本柱と組織展開",
                    "PM分析・IE手法・改善活動",
                    "設備診断技術（振動・温度・油分析）",
                    "MTBF/MTTR・信頼性工学",
                    "PLC・シーケンス制御",
                    "教育訓練・OPL作成",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm text-gray-300">
                      <svg className="w-3.5 h-3.5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 pt-2">
                <Link
                  href="/learn/1/seisan-kihon"
                  className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  1級コースを始める
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-100 mb-3">5科目を完全網羅</h2>
            <p className="text-gray-400">試験範囲のすべての科目を、ひとつのアプリで</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {subjects.map((s) => (
              <div
                key={s.name}
                className="p-5 rounded-xl bg-gray-900 border border-gray-800 text-center hover:border-amber-500/40 transition-colors"
              >
                <div className="text-3xl mb-2">{s.icon}</div>
                <h3 className="text-sm font-bold text-gray-100 mb-1">{s.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-100 mb-3">4つの学習モード</h2>
            <p className="text-gray-400">あなたの学習スタイルに合わせて選べる</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-5 rounded-xl bg-gray-900 border border-gray-800 hover:border-amber-500/40 transition-colors"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-base font-bold text-amber-400 mb-2">{f.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-100 mb-3">準備はできた？</h2>
            <p className="text-gray-400 mb-6 text-sm">
              まずは無料の2級コースから。進捗は自動的に保存されるので、いつでも続きから学習できます。
            </p>
            <Link
              href="/learn/2/seisan-kihon"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold px-7 py-3 rounded-xl text-base transition-colors"
            >
              無料で学習を始める
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
