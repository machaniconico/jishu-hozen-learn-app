import Link from "next/link";

export const metadata = {
  title: "直前チートシート | 自主保全士 学習アプリ",
  description: "自主保全士検定の公式・重要数値・用語の対比を1ページに凝縮した直前まとめ。",
};

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-gray-800 bg-gray-900 p-5 break-inside-avoid print:border-gray-300 print:bg-white">
      <h2 className="text-sm font-bold text-amber-400 mb-3 print:text-black">{title}</h2>
      <div className="text-sm text-gray-300 leading-relaxed space-y-1.5 print:text-gray-900">{children}</div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="text-gray-100 font-medium shrink-0 print:text-black">{k}</span>
      <span className="text-gray-400 print:text-gray-700">{v}</span>
    </div>
  );
}

export default function CheatSheetPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 print:py-2">
      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
        <h1 className="text-3xl font-extrabold text-amber-400 print:text-black">直前チートシート</h1>
        <p className="text-xs text-gray-500 print:hidden">ブラウザの印刷（⌘P / Ctrl+P）で紙にできます</p>
      </div>
      <p className="text-gray-400 text-sm mb-8 print:text-gray-700 print:mb-3">
        試験直前の総まとめ。公式・数値・順序・引っかけポイントを凝縮しています。
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="🧮 計算公式">
          <Row k="設備総合効率 OEE =" v="時間稼働率 × 性能稼働率 × 良品率（必ず「掛け算」）" />
          <Row k="時間稼働率 =" v="稼働時間 / 負荷時間 ＝（負荷時間−停止ロス）/負荷時間" />
          <Row k="性能稼働率 =" v="（基準サイクルタイム×加工数）/ 稼働時間 ＝ 速度稼働率 × 正味稼働率" />
          <Row k="良品率 =" v="良品数 / 加工数" />
          <Row k="タクトタイム =" v="稼働時間 / 必要生産数（サイクルタイムとは別物）" />
          <Row k="可動率 ≠ 稼働率" v="可動率＝使いたいときに正常に動く割合" />
          <Row k="TEEP =" v="OEE ×（負荷時間 / 暦時間）" />
        </Card>

        <Card title="🧮 信頼性・電気の式">
          <Row k="MTBF =" v="総動作時間 / 故障回数（平均故障間隔）" />
          <Row k="MTTR =" v="総修復時間 / 故障回数（平均修復時間）" />
          <Row k="稼働率（可用率）A =" v="MTBF /（MTBF + MTTR）" />
          <Row k="直列システムの信頼度 =" v="R1 × R2 × … （弱いところで決まる）" />
          <Row k="並列（冗長）の信頼度 =" v="1 −（1−R1）（1−R2）…（冗長で向上）" />
          <Row k="オームの法則" v="V ＝ I × R" />
          <Row k="電力" v="P ＝ V × I ＝ I² × R　／ 電力量 ＝ P × 時間" />
          <Row k="パスカルの原理" v="F ＝ P × A（密閉流体は圧力が全方向に等しく伝わる）" />
          <Row k="リスク" v="リスク ＝ 重篤度 × 可能性（低減は 本質安全→工学的→管理的→保護具 の順）" />
        </Card>

        <Card title="🔢 覚える数値・順序">
          <Row k="ハインリッヒの法則" v="1：29：300（重大1：軽傷29：ヒヤリハット300）" />
          <Row k="5S" v="整理 → 整頓 → 清掃 → 清潔 → しつけ" />
          <Row k="設備の基本条件（4つ）" v="清掃・点検・給油・増締め（塗装は含まない）" />
          <Row k="給油の5適" v="適油・適量・適所・適時・適法" />
          <Row k="TPM 5つのゼロ" v="故障・不良・災害・ロス・クレーム" />
          <Row k="自主保全士の4能力" v="異常発見 / 処置・回復 / 条件設定 / 維持管理" />
          <Row k="ブレスト4原則" v="批判厳禁・自由奔放・量を求む・結合改善" />
          <Row k="ECRS" v="排除・結合・交換（再配置）・簡素化" />
          <Row k="OPL（ワンポイントレッスン）" v="1テーマ・A4 1枚・約10分（基礎知識／トラブル事例／改善事例）" />
        </Card>

        <Card title="🔧 自主保全 7ステップ">
          <div className="space-y-1">
            <p><span className="text-gray-100 font-medium print:text-black">1.</span> 初期清掃（清掃点検）— 徹底清掃で微欠陥摘出、エフ付け</p>
            <p><span className="text-gray-100 font-medium print:text-black">2.</span> 発生源・困難箇所対策 — 汚れの源を断つ、清掃困難箇所の改善</p>
            <p><span className="text-gray-100 font-medium print:text-black">3.</span> 自主保全仮基準の作成（清掃・給油・点検の暫定基準）</p>
            <p><span className="text-gray-100 font-medium print:text-black">4.</span> 総点検 — 教育してサブアセンブリ単位で総点検</p>
            <p><span className="text-gray-100 font-medium print:text-black">5.</span> 自主点検 — 仮基準を統合、計画保全と役割分担</p>
            <p><span className="text-gray-100 font-medium print:text-black">6.</span> 標準化 — 各種現場管理項目を標準化</p>
            <p><span className="text-gray-100 font-medium print:text-black">7.</span> 自主管理の徹底 — 方針・目標と連動、改善を継続</p>
          </div>
          <p className="text-xs text-gray-500 mt-2 print:text-gray-600">「清掃は点検なり」／ 強制劣化は基本条件で防げる</p>
        </Card>

        <Card title="📊 7大ロス・16大ロス">
          <p className="text-gray-100 font-medium print:text-black">設備の7大ロス</p>
          <p>①故障 ②段取り・調整 ③刃具交換 ④立上り ⑤チョコ停・空転 ⑥速度低下 ⑦不良・手直し</p>
          <p className="text-gray-100 font-medium mt-2 print:text-black">人の5大ロス</p>
          <p>管理 / 動作 / 編成 / 自動化置換 / 測定・調整</p>
          <p className="text-gray-100 font-medium mt-2 print:text-black">原単位の3大ロス</p>
          <p>歩留り / エネルギー / 型・治工具</p>
          <p className="text-xs text-gray-500 mt-2 print:text-gray-600">16大ロス＝設備8（7大＋計画停止）＋人5＋原単位3</p>
        </Card>

        <Card title="🏭 TPM 8本柱">
          <p>① 個別改善　② 自主保全　③ 計画保全　④ 品質保全</p>
          <p>⑤ 初期管理（設備・製品）　⑥ 教育・訓練</p>
          <p>⑦ 事務・間接部門の効率化　⑧ 安全・衛生・環境</p>
          <p className="text-xs text-gray-500 mt-2 print:text-gray-600">TPM＝1971年 JIPM 提唱「全員参加の生産保全」。営業効率化は本柱に含まれない（引っかけ）。</p>
        </Card>

        <Card title="🔍 改善・解析の道具">
          <Row k="QC七つ道具" v="パレート図 / 特性要因図 / グラフ / チェックシート / ヒストグラム / 散布図 / 管理図（＋層別）" />
          <Row k="パレート図" v="重点指向（多い順に並べる、ABC分析）" />
          <Row k="特性要因図" v="魚の骨（フィッシュボーン）、4Mで原因整理" />
          <Row k="ヒストグラム" v="ばらつき・分布の形（離れ小島／二山は異常）" />
          <Row k="散布図" v="2変量の相関（正／負／無相関）" />
          <Row k="管理図" v="時系列、UCL/LCL・中心線、点の並びの異常" />
          <Row k="工程分析記号" v="加工 / 運搬 / 検査 / 停滞" />
          <Row k="ワークサンプリング" v="瞬間観測法で稼働率を統計的に求める" />
          <Row k="標準時間 =" v="正味時間 ＋ 余裕時間" />
        </Card>

        <Card title="⚠️ なぜなぜ vs PM分析">
          <Row k="なぜなぜ分析" v="現象（事実）から「なぜ」を繰り返し真因へ。散発的・原因が比較的単純な不具合に。" />
          <Row k="PM分析" v="慢性ロス・原因不明に。現象を物理的に見て成立条件を全て洗い出し4Mで要因列挙。" />
          <Row k="ダメな対策" v="「気をつける」「注意する」「教育する」は仕組みでないので対策にならない → 標準化・ポカヨケへ" />
          <Row k="再発防止 / 未然防止" v="再発防止＝起きた後／未然防止＝起こる前（源流対策）" />
        </Card>

        <Card title="⚙️ 保全方式（引っかけ多発）">
          <Row k="BM 事後保全" v="故障してから修理" />
          <Row k="PM 予防保全（TBM）" v="時間基準で定期的に保全（時間基準保全）" />
          <Row k="CBM 予知保全" v="状態基準保全。設備診断で劣化を予知してから整備（TBM と混同注意）" />
          <Row k="CM 改良保全" v="故障しにくいよう設備自体を改善（CBM と混同注意）" />
          <Row k="MP 保全予防" v="設計段階で保全不要を目指す（MP設計・MP情報のフィードバック）" />
          <Row k="生産保全 PM" v="上記を経済的に組み合わせる" />
        </Card>

        <Card title="🔌 電気・シーケンスの要点">
          <Row k="活線作業の手順" v="電源遮断 → 検電器で無電圧確認 →（ロックアウト・タグアウト）→ 残留電荷の放電 → 保護具" />
          <Row k="A接点（NO・メーク）" v="記号 ─| |─　条件が成立すると ON" />
          <Row k="B接点（NC・ブレーク）" v="記号 ─|/|─　条件が成立すると OFF" />
          <Row k="サーマルリレー" v="電動機の過負荷保護" />
          <Row k="メガー" v="絶縁抵抗計（MΩ）。湿気で絶縁抵抗は低下" />
          <Row k="PLC（シーケンサ）" v="リレー回路をプログラムで置換。入力/出力/CPU/電源" />
          <Row k="インバータ" v="周波数を変えて電動機の回転数制御（省エネ）" />
          <Row k="三相誘導電動機" v="同期速度 ＝ 120 × 周波数 / 極数" />
        </Card>

        <Card title="🛢️ 機械要素・潤滑・流体">
          <Row k="ISO VG" v="潤滑油の粘度等級＝40℃の動粘度（mm²/s）。数字が大きいほど高粘度" />
          <Row k="油の劣化" v="酸化＝色が濃く・粘度上昇／水分混入＝白濁・乳化／金属粉混入" />
          <Row k="温度と粘度" v="温度が上がると粘度は下がる" />
          <Row k="軸受" v="すべり軸受／ころがり軸受（玉・ころ）。ラジアル荷重・スラスト荷重" />
          <Row k="増締めの確認" v="合いマーク（ずれていれば緩んでいる）" />
          <Row k="バルブ" v="仕切弁（ゲート）＝全開全閉／玉形弁（グローブ）＝流量調整／逆止弁＝逆流防止" />
          <Row k="空気圧 3点セット FRL" v="フィルタ → レギュレータ（減圧弁）→ ルブリケータ（給油器）" />
          <Row k="バスタブ曲線" v="初期故障期（故障率↓）→ 偶発故障期（一定）→ 摩耗故障期（↑）" />
        </Card>

        <Card title="🛡️ 安全・その他の対比">
          <Row k="フェールセーフ" v="故障・異常が起きても安全側に働く設計" />
          <Row k="フールプルーフ／ポカヨケ" v="人為ミスを物理的に防ぐ仕組み" />
          <Row k="本質安全" v="危険源そのものを取り除く（リスク低減で最優先）" />
          <Row k="不安全行動 / 不安全状態" v="人の行動の問題／設備・環境の問題" />
          <Row k="目で見る管理（例）" v="合いマーク・油面の上下限・温度ラベル・回転方向矢印・グリーンゾーン・配管の流体名" />
          <Row k="3現主義" v="現場・現物・現実" />
          <Row k="品質の考え方" v="後工程はお客様／品質は工程で作り込む／源流管理" />
        </Card>
      </div>

      <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-sm print:hidden">
        <Link href="/exam" className="text-amber-400 hover:text-amber-300">→ 本番モードで力試し</Link>
        <Link href="/calc-drill" className="text-amber-400 hover:text-amber-300">→ 計算ドリルで反復</Link>
        <Link href="/practical" className="text-amber-400 hover:text-amber-300">→ 実技（記述）対策</Link>
        <Link href="/glossary" className="text-amber-400 hover:text-amber-300">→ 用語集（全件）</Link>
      </div>
      <p className="mt-6 text-[11px] text-gray-600 print:text-gray-500">
        ※ 本サイトは非公式の学習補助です。試験範囲・配点・合格基準は年度により変わります。受験前に JIPM の公式情報・公式問題集で必ず確認してください。
      </p>
    </div>
  );
}
