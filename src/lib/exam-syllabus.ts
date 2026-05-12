import type { CategoryId } from "@/lib/lessons-data";

/**
 * このアプリの5科目と、JIPM 自主保全士検定の公式「出題範囲（知識・技能）」との対応。
 * 公式の区分名・項目は年度により表現が変わるため、おおむねの対応として扱うこと。
 */
export interface SyllabusCategoryMap {
  category: CategoryId;
  /** 公式の「知識・技能」区分名（おおむね） */
  officialArea: string;
  /** その区分の主な出題項目（公式の構成に基づく） */
  subItems: string[];
  /** この科目が本試験でどう問われるかの一言メモ */
  note: string;
}

export const SYLLABUS_BY_CATEGORY: SyllabusCategoryMap[] = [
  {
    category: "seisan-kihon",
    officialArea: "生産の基礎知識（生産の基本）",
    subItems: [
      "TPM の概念・目的・活動（8本柱）",
      "5S（整理・整頓・清掃・清潔・しつけ）",
      "安全衛生（KYT・ヒヤリハット・リスクアセスメント・保護具）",
      "品質管理の基礎（QC 的なものの見方・後工程はお客様）",
      "原価管理の基礎",
      "納期管理の基礎（リードタイム・タクトタイム）",
      "標準作業・作業標準",
      "改善の基礎（PDCA・SDCA・なぜなぜ）",
      "環境保全（3R・省エネ・廃棄物）",
    ],
    note: "学科で広く浅く問われる土台。用語の定義・順序（5S の順、ハインリッヒ 1:29:300 等）を正確に。",
  },
  {
    category: "loss-efficiency",
    officialArea: "生産の基礎知識（生産効率化とロスの構造）",
    subItems: [
      "設備の7大ロス",
      "人（労働効率）の5大ロス",
      "原単位の3大ロス（歩留り・エネルギー・型治工具）",
      "設備総合効率（OEE）＝ 時間稼働率 × 性能稼働率 × 良品率",
      "時間の構造（暦時間〜負荷時間〜稼働時間〜正味稼働時間〜価値稼働時間）",
      "16大ロス（設備8＋人5＋原単位3）",
      "可動率・TEEP・ボトルネック・編成効率",
      "MTBF・MTTR・稼働率（信頼性指標）",
      "ライフサイクルコスト（LCC）",
    ],
    note: "計算問題の宝庫。OEE は必ず「掛け算」。学科の計算枠はここから多く出る。",
  },
  {
    category: "jishu-hozen",
    officialArea: "自主保全活動の基礎知識（自主保全の進め方）",
    subItems: [
      "自主保全の考え方（「自分の設備は自分で守る」）",
      "自主保全7ステップ（初期清掃 → 発生源・困難箇所対策 → 仮基準作成 → 総点検 → 自主点検 → 標準化 → 自主管理）",
      "設備の基本条件（清掃・点検・給油・増締め）／強制劣化と自然劣化",
      "自主保全士に求められる4つの能力（異常発見・処置回復・条件設定・維持管理）",
      "目で見る管理（合いマーク・油面計・温度ラベル 等）",
      "OPL（ワンポイントレッスン）／活動板",
      "ステップ診断・認定",
      "計画保全・品質保全との役割分担と連携",
    ],
    note: "7ステップの順序と各ステップ名は学科・実技とも頻出。実技は「異常を見つけてどう動くか」の記述で問われる。",
  },
  {
    category: "kaizen-kaiseki",
    officialArea: "改善・解析の知識",
    subItems: [
      "なぜなぜ分析",
      "PM分析（現象-物理メカニズム）",
      "QC七つ道具（・新QC七つ道具）",
      "IE手法（工程分析・稼働分析・ワークサンプリング・標準時間）",
      "改善のステップ（QCストーリー）",
      "ポカヨケ・ECRS・ブレーンストーミング",
      "FMEA・FTA",
      "信頼性ブロック図（直列・並列）",
      "故障解析",
    ],
    note: "QC七つ道具の用途（パレート＝重点、特性要因図＝魚の骨…）が頻出。実技はなぜなぜ・PM分析の展開を書かせる。",
  },
  {
    category: "setsubi-hozen",
    officialArea: "保全の基礎知識（設備保全の基礎知識）",
    subItems: [
      "機械要素（ねじ・軸・軸受・歯車・伝動・シール）",
      "潤滑（潤滑剤の種類・粘度・給油方法・劣化）",
      "空気圧（コンプレッサ・FRL・シリンダ・弁）",
      "油圧（パスカルの原理・ポンプ・弁・作動油）",
      "電気（オームの法則・電力・電動機・絶縁・シーケンス制御・PLC）",
      "検査・測定・記録（ノギス・マイクロメータ・ダイヤルゲージ・テスタ）",
      "図面の見方（第三角法・寸法公差）／工作・締結",
      "保全方式（BM・PM・CBM・CM・MP）",
      "設備診断技術（振動・温度・油分析）／信頼性・保全性（バスタブ曲線・MTBF/MTTR）",
    ],
    note: "出題量が最も多い科目。保全方式の定義（CBM↔TBM、CM↔CBM の混同に注意）、A接点/B接点、パスカルの原理を確実に。",
  },
];

export function getSyllabusForCategory(id: CategoryId): SyllabusCategoryMap | undefined {
  return SYLLABUS_BY_CATEGORY.find((s) => s.category === id);
}

/** 試験全体の概要（公式情報の要約・年度により変動） */
export const EXAM_OVERVIEW = {
  org: "公益社団法人 日本プラントメンテナンス協会（JIPM）",
  grades: "1級・2級",
  format: "学科試験（マークシート方式の択一問題）＋ 実技試験（記述式・現場の状況に対応する問題）",
  abilities: ["異常発見能力", "処置・回復能力", "条件設定能力", "維持管理能力"],
  pass: "学科・実技それぞれ概ね60%以上（科目ごとの足切りが設けられる場合あり）",
  eligibility: "2級は誰でも受験可。1級は実務経験または2級合格などが要件（年度により異なる）",
  caveat:
    "試験範囲・出題数・配点・合格基準・受験資格・実施要領は年度により変わります。受験前に必ず JIPM の公式情報をご確認ください。本サイトは非公式の学習補助です。",
} as const;

/** レッスン id → 公式出題範囲の該当サブ項目（おおむねの対応） */
export const LESSON_SYLLABUS_HINT: Record<string, string> = {
  // seisan-kihon ── 生産の基礎知識
  "5s": "5S（整理・整頓・清掃・清潔・しつけ）",
  "anzen-eisei": "安全衛生（KYT・ハインリッヒの法則・リスクの考え方）",
  "hyojun-sagyou": "標準作業・作業標準",
  "kaizen-kaiseki": "改善の基礎（PDCA・なぜなぜ・QC 的なものの見方）",
  "qcd": "QCD（品質・コスト・納期）",
  "g2-muda-mura-muri": "ムダ・ムラ・ムリ／7つのムダ",
  "g2-pdca-sdca": "PDCA・SDCA",
  "g2-kankyo-3r": "環境保全（3R・省エネ・廃棄物）",
  "tpm-8-pillars": "TPM 8本柱と組織展開",
  "risk-assessment": "リスクアセスメント（リスク＝重篤度×可能性、低減の優先順位）",
  "opl-training": "教育・訓練／OPL の作成",
  "g1-oshms": "労働安全衛生マネジメントシステム（OSHMS）",
  "g1-tpm-12steps": "TPM 展開の12ステップ",

  // loss-efficiency ── 生産効率化とロスの構造
  "7-losses": "設備の7大ロス",
  "hito-loss": "人（労働効率）の5大ロス",
  "genntani-loss": "原単位の3大ロス（歩留り・エネルギー・型治工具）",
  "oee": "設備総合効率（OEE）",
  "g2-time-hierarchy": "時間の構造（暦時間〜価値稼働時間）",
  "g2-chokotei-speed-loss": "チョコ停・空転ロス／速度低下ロス",
  "g2-oee-calc-drill": "設備総合効率（OEE）の計算",
  "16-losses": "16大ロス（設備8＋人5＋原単位3）",
  "teep-bottleneck": "TEEP／ボトルネック工程",
  "g1-availability-mtbf": "MTBF・MTTR・稼働率（信頼性指標）",
  "g1-lcc": "ライフサイクルコスト（LCC）",
  "g1-line-balance": "ライン編成効率／ボトルネック",

  // jishu-hozen ── 自主保全活動の基礎知識
  "what-is-jishu-hozen": "自主保全の考え方（自分の設備は自分で守る）／4つの能力",
  "7-steps": "自主保全7ステップ（全体像）",
  "step1-cleaning": "第1ステップ：初期清掃／エフ付け",
  "basic-conditions": "設備の基本条件（清掃・点検・給油・増締め）／強制劣化と自然劣化",
  "g2-visual-control": "目で見る管理（見える化）",
  "g2-lubrication-5teki": "給油（5適：適油・適量・適所・適時・適法）",
  "g2-opl": "OPL（ワンポイントレッスン）",
  "step2-3": "自主保全 第2〜3ステップ（発生源・困難箇所対策／仮基準作成）",
  "step4-5": "自主保全 第4〜5ステップ（総点検／自主点検）",
  "g1-step6-7": "自主保全 第6〜7ステップ（標準化／自主管理の徹底）",
  "g1-step-diagnosis": "ステップ診断・認定（自己診断→上位診断→トップ診断）",
  "g1-maintenance-roles": "計画保全・品質保全との役割分担と連携",

  // kaizen-kaiseki ── 改善・解析の知識
  "naze-naze": "なぜなぜ分析",
  "qc-7-tools": "QC七つ道具",
  "pdca": "PDCA／QCストーリー",
  "g2-qc-story": "改善のステップ（QCストーリー）",
  "g2-pokayoke-ecrs": "ポカヨケ／ECRS",
  "g2-brainstorming": "ブレーンストーミング／改善提案制度",
  "pm-analysis": "PM分析（現象-物理メカニズム）",
  "ie-methods": "IE手法（工程分析・ワークサンプリング・標準時間）",
  "g1-fmea-fta": "FMEA・FTA",
  "g1-reliability-block": "信頼性ブロック図（直列・並列）",

  // setsubi-hozen ── 保全の基礎知識
  "kikai-yousou": "機械要素（ねじ・軸・軸受・歯車・伝動）",
  "junkatu": "潤滑（潤滑剤・粘度・給油・劣化）",
  "denki-kiso": "電気（オームの法則・電力・絶縁・検電）",
  "g2-bolt-tightening": "工作・締結（ねじ・ボルト・増締め・トルク）",
  "g2-bearings": "機械要素（軸受：すべり軸受・ころがり軸受）",
  "g2-pneumatics": "空気圧（コンプレッサ・FRL・シリンダ・弁）",
  "g2-hydraulics": "油圧（パスカルの原理・ポンプ・弁・作動油）",
  "shindan": "設備診断技術（振動・温度・油分析）",
  "plc-sequence": "電気（シーケンス制御・PLC・ラダー図）",
  "g1-maintenance-types": "保全方式（BM・PM・CBM・CM・MP）",
  "g1-vibration-thermo": "設備診断技術（振動診断・サーモグラフィ・傾向管理）",
  "g1-reliability-engineering": "信頼性・保全性（バスタブ曲線・冗長化・フェールセーフ）",
};

export function getLessonSyllabusHint(lessonId: string): string | undefined {
  return LESSON_SYLLABUS_HINT[lessonId];
}
