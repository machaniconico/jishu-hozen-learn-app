import type { FlashcardItem } from "@/components/flashcard";
import type { CategoryId, Grade } from "@/lib/lessons-data";

export interface FlashcardEntry extends FlashcardItem {
  category: CategoryId;
  grade: Grade | "共通";
}

export const FLASHCARDS: FlashcardEntry[] = [
  // 生産の基本
  { term: "TPM", reading: "ティーピーエム", definition: "Total Productive Maintenance（全員参加の生産保全）。経営層から現場まで全員参加でロスを撲滅するJIPM提唱の活動。", category: "seisan-kihon", grade: "共通" },
  { term: "JIPM", definition: "公益社団法人 日本プラントメンテナンス協会。TPMを提唱し、自主保全士検定を実施する団体。", category: "seisan-kihon", grade: "共通" },
  { term: "5S", definition: "整理（Seiri）・整頓（Seiton）・清掃（Seisou）・清潔（Seiketsu）・しつけ（Shitsuke）の頭文字。職場環境を整える基本活動。", category: "seisan-kihon", grade: "2" },
  { term: "整理", definition: "要るものと要らないものを区別し、要らないものを処分する。", category: "seisan-kihon", grade: "2" },
  { term: "整頓", definition: "要るものを使いやすい場所に置き、誰でもすぐ取り出せるようにする。", category: "seisan-kihon", grade: "2" },
  { term: "KYT", definition: "危険予知訓練（Kiken Yochi Training）。作業前に潜む危険を予知し、対策を立てる訓練。", category: "seisan-kihon", grade: "2" },
  { term: "ハインリッヒの法則", definition: "1件の重大災害の背後には、29件の軽傷事故、300件のヒヤリハットが存在するという経験則（1:29:300）。", category: "seisan-kihon", grade: "2" },
  { term: "ヒヤリハット", definition: "事故には至らなかったがヒヤリとした・ハッとした出来事。重大事故の予兆として記録・分析する。", category: "seisan-kihon", grade: "2" },
  { term: "指差呼称", reading: "ゆびさしこしょう", definition: "対象を指差し、声に出して確認する動作。エラー率を約1/6に低減できる。", category: "seisan-kihon", grade: "2" },
  { term: "QCD", definition: "Quality（品質）・Cost（コスト）・Delivery（納期）。製造業の競争力を決める3要素。", category: "seisan-kihon", grade: "2" },
  { term: "QCDSM", definition: "QCDに加えてSafety（安全）とMorale（士気）。SとMがQCDの土台となる考え方。", category: "seisan-kihon", grade: "共通" },
  { term: "タクトタイム", definition: "1個を作るのに必要な時間。1日の稼働時間 ÷ 1日の必要数。", category: "seisan-kihon", grade: "2" },
  { term: "3現主義", definition: "現場・現物・現実。机上ではなく実際の現場で実物を見て判断する考え方。", category: "seisan-kihon", grade: "共通" },
  { term: "TPM8本柱", definition: "個別改善・自主保全・計画保全・教育訓練・初期管理・品質保全・事務間接効率化・安全衛生環境の8つ。", category: "seisan-kihon", grade: "1" },
  { term: "MP設計", definition: "Maintenance Prevention。新設備の設計段階で保全性を組み込む活動。", category: "seisan-kihon", grade: "1" },
  { term: "リスクアセスメント", definition: "ハザードを洗い出し、重篤度×可能性でリスク評価し、対策の優先順位をつける手法。", category: "seisan-kihon", grade: "1" },
  { term: "本質安全", definition: "危険源そのものを取り除くこと。リスク低減で最優先される。", category: "seisan-kihon", grade: "1" },
  { term: "OPL", reading: "ワンポイントレッスン", definition: "One Point Lesson。A4・1枚にまとめた現場教育用の教材。1テーマに絞り10分以内で理解できる量にする。", category: "seisan-kihon", grade: "1" },
  { term: "LOTO", definition: "Lock Out / Tag Out。電源遮断と表示札・施錠による安全確保の手順。", category: "seisan-kihon", grade: "共通" },
  // ロスと効率化
  { term: "7大ロス", definition: "設備の効率を阻害するロス。故障・段取り・刃具交換・立上り・チョコ停・速度低下・不良の7つ。", category: "loss-efficiency", grade: "2" },
  { term: "チョコ停", definition: "数分以内の短時間停止や空転。回数が多いと積み上がって大きな損失になる。性能稼働率を低下させる。", category: "loss-efficiency", grade: "2" },
  { term: "OEE", definition: "Overall Equipment Effectiveness（設備総合効率）。時間稼働率 × 性能稼働率 × 良品率で計算。", category: "loss-efficiency", grade: "2" },
  { term: "時間稼働率", definition: "止まらずに動いていた割合。稼働時間 ÷ 負荷時間。故障・段取りロスの影響を受ける。", category: "loss-efficiency", grade: "2" },
  { term: "性能稼働率", definition: "本来のスピードで動いていた割合。チョコ停・速度低下ロスの影響を受ける。", category: "loss-efficiency", grade: "2" },
  { term: "良品率", definition: "作ったうち良品の割合。良品数 ÷ 生産数。不良・手直しロスの影響を受ける。", category: "loss-efficiency", grade: "2" },
  { term: "人の5大ロス", definition: "管理・動作・編成・自動化置換・測定調整。人の効率を阻害するロス。", category: "loss-efficiency", grade: "2" },
  { term: "原単位3大ロス", definition: "歩留り（材料）・エネルギー・型治工具。製品1個あたりの消費を悪化させるロス。", category: "loss-efficiency", grade: "2" },
  { term: "16大ロス", definition: "設備7 + 人5 + 原単位3 + 計画停止1 = 合計16のロス。TPMで扱うすべてのロスを統合。", category: "loss-efficiency", grade: "1" },
  { term: "TEEP", definition: "Total Effective Equipment Performance。設備稼働率 × OEE。暦時間ベースの真の効率。", category: "loss-efficiency", grade: "1" },
  { term: "ボトルネック", definition: "ライン全体の生産性を律速している最も遅い工程。改善効果を最大化できる箇所。", category: "loss-efficiency", grade: "1" },
  // 自主保全
  { term: "自主保全", definition: "「自分の設備は自分で守る」を合言葉に、現場オペレーターが日常保全を主体的に行う活動。", category: "jishu-hozen", grade: "共通" },
  { term: "計画保全", definition: "保全部門が行う計画的な点検・修理。専門技術が必要な分解整備など。", category: "jishu-hozen", grade: "共通" },
  { term: "自主保全7ステップ", definition: "1.初期清掃 → 2.発生源対策 → 3.仮基準 → 4.総点検 → 5.自主点検 → 6.標準化 → 7.自主管理の徹底", category: "jishu-hozen", grade: "2" },
  { term: "初期清掃", definition: "自主保全第1ステップ。徹底清掃を通じて隠れた異常（油漏れ・緩み・摩耗）を発見する。", category: "jishu-hozen", grade: "2" },
  { term: "赤札", definition: "初期清掃で発見した不具合箇所に貼る札。修理・対策・復元が必要な箇所を見える化する。", category: "jishu-hozen", grade: "2" },
  { term: "強制劣化", definition: "汚れの放置・給油不足・締め忘れ・誤操作など人為的原因による劣化。基本条件を守れば防げる。", category: "jishu-hozen", grade: "2" },
  { term: "自然劣化", definition: "経年による摩耗・疲労など物理的に避けられない劣化。計画的に交換・修理する。", category: "jishu-hozen", grade: "2" },
  { term: "基本条件", definition: "清掃・点検・給油・増締めの4つ。設備の劣化を防ぐ基本活動。", category: "jishu-hozen", grade: "2" },
  { term: "ファブ", definition: "Fuguai（不具合）の意。設備や工程の小さな問題のこと。", category: "jishu-hozen", grade: "2" },
  { term: "あるべき姿", definition: "設備や工程の理想的な状態。「あるがまま」（現状）との差を測ることで改善が始まる。", category: "jishu-hozen", grade: "共通" },
  // 改善・解析
  { term: "なぜなぜ分析", definition: "「なぜ？」を繰り返し問いかけて真因にたどり着く分析手法。トヨタ生産方式で有名。", category: "kaizen-kaiseki", grade: "2" },
  { term: "QC七つ道具", definition: "パレート図・特性要因図・ヒストグラム・散布図・管理図・チェックシート・グラフ。", category: "kaizen-kaiseki", grade: "2" },
  { term: "パレート図", definition: "原因を発生頻度の多い順に並べた棒グラフ + 累積折れ線。重点指向の象徴的ツール。", category: "kaizen-kaiseki", grade: "2" },
  { term: "特性要因図", definition: "フィッシュボーン図とも。結果（特性）に対する原因を4M（人・機械・材料・方法）で整理。", category: "kaizen-kaiseki", grade: "2" },
  { term: "4M", definition: "Man（人）・Machine（機械）・Material（材料）・Method（方法）。要因分析の基本フレーム。", category: "kaizen-kaiseki", grade: "共通" },
  { term: "PDCA", definition: "Plan（計画）→ Do（実行）→ Check（評価）→ Act（改善）。改善活動の基本サイクル。", category: "kaizen-kaiseki", grade: "2" },
  { term: "PM分析", definition: "Phenomenon-Mechanism分析。物理現象から科学的に追究する手法。慢性ロス・微欠陥に有効。", category: "kaizen-kaiseki", grade: "1" },
  { term: "IE手法", definition: "Industrial Engineering。動作分析・時間分析・稼働分析など、人の作業を最適化する手法体系。", category: "kaizen-kaiseki", grade: "1" },
  { term: "ワークサンプリング", definition: "ランダムな時刻に観察し、稼働状態の割合を統計的に求めるIE手法。", category: "kaizen-kaiseki", grade: "1" },
  { term: "ポカヨケ", definition: "ヒューマンエラーを物理的に不可能にする仕組み。ミスを未然に防ぐ。", category: "kaizen-kaiseki", grade: "共通" },
  // 設備保全
  { term: "ベアリング", definition: "回転軸を支える機械要素。転がり軸受（ボール・ローラ）と滑り軸受がある。給油が重要。", category: "setsubi-hozen", grade: "2" },
  { term: "合いマーク", definition: "ボルトとナットにまたがって引く線。ずれの有無で緩みを判定する。", category: "setsubi-hozen", grade: "2" },
  { term: "ISO VG", definition: "潤滑油の粘度等級（Viscosity Grade）。数字が大きいほど粘度が高い。VG32・VG46・VG68など。", category: "setsubi-hozen", grade: "2" },
  { term: "グリース", definition: "潤滑油に増ちょう剤を混ぜた半固体。漏れにくく長期使用可能だが熱に弱い。「ちょう度」で硬さを表す。", category: "setsubi-hozen", grade: "2" },
  { term: "ちょう度", definition: "グリースの硬さを表す指標。数値が小さいほど硬い。", category: "setsubi-hozen", grade: "2" },
  { term: "メガー", definition: "絶縁抵抗計。電気回路の絶縁の良否を測定する計器。", category: "setsubi-hozen", grade: "2" },
  { term: "三相モータ", definition: "工場の主力動力源。Y結線・Δ結線で起動方式を変えられる。", category: "setsubi-hozen", grade: "2" },
  { term: "MTBF", definition: "Mean Time Between Failures。平均故障間隔。高いほど信頼性が高い。", category: "setsubi-hozen", grade: "1" },
  { term: "MTTR", definition: "Mean Time To Repair。平均修理時間。短いほど保全性が高い。", category: "setsubi-hozen", grade: "1" },
  { term: "稼働率", definition: "Availability = MTBF / (MTBF + MTTR)。設備が稼働できる時間の割合。", category: "setsubi-hozen", grade: "1" },
  { term: "バスタブ曲線", definition: "初期故障期 → 偶発故障期 → 摩耗故障期と推移する故障率の曲線。浴槽の形に似ている。", category: "setsubi-hozen", grade: "1" },
  { term: "CBM", definition: "Condition Based Maintenance（状態基準保全）。設備状態を計測し、必要な時だけ保全する方式。", category: "setsubi-hozen", grade: "1" },
  { term: "PLC", definition: "Programmable Logic Controller。リレー回路をプログラムで実現する制御装置。", category: "setsubi-hozen", grade: "1" },
  { term: "サーモグラフィ", definition: "赤外線で温度分布を可視化する計測装置。電気設備や軸受の異常発熱を発見できる。", category: "setsubi-hozen", grade: "1" },
];

export function getFlashcardsByCategory(category: CategoryId): FlashcardEntry[] {
  return FLASHCARDS.filter((f) => f.category === category);
}

export function getFlashcardsByGrade(grade: Grade): FlashcardEntry[] {
  return FLASHCARDS.filter((f) => f.grade === grade || f.grade === "共通");
}
