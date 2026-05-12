import type { QuizQuestion } from "@/components/quiz";
import { EXTRA_LESSONS_G2 } from "@/lib/lessons-extra-g2";
import { EXTRA_LESSONS_G1 } from "@/lib/lessons-extra-g1";

export type Grade = "2" | "1";
export type CategoryId =
  | "seisan-kihon"
  | "loss-efficiency"
  | "jishu-hozen"
  | "kaizen-kaiseki"
  | "setsubi-hozen";

export interface LessonSection {
  type:
    | "paragraph"
    | "bullets"
    | "numbered"
    | "note"
    | "warning"
    | "definitions"
    | "table"
    | "formula";
  heading?: string;
  text?: string;
  items?: string[];
  definitions?: { term: string; def: string }[];
  table?: { headers: string[]; rows: string[][] };
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: CategoryId;
  grade: Grade;
  order: number;
  sections: LessonSection[];
  quiz?: QuizQuestion[];
}

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "seisan-kihon",
    name: "生産の基本",
    icon: "🏭",
    description: "TPM・5S・安全衛生・QCDなど、生産活動の土台となる知識",
    color: "amber",
  },
  {
    id: "loss-efficiency",
    name: "ロスと効率化",
    icon: "📊",
    description: "7大ロス・設備総合効率（OEE）・原単位ロスを定量的に理解",
    color: "orange",
  },
  {
    id: "jishu-hozen",
    name: "自主保全活動",
    icon: "🔧",
    description: "自主保全7ステップと清掃・点検・給油・増締めの実践",
    color: "amber",
  },
  {
    id: "kaizen-kaiseki",
    name: "改善・解析",
    icon: "🔍",
    description: "なぜなぜ分析・PM分析・QC七つ道具による問題解決",
    color: "orange",
  },
  {
    id: "setsubi-hozen",
    name: "設備保全の基礎",
    icon: "⚙️",
    description: "機械要素・潤滑・油圧・空気圧・電気・計測の基礎知識",
    color: "amber",
  },
];

const G2_SEISAN: Lesson[] = [
  {
    id: "tpm-overview",
    title: "TPMとは",
    description: "Total Productive Maintenance（全員参加の生産保全）の概要",
    category: "seisan-kihon",
    grade: "2",
    order: 1,
    sections: [
      {
        type: "paragraph",
        heading: "TPM（Total Productive Maintenance）とは",
        text: "TPMは「全員参加の生産保全」と訳される、製造現場の体質改善を目指す日本発祥の活動です。1971年に日本プラントメンテナンス協会（JIPM）が提唱しました。\n\n単なる設備保全活動ではなく、経営者から現場オペレーターまで全員が参加し、ロスをゼロに近づけることで、生産システムの効率を極限まで高めることを目指します。",
      },
      {
        type: "bullets",
        heading: "TPMの5つの目標（ゼロを目指す）",
        items: [
          "故障ゼロ — 設備が止まらない",
          "不良ゼロ — 不良品を作らない",
          "災害ゼロ — けがをしない",
          "ロスゼロ — あらゆる無駄をなくす",
          "クレームゼロ — お客様の不満をなくす",
        ],
      },
      {
        type: "definitions",
        heading: "TPMで重要な3つのコンセプト",
        definitions: [
          { term: "全員参加", def: "経営層から現場まで階層横断で活動する。" },
          { term: "予防の思想", def: "問題が起きてから直すのではなく、起こさない仕組みを作る。" },
          { term: "現場・現物・現実（3現主義）", def: "机上ではなく、実際の現場で実物を見て判断する。" },
        ],
      },
      {
        type: "note",
        heading: "TPMの「P」は2つの意味",
        text: "TPMの「P」は当初Productive（生産的）の頭文字でしたが、Perfect（完璧な）の意味も含むように発展しました。設備中心の保全（PM）から、生産システム全体の最適化（TPM）へと進化したと覚えましょう。",
      },
    ],
    quiz: [
      {
        question: "TPMの正式名称はどれですか？",
        options: ["Total Production Management", "Total Productive Maintenance", "Team Project Management", "Total Performance Measurement"],
        answer: 1,
        explanation: "TPMは Total Productive Maintenance（全員参加の生産保全）の略です。",
      },
      {
        question: "TPMを提唱した団体はどれですか？",
        options: ["JIS", "JIPM", "JIMA", "JISC"],
        answer: 1,
        explanation: "JIPM（公益社団法人 日本プラントメンテナンス協会）が1971年に提唱しました。",
      },
      {
        question: "TPMが目指す「ゼロ」に含まれないものはどれですか？",
        options: ["故障ゼロ", "不良ゼロ", "残業ゼロ", "災害ゼロ"],
        answer: 2,
        explanation: "故障・不良・災害・ロス・クレームの5つのゼロを目指します。残業ゼロは含まれません。",
      },
      {
        question: "TPMの「3現主義」が示すのはどれですか？",
        options: ["現実・現状・現役", "現場・現物・現実", "現金・現品・現場", "現在・現役・現状"],
        answer: 1,
        explanation: "現場で現物を見て現実を把握するのが3現主義です。",
      },
    ],
  },
  {
    id: "5s",
    title: "5Sの実践",
    description: "整理・整頓・清掃・清潔・しつけの基本",
    category: "seisan-kihon",
    grade: "2",
    order: 2,
    sections: [
      {
        type: "paragraph",
        heading: "5Sとは",
        text: "5Sは職場環境を整える基本活動で、自主保全のスタート地点です。整理（Seiri）・整頓（Seiton）・清掃（Seisou）・清潔（Seiketsu）・しつけ（Shitsuke）の頭文字を取ったものです。",
      },
      {
        type: "definitions",
        heading: "5Sそれぞれの意味",
        definitions: [
          { term: "整理（Seiri）", def: "要るものと要らないものを区別し、要らないものを処分する。" },
          { term: "整頓（Seiton）", def: "要るものを使いやすい場所に置き、誰でもすぐ取り出せるようにする。" },
          { term: "清掃（Seisou）", def: "ゴミ・汚れを取り除き、設備を点検する。" },
          { term: "清潔（Seiketsu）", def: "整理・整頓・清掃の状態を維持する仕組みをつくる。" },
          { term: "しつけ（Shitsuke）", def: "決めたことを守る習慣を身につける。" },
        ],
      },
      {
        type: "bullets",
        heading: "5Sの効果",
        items: [
          "必要なものがすぐ見つかる（探すロスがなくなる）",
          "設備の異常に気づきやすくなる",
          "事故・けがが減る",
          "品質が安定する",
          "見た目がきれいになり、お客様の信頼を得る",
        ],
      },
      {
        type: "note",
        heading: "「清掃は点検なり」",
        text: "TPMでは清掃を単なる掃除と捉えず、設備の状態を確認する点検行為と位置づけます。手で触れることで微振動・温度変化・異常音などに気づきやすくなります。",
      },
    ],
    quiz: [
      {
        question: "5Sの「整理」の意味として正しいものはどれですか？",
        options: ["要るものを使いやすく並べる", "要るものと要らないものを区別して要らないものを処分する", "ゴミや汚れを取り除く", "決められたルールを守る"],
        answer: 1,
        explanation: "整理は「要・不要を区別し、不要なものを処分する」ことです。要るものを並べるのは整頓です。",
      },
      {
        question: "5Sのうち、習慣化を意味するのはどれですか？",
        options: ["整理", "整頓", "清潔", "しつけ"],
        answer: 3,
        explanation: "しつけ（Shitsuke）は決めたことを守る習慣を身につけることです。",
      },
      {
        question: "TPMでは清掃をどう位置づけていますか？",
        options: ["美観のための作業", "新人の仕事", "点検行為", "終業時の作業"],
        answer: 2,
        explanation: "「清掃は点検なり」と捉え、設備の異常を発見する重要な活動とします。",
      },
    ],
  },
  {
    id: "anzen-eisei",
    title: "安全衛生とKYT",
    description: "ヒヤリハット・ハインリッヒの法則・KYT（危険予知訓練）",
    category: "seisan-kihon",
    grade: "2",
    order: 3,
    sections: [
      {
        type: "paragraph",
        heading: "安全衛生の基本",
        text: "「安全はすべてに優先する」が製造業の鉄則です。災害は、不安全な行動と不安全な状態が重なったときに発生します。\n\n設備の自主保全活動においても、安全確保は最優先事項です。",
      },
      {
        type: "definitions",
        heading: "重要な概念",
        definitions: [
          { term: "ハインリッヒの法則（1:29:300）", def: "1件の重大災害の背後には、29件の軽傷事故、300件のヒヤリハットが存在するという経験則。" },
          { term: "ヒヤリハット", def: "事故には至らなかったが、ヒヤリとした・ハッとした出来事。重大事故の予兆として記録・分析する。" },
          { term: "KYT（危険予知訓練）", def: "作業前に潜む危険を予知し、対策を立てる訓練。指差呼称と組み合わせて実施。" },
          { term: "指差呼称", def: "対象を指差し、声に出して確認する動作。エラー率を約1/6に低減できる。" },
        ],
      },
      {
        type: "numbered",
        heading: "KYTの4ラウンド法",
        text: "KYTは以下の4ステップで進めます。",
        items: [
          "現状把握 — 「どんな危険が潜んでいるか？」",
          "本質追究 — 「これが危険のポイントだ」",
          "対策樹立 — 「あなたならどうする？」",
          "目標設定 — 「私たちはこうする！」",
        ],
      },
      {
        type: "warning",
        heading: "労働災害の主な原因",
        text: "不安全な状態（設備の欠陥、防護不備）と不安全な行動（保護具不着用、近道行為、確認不足）の重なりが災害を生みます。両面から対策が必要です。",
      },
    ],
    quiz: [
      {
        question: "ハインリッヒの法則の比率はどれですか？",
        options: ["1:10:100", "1:29:300", "1:5:50", "1:30:300"],
        answer: 1,
        explanation: "1件の重大災害：29件の軽傷：300件のヒヤリハット、というのが正しい比率です。",
      },
      {
        question: "指差呼称の効果として正しいのはどれですか？",
        options: ["作業時間が短くなる", "エラー率が約1/6に低減する", "疲労感が減る", "音が出るので危険を周知できる"],
        answer: 1,
        explanation: "指差呼称はエラー率を約1/6に下げる効果があることが研究で示されています。",
      },
      {
        question: "KYT 4ラウンド法の最初のステップはどれですか？",
        options: ["対策樹立", "本質追究", "現状把握", "目標設定"],
        answer: 2,
        explanation: "「どんな危険が潜んでいるか」を全員で出し合う現状把握から始めます。",
      },
    ],
  },
  {
    id: "qcd",
    title: "QCD — 品質・コスト・納期",
    description: "生産活動で常に意識する3つの軸",
    category: "seisan-kihon",
    grade: "2",
    order: 4,
    sections: [
      {
        type: "paragraph",
        heading: "QCDとは",
        text: "QCDは Quality（品質）・Cost（コスト）・Delivery（納期）の頭文字で、製造業の競争力を決める3要素です。\n\nお客様は「良いものを・安く・早く」手に入れたい。これに応えるのが製造現場の使命です。",
      },
      {
        type: "definitions",
        heading: "QCDの内訳",
        definitions: [
          { term: "Q（品質）", def: "規格・仕様を満たし、お客様が期待する性能・耐久性を実現する。不良ゼロ・クレームゼロ。" },
          { term: "C（コスト）", def: "材料費・労務費・経費を抑え、競争力ある価格で提供する。ロス削減で原価低減。" },
          { term: "D（納期）", def: "約束した日時に必要量を届ける。リードタイム短縮、ジャスト・イン・タイム。" },
        ],
      },
      {
        type: "note",
        heading: "QCD + S + M",
        text: "近年は安全（Safety）と士気（Morale）を加えてQCDSMと言うこともあります。安全と人のやる気が土台となって、はじめてQCDが成り立つという考え方です。",
      },
    ],
    quiz: [
      {
        question: "QCDのDが意味するのはどれですか？",
        options: ["Design（設計）", "Delivery（納期）", "Development（開発）", "Document（文書）"],
        answer: 1,
        explanation: "DはDelivery（納期）です。約束した日時に届けることを指します。",
      },
      {
        question: "QCDSMのSとMは何ですか？",
        options: ["Service と Money", "Safety と Morale", "Speed と Mind", "Standard と Method"],
        answer: 1,
        explanation: "Safety（安全）とMorale（士気）です。QCDの土台となる要素です。",
      },
    ],
  },
  {
    id: "hyojun-sagyou",
    title: "標準作業",
    description: "標準時間・タクトタイム・作業手順書",
    category: "seisan-kihon",
    grade: "2",
    order: 5,
    sections: [
      {
        type: "paragraph",
        heading: "標準作業とは",
        text: "標準作業は「誰がやっても同じ結果が出る、最も合理的な作業のやり方」を文書化したものです。\n\n標準があるからこそ「改善」ができます。標準のない作業を改善することはできません。",
      },
      {
        type: "definitions",
        heading: "標準作業の3要素",
        definitions: [
          { term: "タクトタイム", def: "1個（1回）を作るのに必要な時間。 タクトタイム = 1日の稼働時間 ÷ 1日の必要数。" },
          { term: "作業順序", def: "作業者が部品をピックし、加工・組立する手順の決まり。" },
          { term: "標準手持ち", def: "作業を円滑に進めるために、各工程に置いておく最小限の仕掛品の数。" },
        ],
      },
      {
        type: "formula",
        heading: "タクトタイムの計算式",
        text: "タクトタイム = 1日の稼働時間（秒）÷ 1日の必要生産数\n\n例: 8時間（28,800秒）÷ 480個 = 60秒/個",
      },
    ],
    quiz: [
      {
        question: "1日8時間（28,800秒）の稼働で480個生産する場合のタクトタイムは？",
        options: ["30秒", "60秒", "90秒", "120秒"],
        answer: 1,
        explanation: "28,800 ÷ 480 = 60秒/個 です。",
      },
      {
        question: "標準作業の意義として正しいのは？",
        options: ["作業者を縛るためのルール", "改善のスタート地点", "管理者の指示書", "新人教育の目的"],
        answer: 1,
        explanation: "標準があってはじめて改善ができる。改善のスタート地点として位置づけられます。",
      },
    ],
  },
];

const G2_LOSS: Lesson[] = [
  {
    id: "7-losses",
    title: "設備の7大ロス",
    description: "設備の効率を阻害する7つのロス",
    category: "loss-efficiency",
    grade: "2",
    order: 1,
    sections: [
      {
        type: "paragraph",
        heading: "設備の7大ロスとは",
        text: "TPMでは、設備が本来の能力を発揮できない原因を7つのロスに分類します。これを「7大ロス」と呼びます。\n\nロスを見える化することで、改善の優先順位がつけられます。",
      },
      {
        type: "table",
        heading: "設備7大ロスの分類",
        table: {
          headers: ["分類", "ロス", "内容"],
          rows: [
            ["停止ロス", "1. 故障ロス", "設備の故障で生産が止まる"],
            ["停止ロス", "2. 段取り・調整ロス", "品種替えなどで止まる"],
            ["停止ロス", "3. 刃具交換ロス", "工具の交換で止まる"],
            ["停止ロス", "4. 立上りロス", "起動時の調整で良品が出るまでのロス"],
            ["性能ロス", "5. チョコ停・空転ロス", "短時間の停止や空転"],
            ["性能ロス", "6. 速度低下ロス", "設計速度より遅く運転"],
            ["不良ロス", "7. 不良・手直しロス", "規格外品の発生・修正"],
          ],
        },
      },
      {
        type: "bullets",
        heading: "7大ロスを覚えるコツ",
        items: [
          "停止系（4つ）: 故障 / 段取り / 刃具交換 / 立上り",
          "性能系（2つ）: チョコ停 / 速度低下",
          "不良系（1つ）: 不良・手直し",
          "頭文字: 故・段・刃・立・チョ・速・不",
        ],
      },
    ],
    quiz: [
      {
        question: "次のうち、設備の7大ロスに含まれないのはどれですか？",
        options: ["故障ロス", "段取り・調整ロス", "管理ロス", "速度低下ロス"],
        answer: 2,
        explanation: "管理ロスは「人の効率を阻害する5大ロス」に含まれます。設備7大ロスではありません。",
      },
      {
        question: "設備の起動時、安定して良品が出るまでのロスを何というか？",
        options: ["故障ロス", "段取りロス", "立上りロス", "チョコ停ロス"],
        answer: 2,
        explanation: "立上りロスは、設備立ち上げから良品が安定生産されるまでのロスです。",
      },
      {
        question: "短時間の停止や空転を意味するロスはどれですか？",
        options: ["故障ロス", "チョコ停・空転ロス", "速度低下ロス", "段取りロス"],
        answer: 1,
        explanation: "チョコ停は数分以内の短時間停止。一見軽微でも回数で大きな損失となります。",
      },
    ],
  },
  {
    id: "oee",
    title: "設備総合効率（OEE）",
    description: "時間稼働率・性能稼働率・良品率の3要素",
    category: "loss-efficiency",
    grade: "2",
    order: 2,
    sections: [
      {
        type: "paragraph",
        heading: "設備総合効率（OEE）とは",
        text: "OEE（Overall Equipment Effectiveness）は、設備が本来の能力をどれだけ発揮できているかを表す指標です。3つの要素の掛け算で計算されます。",
      },
      {
        type: "formula",
        heading: "OEE 計算式",
        text: "設備総合効率 = 時間稼働率 × 性能稼働率 × 良品率\n\n時間稼働率 = 稼働時間 ÷ 負荷時間\n性能稼働率 = (基準サイクルタイム × 生産数) ÷ 稼働時間\n良品率 = 良品数 ÷ 生産数",
      },
      {
        type: "definitions",
        heading: "3つの要素",
        definitions: [
          { term: "時間稼働率", def: "止まらずに動いていた割合。故障・段取り・立上りロスの影響を受ける。" },
          { term: "性能稼働率", def: "本来のスピードで動いていた割合。チョコ停・速度低下ロスの影響を受ける。" },
          { term: "良品率", def: "作ったうち良品の割合。不良・手直しロスの影響を受ける。" },
        ],
      },
      {
        type: "note",
        heading: "OEE 85%以上が世界クラス",
        text: "OEE が85%以上は世界クラスの工場と言われます。日本の優良工場で85%程度、平均的な工場では60%前後。100%は実質不可能（保全時間も必要なため）。",
      },
    ],
    quiz: [
      {
        question: "設備総合効率（OEE）の計算式はどれですか？",
        options: ["時間稼働率 + 性能稼働率 + 良品率", "時間稼働率 × 性能稼働率 × 良品率", "稼働時間 ÷ 負荷時間", "良品数 ÷ 計画生産数"],
        answer: 1,
        explanation: "OEE = 時間稼働率 × 性能稼働率 × 良品率（掛け算）です。",
      },
      {
        question: "時間稼働率90%、性能稼働率90%、良品率90%のとき、OEEは？",
        options: ["70%", "73%", "81%", "90%"],
        answer: 1,
        explanation: "0.9 × 0.9 × 0.9 = 0.729 ≒ 73%。3つすべて90%でも70%台になります。",
      },
      {
        question: "チョコ停が原因で低下するのはどの稼働率ですか？",
        options: ["時間稼働率", "性能稼働率", "良品率", "全てに影響"],
        answer: 1,
        explanation: "短時間停止のチョコ停は性能稼働率を低下させます。",
      },
    ],
  },
  {
    id: "hito-loss",
    title: "人の効率を阻害する5大ロス",
    description: "管理・動作・編成・自動化置換・測定調整",
    category: "loss-efficiency",
    grade: "2",
    order: 3,
    sections: [
      {
        type: "paragraph",
        heading: "人のロスもある",
        text: "設備の7大ロスに加え、人の効率を阻害する「5大ロス」があります。人が本来の作業に専念できない時間です。",
      },
      {
        type: "table",
        heading: "人の5大ロス",
        table: {
          headers: ["No.", "ロス", "内容"],
          rows: [
            ["1", "管理ロス", "材料待ち・指示待ち・打ち合わせの時間"],
            ["2", "動作ロス", "歩行・取り置きなど価値を生まない動作"],
            ["3", "編成ロス", "工程間の作業バランスが悪く生まれる待ち時間"],
            ["4", "自動化置換ロス", "本来は機械化できる単純作業を人がやっている"],
            ["5", "測定・調整ロス", "頻繁な測定・調整で発生するロス"],
          ],
        },
      },
    ],
    quiz: [
      {
        question: "歩行や取り置きなど価値を生まない動作のロスを何といいますか？",
        options: ["管理ロス", "動作ロス", "編成ロス", "測定調整ロス"],
        answer: 1,
        explanation: "動作ロスです。レイアウト改善や工具配置で削減します。",
      },
      {
        question: "材料待ちや指示待ちの時間に当たるのは？",
        options: ["管理ロス", "動作ロス", "編成ロス", "自動化置換ロス"],
        answer: 0,
        explanation: "管理ロスです。段取りの悪さ・指示の遅さなどから発生します。",
      },
    ],
  },
  {
    id: "genntani-loss",
    title: "原単位の3大ロス",
    description: "材料・エネルギー・型治工具の3つ",
    category: "loss-efficiency",
    grade: "2",
    order: 4,
    sections: [
      {
        type: "paragraph",
        heading: "原単位ロスとは",
        text: "「原単位」とは、製品1個あたりに使用する材料・エネルギー・治工具の量のことです。これを無駄遣いするのが原単位ロスです。",
      },
      {
        type: "definitions",
        heading: "原単位の3大ロス",
        definitions: [
          { term: "歩留りロス（材料）", def: "切粉・端材・スクラップなど。設計上必要な分以上に消費される材料。" },
          { term: "エネルギーロス", def: "電気・蒸気・圧縮空気・水などの無駄使い。空運転・漏れ・断熱不良など。" },
          { term: "型治工具ロス", def: "工具・治具の寿命短縮による交換頻度の増加、修理費用など。" },
        ],
      },
      {
        type: "note",
        heading: "16大ロスへの展開",
        text: "設備7大ロス + 人の5大ロス + 原単位3大ロス + 計画停止ロス（1つ）= 16大ロス、として整理されます。1級ではこの16大ロス全体を扱います。",
      },
    ],
    quiz: [
      {
        question: "設備の7大ロスと人の5大ロスと原単位3大ロスを合計するといくつになりますか？（計画停止ロスを除く）",
        options: ["12", "14", "15", "16"],
        answer: 2,
        explanation: "7 + 5 + 3 = 15。計画停止ロス1つを加えると16大ロスです。",
      },
    ],
  },
];

const G2_JISHU: Lesson[] = [
  {
    id: "what-is-jishu-hozen",
    title: "自主保全とは",
    description: "オペレーター主体の保全活動",
    category: "jishu-hozen",
    grade: "2",
    order: 1,
    sections: [
      {
        type: "paragraph",
        heading: "自主保全活動とは",
        text: "自主保全は「自分の設備は自分で守る」を合言葉に、現場オペレーターが日常の保全活動を主体的に行うことを指します。\n\nTPMの中核活動の一つで、専門の保全部門に頼り切るのではなく、現場の知識と気づきを活用して設備の異常を早期発見・防止します。",
      },
      {
        type: "definitions",
        heading: "自主保全 vs 計画保全",
        definitions: [
          { term: "自主保全", def: "オペレーターが行う日常保全。清掃・点検・給油・増締めが中心。" },
          { term: "計画保全", def: "保全部門が行う計画的な点検・修理。専門技術が必要な分解整備など。" },
        ],
      },
      {
        type: "bullets",
        heading: "オペレーターに求められる4つの能力",
        items: [
          "異常発見能力 — 「これはおかしい」と気づく力",
          "処置・回復能力 — 異常を元に戻せる力",
          "条件設定能力 — 正常な状態を維持する条件を決められる力",
          "維持管理能力 — 設備を良い状態に保ち続ける力",
        ],
      },
    ],
    quiz: [
      {
        question: "自主保全の合言葉として正しいのは？",
        options: ["「設備は専門家に任せよう」", "「自分の設備は自分で守る」", "「壊れたらすぐ呼ぼう」", "「機械は機械が直す」"],
        answer: 1,
        explanation: "「自分の設備は自分で守る」が自主保全の基本理念です。",
      },
      {
        question: "オペレーターに求められる4つの能力に含まれないのは？",
        options: ["異常発見能力", "処置・回復能力", "設計能力", "条件設定能力"],
        answer: 2,
        explanation: "設計能力は含まれません。設計は設計部門の仕事です。",
      },
    ],
  },
  {
    id: "7-steps",
    title: "自主保全7ステップ",
    description: "自主保全活動の7段階の展開",
    category: "jishu-hozen",
    grade: "2",
    order: 2,
    sections: [
      {
        type: "paragraph",
        heading: "7ステップで段階的に進める",
        text: "自主保全活動は7つのステップで段階的に進めます。1〜3ステップは劣化を防ぐ活動、4〜5は劣化を測る活動、6〜7は劣化を回復・改善する活動です。",
      },
      {
        type: "table",
        heading: "自主保全7ステップ",
        table: {
          headers: ["ステップ", "名称", "目的"],
          rows: [
            ["1", "初期清掃", "清掃を通じた点検と問題点の摘出"],
            ["2", "発生源・困難箇所対策", "汚れの発生源を絶ち、清掃・点検時間短縮"],
            ["3", "自主保全仮基準の作成", "清掃・点検・給油の暫定基準を決める"],
            ["4", "総点検", "設備の構造・機能を学び、点検技能を高める"],
            ["5", "自主点検", "点検効率の向上と精度の維持"],
            ["6", "標準化", "現場管理項目の体系化と維持管理の徹底"],
            ["7", "自主管理の徹底", "目標達成のための継続的改善"],
          ],
        },
      },
      {
        type: "note",
        heading: "ステップ展開のルール",
        text: "前のステップを完了せずに次に進んではいけません。各ステップごとに監査・診断を受け、合格してから次へ進むのが鉄則です。",
      },
    ],
    quiz: [
      {
        question: "自主保全の第1ステップは何ですか？",
        options: ["総点検", "初期清掃", "標準化", "自主点検"],
        answer: 1,
        explanation: "第1ステップは「初期清掃」です。徹底的な清掃を通じて問題点を見つけます。",
      },
      {
        question: "自主保全7ステップの第5ステップは何ですか？",
        options: ["総点検", "自主点検", "標準化", "発生源対策"],
        answer: 1,
        explanation: "第4「総点検」の次は第5「自主点検」です。",
      },
    ],
  },
  {
    id: "step1-cleaning",
    title: "第1ステップ：初期清掃",
    description: "徹底清掃で隠れた異常を見える化",
    category: "jishu-hozen",
    grade: "2",
    order: 3,
    sections: [
      {
        type: "paragraph",
        heading: "初期清掃の狙い",
        text: "単にきれいにすることが目的ではなく、「清掃は点検なり」の精神で、汚れの裏に隠れている異常（油漏れ・ボルトの緩み・キズ・摩耗）を見つけ出すことが狙いです。",
      },
      {
        type: "numbered",
        heading: "初期清掃の進め方",
        items: [
          "外観の徹底清掃 — まずは見える部分を完全にきれいにする",
          "細部の清掃 — カバーを開け、隙間まで清掃する",
          "不具合の発見と記録 — 気づいたことを赤札やリストで記録",
          "発生源の特定 — 「なぜここに汚れが？」と原因を探る",
          "復元 — 異常を元の正しい状態に戻す",
        ],
      },
      {
        type: "definitions",
        heading: "初期清掃で使われる管理ツール",
        definitions: [
          { term: "赤札", def: "不具合箇所に貼る札。修理が必要・要対策・要復元など色や種類で区別。" },
          { term: "白札", def: "オペレーターが自分で復元できる軽度な不具合に貼る札（赤との区別は職場により異なる）。" },
        ],
      },
    ],
    quiz: [
      {
        question: "初期清掃の本当の目的は？",
        options: ["見た目を美しくする", "汚れの裏に隠れた異常を発見する", "新人教育のため", "監査のため"],
        answer: 1,
        explanation: "「清掃は点検なり」。隠れた異常を見つけることが本質です。",
      },
      {
        question: "初期清掃で不具合箇所に貼る札を何といいますか？",
        options: ["青札", "黒札", "赤札", "黄札"],
        answer: 2,
        explanation: "赤札（あるいは白札との組合せ）で不具合箇所を見える化します。",
      },
    ],
  },
  {
    id: "basic-conditions",
    title: "基本条件 — 清掃・点検・給油・増締め",
    description: "設備の劣化を防ぐ4つの基本活動",
    category: "jishu-hozen",
    grade: "2",
    order: 4,
    sections: [
      {
        type: "paragraph",
        heading: "基本条件の整備",
        text: "設備が本来の機能を発揮するための「基本条件」は、清掃・点検・給油・増締めの4つで保たれます。これが崩れると故障の温床になります。",
      },
      {
        type: "definitions",
        heading: "4つの基本条件",
        definitions: [
          { term: "清掃", def: "ゴミ・粉塵・油汚れを取り除き、点検しやすい状態に保つ。" },
          { term: "点検", def: "五感で異常がないか確認する。音・におい・温度・振動・色など。" },
          { term: "給油", def: "正しい油を正しい量、正しい場所に、正しい頻度で注油する。" },
          { term: "増締め", def: "ボルト・ナットの緩みを規定トルクで締め直す。緩みは振動・脱落の原因。" },
        ],
      },
      {
        type: "table",
        heading: "強制劣化と自然劣化",
        table: {
          headers: ["種類", "原因", "対処"],
          rows: [
            ["強制劣化", "汚れの放置・給油不足・締め忘れ・誤操作", "基本条件を守れば防げる"],
            ["自然劣化", "経年による摩耗・疲労", "計画的に交換・修理"],
          ],
        },
      },
    ],
    quiz: [
      {
        question: "設備の基本条件4つに含まれないのは？",
        options: ["清掃", "点検", "塗装", "給油"],
        answer: 2,
        explanation: "塗装は基本条件に含まれません。清掃・点検・給油・増締めの4つです。",
      },
      {
        question: "汚れの放置や給油不足で起こる劣化を何といいますか？",
        options: ["自然劣化", "経年劣化", "強制劣化", "突発劣化"],
        answer: 2,
        explanation: "人為的な要因で発生する強制劣化です。基本条件を守れば防げます。",
      },
    ],
  },
];

const G2_KAIZEN: Lesson[] = [
  {
    id: "naze-naze",
    title: "なぜなぜ分析",
    description: "5回のなぜで真因にたどり着く",
    category: "kaizen-kaiseki",
    grade: "2",
    order: 1,
    sections: [
      {
        type: "paragraph",
        heading: "なぜなぜ分析とは",
        text: "問題の原因を「なぜ？」と繰り返し問いかけて、根本原因（真因）にたどり着く手法です。トヨタ生産方式で有名になりました。\n\n「5回のなぜ」と呼ばれることもありますが、回数より「真因にたどり着いたかどうか」が重要です。",
      },
      {
        type: "numbered",
        heading: "なぜなぜ分析の例（オイル漏れ）",
        items: [
          "問題: オイルが床に漏れていた",
          "なぜ1: ホースから漏れていた → なぜ？",
          "なぜ2: ホースに亀裂があった → なぜ？",
          "なぜ3: 経年で硬化していた → なぜ？",
          "なぜ4: 交換時期を過ぎていた → なぜ？",
          "なぜ5: 点検基準にホース寿命の項目がなかった → 真因！",
        ],
      },
      {
        type: "bullets",
        heading: "なぜなぜ分析のコツ",
        items: [
          "個人の責任ではなく、仕組みの不備を探す",
          "「不注意だった」「うっかり」は不可。なぜ不注意になるかを問う",
          "事実に基づいて掘り下げる（推測ではない）",
          "対策が「教育する」「気をつける」になったらやり直し",
        ],
      },
    ],
    quiz: [
      {
        question: "なぜなぜ分析の目的は？",
        options: ["責任者を特定すること", "真因にたどり着くこと", "報告書を作ること", "ミーティング時間を埋めること"],
        answer: 1,
        explanation: "真因（根本原因）にたどり着いて、再発防止策を打つのが目的です。",
      },
      {
        question: "なぜなぜ分析の対策として不適切なのは？",
        options: ["点検基準の改訂", "標準作業の見直し", "本人に注意して気をつけさせる", "ポカヨケの設置"],
        answer: 2,
        explanation: "「気をつける」は仕組みではないので対策になりません。仕組みで防ぐ案が必要です。",
      },
    ],
  },
  {
    id: "qc-7-tools",
    title: "QC七つ道具",
    description: "問題解決のための7つの図表ツール",
    category: "kaizen-kaiseki",
    grade: "2",
    order: 2,
    sections: [
      {
        type: "paragraph",
        heading: "QC七つ道具とは",
        text: "QC活動で使う代表的な7つの図表ツール。データを見える化することで問題の発見と分析を助けます。",
      },
      {
        type: "table",
        heading: "QC七つ道具一覧",
        table: {
          headers: ["No.", "ツール", "使い方"],
          rows: [
            ["1", "パレート図", "原因を多い順に並べて重点を見つける"],
            ["2", "特性要因図（フィッシュボーン）", "結果に対する原因を4Mで整理"],
            ["3", "ヒストグラム", "データのばらつきの形を見る"],
            ["4", "散布図", "2つのデータの相関を見る"],
            ["5", "管理図", "工程が安定しているかを時系列で見る"],
            ["6", "チェックシート", "データ収集を効率化する用紙"],
            ["7", "グラフ", "データを視覚的に表現（棒・折れ線・円など）"],
          ],
        },
      },
    ],
    quiz: [
      {
        question: "原因を多い順に並べて重点を見つけるのに使うのは？",
        options: ["散布図", "ヒストグラム", "パレート図", "管理図"],
        answer: 2,
        explanation: "パレート図は重点指向の象徴的なツールです。",
      },
      {
        question: "魚の骨のような形で原因を整理する図は？",
        options: ["特性要因図", "管理図", "散布図", "チェックシート"],
        answer: 0,
        explanation: "特性要因図（フィッシュボーン）は4Mで原因を整理します。",
      },
      {
        question: "工程の安定性を時系列で見るための図はどれですか？",
        options: ["ヒストグラム", "管理図", "散布図", "パレート図"],
        answer: 1,
        explanation: "管理図は工程の時系列推移を見て、異常の検出に使います。",
      },
    ],
  },
  {
    id: "pdca",
    title: "PDCAサイクル",
    description: "改善活動の基本サイクル",
    category: "kaizen-kaiseki",
    grade: "2",
    order: 3,
    sections: [
      {
        type: "paragraph",
        heading: "PDCAサイクルとは",
        text: "Plan（計画）→ Do（実行）→ Check（評価）→ Act（改善）の頭文字を取ったもの。改善活動を回し続けるための基本フレームワークです。",
      },
      {
        type: "definitions",
        heading: "各ステップ",
        definitions: [
          { term: "P (Plan)", def: "目標を立て、達成のための計画を作る。" },
          { term: "D (Do)", def: "計画を実行する。記録を取る。" },
          { term: "C (Check)", def: "実行結果を計画と比較し、評価する。" },
          { term: "A (Act)", def: "差異の原因を分析し、次のサイクルに反映する。" },
        ],
      },
      {
        type: "note",
        heading: "らせん階段のイメージ",
        text: "PDCAは同じ場所を回るのではなく、らせん階段のように上昇しながら回すのが理想です。1周ごとに改善のレベルが上がります。",
      },
    ],
    quiz: [
      {
        question: "PDCAサイクルのDが意味するのは？",
        options: ["Design", "Do", "Develop", "Decide"],
        answer: 1,
        explanation: "DはDo（実行）です。",
      },
      {
        question: "PDCAサイクルの順序として正しいのは？",
        options: ["Plan → Do → Check → Act", "Plan → Act → Do → Check", "Do → Plan → Check → Act", "Check → Plan → Do → Act"],
        answer: 0,
        explanation: "Plan → Do → Check → Act の順序が基本です。",
      },
    ],
  },
];

const G2_SETSUBI: Lesson[] = [
  {
    id: "kikai-yousou",
    title: "機械要素の基礎",
    description: "ボルト・軸受・歯車・ベルトの基本",
    category: "setsubi-hozen",
    grade: "2",
    order: 1,
    sections: [
      {
        type: "paragraph",
        heading: "機械要素とは",
        text: "機械を構成する標準化された部品群を「機械要素」と呼びます。締結・回転・伝達など、用途別に種類があります。",
      },
      {
        type: "definitions",
        heading: "主要な機械要素",
        definitions: [
          { term: "ボルト・ナット", def: "ねじを利用した締結要素。緩み防止にはダブルナット・ワッシャ・ロックタイトなどを使う。" },
          { term: "軸受（ベアリング）", def: "回転軸を支える要素。転がり軸受（ボール・ローラ）と滑り軸受がある。給油が重要。" },
          { term: "歯車", def: "回転を伝える要素。平歯車・はすば歯車・かさ歯車などがある。歯面の摩耗・欠損が劣化指標。" },
          { term: "ベルト", def: "離れた2軸間で動力を伝える。Vベルト・タイミングベルトなどがある。張力管理が必要。" },
          { term: "チェーン", def: "確実な伝達ができる動力伝達要素。給油と張力調整が必要。" },
          { term: "軸継手（カップリング）", def: "2つの軸をつなぐ要素。固定式・可とう式（フランジ・歯車・ゴム継手）がある。" },
        ],
      },
      {
        type: "bullets",
        heading: "点検のポイント",
        items: [
          "ボルト: 規定トルクで締まっているか、合いマークのずれは？",
          "軸受: 異音・振動・温度上昇はないか？",
          "歯車: 歯面の摩耗・偏摩耗・欠損はないか？",
          "ベルト: 張力は適正か、片伸び・亀裂はないか？",
          "チェーン: 給油状態、伸びはないか？",
        ],
      },
    ],
    quiz: [
      {
        question: "転がり軸受の主な異常兆候として正しいのは？",
        options: ["塗装の剥がれ", "異音・振動・温度上昇", "緩みのみ", "色の変化のみ"],
        answer: 1,
        explanation: "軸受の劣化は異音・振動・温度上昇が代表的な兆候です。",
      },
      {
        question: "ボルトの緩み確認のために付ける印を何といいますか？",
        options: ["指示マーク", "合いマーク", "完成マーク", "監査マーク"],
        answer: 1,
        explanation: "ボルトとナットにまたがって引く線を「合いマーク」といい、ずれで緩みを判定します。",
      },
    ],
  },
  {
    id: "junkatu",
    title: "潤滑の基本",
    description: "油の種類・給油方式・劣化",
    category: "setsubi-hozen",
    grade: "2",
    order: 2,
    sections: [
      {
        type: "paragraph",
        heading: "潤滑の役割",
        text: "潤滑剤（油・グリース）は機械の摩擦を減らし、磨耗・焼付き・発熱を防ぎます。「正しい油を・正しい量・正しい場所・正しい時に」が原則です。",
      },
      {
        type: "definitions",
        heading: "潤滑剤の種類",
        definitions: [
          { term: "潤滑油", def: "粘度で分類（ISO VG32, VG46, VG68など数字が大きいほど粘度高）。鉱物油・合成油などがある。" },
          { term: "グリース", def: "潤滑油に増ちょう剤を混ぜた半固体。漏れにくく長期間使えるが熱に弱い。ちょう度で硬さを分類。" },
        ],
      },
      {
        type: "table",
        heading: "潤滑油劣化の兆候",
        table: {
          headers: ["兆候", "原因", "対処"],
          rows: [
            ["黒色化", "酸化・スラッジ", "油交換"],
            ["白濁", "水分混入", "水分除去・原因調査"],
            ["金属粉混入", "摩耗・損傷", "油交換+設備点検"],
            ["異臭", "高温劣化", "油交換+冷却確認"],
          ],
        },
      },
    ],
    quiz: [
      {
        question: "潤滑油の「ISO VG46」のVG46は何を表しますか？",
        options: ["精度等級", "粘度等級", "色番号", "メーカー番号"],
        answer: 1,
        explanation: "VG（Viscosity Grade）= 粘度等級です。数字が大きいほど粘度が高くなります。",
      },
      {
        question: "潤滑油が白濁する原因として最も適切なのは？",
        options: ["酸化", "水分混入", "金属粉", "高温劣化"],
        answer: 1,
        explanation: "水分が混入すると油が白濁します。早急に水分除去と原因調査が必要です。",
      },
      {
        question: "グリースの硬さを表す指標は何ですか？",
        options: ["粘度", "ちょう度", "比重", "引火点"],
        answer: 1,
        explanation: "グリースは「ちょう度」で硬さを表します（数値が小さいほど硬い）。",
      },
    ],
  },
  {
    id: "denki-kiso",
    title: "電気の基本",
    description: "モータ・配線・電気安全",
    category: "setsubi-hozen",
    grade: "2",
    order: 3,
    sections: [
      {
        type: "paragraph",
        heading: "電気を扱う心構え",
        text: "電気は目に見えないため、感電・短絡・発火など重大事故につながります。資格のない作業は厳禁、保護具と手順を守る必要があります。",
      },
      {
        type: "definitions",
        heading: "基本用語",
        definitions: [
          { term: "電圧（V）", def: "電気を押し流す力。日本の一般工場は単相100V/200V・三相200V/400Vなど。" },
          { term: "電流（A）", def: "実際に流れる電気の量。" },
          { term: "電力（W）", def: "消費するエネルギー。 W = V × A。" },
          { term: "三相モータ", def: "工場の主力動力源。Y結線・Δ結線で起動方式を変えられる。" },
        ],
      },
      {
        type: "warning",
        heading: "電気作業の5原則",
        text: "① 電源を切る ② 検電器で確認 ③ 短絡接地 ④ 表示札（作業中・触るな）⑤ 施錠（LOTO: Lock Out / Tag Out）",
      },
    ],
    quiz: [
      {
        question: "電気作業の前にまずやることは？",
        options: ["材料の準備", "電源を切る", "工具の確認", "保護具の調整"],
        answer: 1,
        explanation: "まず電源を切り、検電して安全を確認するのが鉄則です。",
      },
      {
        question: "電力（W）の計算式として正しいのは？",
        options: ["W = V + A", "W = V × A", "W = V ÷ A", "W = A ÷ V"],
        answer: 1,
        explanation: "電力は電圧×電流（W = V × A）で表されます。",
      },
      {
        question: "モータの絶縁抵抗を測る計器はどれですか？",
        options: ["テスタ", "メガー（絶縁抵抗計）", "オシロスコープ", "クランプメータ"],
        answer: 1,
        explanation: "メガー（絶縁抵抗計）で絶縁の良否を判定します。",
      },
    ],
  },
];

const G1_SEISAN: Lesson[] = [
  {
    id: "tpm-8-pillars",
    title: "TPM8本柱",
    description: "TPM活動を支える8つの活動領域",
    category: "seisan-kihon",
    grade: "1",
    order: 1,
    sections: [
      {
        type: "paragraph",
        heading: "TPM 8本柱とは",
        text: "TPM活動は「8本柱」という8つの主要活動で構成されます。当初は5本柱でしたが、間接部門や品質保全などを加えて8本柱に拡張されました。",
      },
      {
        type: "table",
        heading: "TPM 8本柱",
        table: {
          headers: ["No.", "活動", "目的"],
          rows: [
            ["1", "個別改善", "ロスをゼロに近づける改善活動"],
            ["2", "自主保全", "現場主体の日常保全活動"],
            ["3", "計画保全", "保全部門による計画的整備"],
            ["4", "教育訓練", "技能・知識を高める人材育成"],
            ["5", "初期管理（MP設計）", "新製品・新設備の立ち上げ管理"],
            ["6", "品質保全", "不良ゼロの設備条件管理"],
            ["7", "事務間接効率化", "管理間接部門のロス削減"],
            ["8", "安全衛生・環境", "災害ゼロ・環境配慮"],
          ],
        },
      },
      {
        type: "definitions",
        heading: "計画保全の進化",
        definitions: [
          { term: "BM（事後保全）", def: "故障してから修理する。最も原始的。" },
          { term: "PM（予防保全）", def: "定期的に点検・部品交換し、故障を未然に防ぐ。" },
          { term: "CBM（状態基準保全）", def: "設備状態を計測し、必要な時だけ保全する。最も合理的。" },
        ],
      },
    ],
    quiz: [
      {
        question: "TPM 8本柱に含まれないのはどれですか？",
        options: ["個別改善", "自主保全", "営業効率化", "品質保全"],
        answer: 2,
        explanation: "営業効率化は8本柱に含まれません。事務間接効率化は含まれます。",
      },
      {
        question: "計画保全の進化順序として正しいのは？",
        options: ["BM → PM → CBM", "PM → BM → CBM", "CBM → BM → PM", "BM → CBM → PM"],
        answer: 0,
        explanation: "BM（事後保全）→PM（予防保全）→CBM（予知保全）と発展します。",
      },
    ],
  },
  {
    id: "risk-assessment",
    title: "リスクアセスメント",
    description: "ハザード特定とリスクの定量評価",
    category: "seisan-kihon",
    grade: "1",
    order: 2,
    sections: [
      {
        type: "paragraph",
        heading: "リスクアセスメントとは",
        text: "作業に潜む危険（ハザード）を洗い出し、リスクの大きさを評価して優先順位をつけ、対策を講じる体系的な手法。労働安全衛生法でも事業者の努力義務とされています。",
      },
      {
        type: "formula",
        heading: "リスクの定量化",
        text: "リスク = 重篤度（けがの大きさ） × 可能性（発生確率）\n\nそれぞれを点数化（例: 1〜5）し、掛け合わせてリスクポイントを算出。",
      },
      {
        type: "definitions",
        heading: "リスク低減の優先順位（4段階）",
        definitions: [
          { term: "本質安全", def: "危険源そのものを取り除く。最優先の対策。" },
          { term: "工学的対策", def: "ガード・インターロック・センサーなどで隔離・停止。" },
          { term: "管理的対策", def: "手順書・教育・標識など。人の注意に依存する。" },
          { term: "個人用保護具（PPE）", def: "最後の手段。前の対策ができないときに装着。" },
        ],
      },
    ],
    quiz: [
      {
        question: "リスクの計算式として正しいのは？",
        options: ["重篤度 + 可能性", "重篤度 × 可能性", "重篤度 ÷ 可能性", "重篤度 - 可能性"],
        answer: 1,
        explanation: "リスク = 重篤度 × 可能性 が一般的な定量化の式です。",
      },
      {
        question: "リスク低減措置で最優先となるのは？",
        options: ["個人用保護具", "管理的対策", "工学的対策", "本質安全"],
        answer: 3,
        explanation: "危険源そのものを取り除く本質安全が最優先です。",
      },
    ],
  },
  {
    id: "opl-training",
    title: "OPLと教育訓練",
    description: "One Point Lessonによる現場教育",
    category: "seisan-kihon",
    grade: "1",
    order: 3,
    sections: [
      {
        type: "paragraph",
        heading: "OPLとは",
        text: "One Point Lesson（ワンポイントレッスン）。A4・1枚にまとめた現場教育用の教材。10分以内で読めて、1つのテーマに絞った内容にするのがポイントです。",
      },
      {
        type: "definitions",
        heading: "OPLの3種類",
        definitions: [
          { term: "基礎知識OPL", def: "「ボルトの締め方」「軸受の構造」など、共通基礎を教える。" },
          { term: "改善事例OPL", def: "「こんな改善をしてこうなった」を共有して水平展開を促す。" },
          { term: "トラブル事例OPL", def: "「こんなトラブルが起きた、こう防ぐ」を共有して再発防止。" },
        ],
      },
      {
        type: "bullets",
        heading: "OPL作成のコツ",
        items: [
          "A4 1枚以内、図やイラストを多用",
          "テーマは1つに絞る",
          "10分以内で理解できる量",
          "良い例・悪い例を対比",
          "「なぜそうするか」の理由を書く",
        ],
      },
    ],
    quiz: [
      {
        question: "OPLの分量として推奨されるのは？",
        options: ["A3・1〜2枚", "A4・1枚", "A5・複数枚", "B5・3枚"],
        answer: 1,
        explanation: "A4・1枚、10分以内で理解できる量が基本です。",
      },
    ],
  },
];

const G1_LOSS: Lesson[] = [
  {
    id: "16-losses",
    title: "16大ロスの全体構造",
    description: "設備・人・原単位・計画停止すべてを統合",
    category: "loss-efficiency",
    grade: "1",
    order: 1,
    sections: [
      {
        type: "paragraph",
        heading: "16大ロスとは",
        text: "TPMで扱うすべてのロスを統合した分類です。設備の効率を阻害する7つ、人の効率を阻害する5つ、原単位を悪化させる3つ、計画停止1つ、合計16のロスとして整理されます。",
      },
      {
        type: "table",
        heading: "16大ロスの全体像",
        table: {
          headers: ["分類", "ロスの種類", "個数"],
          rows: [
            ["設備の効率阻害", "故障・段取り・刃具・立上り・チョコ停・速度低下・不良", "7"],
            ["人の効率阻害", "管理・動作・編成・自動化置換・測定調整", "5"],
            ["原単位ロス", "歩留・エネルギー・型治工具", "3"],
            ["計画停止", "保全・休憩などの計画的な非稼働", "1"],
          ],
        },
      },
    ],
    quiz: [
      {
        question: "16大ロスのうち「人の効率を阻害するロス」はいくつありますか？",
        options: ["3", "5", "7", "8"],
        answer: 1,
        explanation: "管理・動作・編成・自動化置換・測定調整の5つです。",
      },
    ],
  },
  {
    id: "teep-bottleneck",
    title: "TEEPとボトルネック分析",
    description: "OEEを超えた「真の効率」の追求",
    category: "loss-efficiency",
    grade: "1",
    order: 2,
    sections: [
      {
        type: "paragraph",
        heading: "TEEPとは",
        text: "Total Effective Equipment Performance（総合設備性能）。OEEに加えて「設備稼働率（負荷時間 ÷ 暦時間）」を掛けます。「24時間 365日のうち、実際に良品を作っていた割合」を表します。",
      },
      {
        type: "formula",
        heading: "TEEPの計算式",
        text: "TEEP = 設備稼働率 × OEE\n     = 設備稼働率 × 時間稼働率 × 性能稼働率 × 良品率\n\n例: 設備稼働率 50%（2交替）× OEE 80% = TEEP 40%",
      },
      {
        type: "paragraph",
        heading: "ボトルネック分析",
        text: "ライン全体の生産性は「最も遅い工程」に律速されます。これがボトルネックです。\n\nボトルネックの改善がライン全体の改善効果を最大化します。",
      },
    ],
    quiz: [
      {
        question: "TEEPとOEEの違いは何ですか？",
        options: ["TEEPは設備稼働率（負荷時間/暦時間）を含む", "TEEPは良品率を含まない", "TEEPは時間稼働率のみ", "TEEPはコストを含む"],
        answer: 0,
        explanation: "TEEPはOEEに設備稼働率（負荷時間 ÷ 暦時間）を加えた指標です。",
      },
      {
        question: "ボトルネック工程の特徴は？",
        options: ["最も早い工程", "最も遅い（ライン速度を律速している）工程", "最もコストが安い工程", "最も人数が多い工程"],
        answer: 1,
        explanation: "ライン全体の速度を律速する最も遅い工程がボトルネックです。",
      },
    ],
  },
];

const G1_JISHU: Lesson[] = [
  {
    id: "step2-3",
    title: "第2-3ステップ：発生源対策と仮基準",
    description: "汚れの根絶と暫定ルールづくり",
    category: "jishu-hozen",
    grade: "1",
    order: 1,
    sections: [
      {
        type: "paragraph",
        heading: "第2ステップ：発生源・困難箇所対策",
        text: "初期清掃で「すぐ汚れる」「清掃しにくい」場所が見つかります。これを根本対策するのが第2ステップ。からくり改善・カバー追加・配管変更などで対処します。",
      },
      {
        type: "bullets",
        heading: "発生源対策の例",
        items: [
          "切粉の飛散 → 飛散防止カバー追加",
          "油の漏れ → パッキン交換・回収トレイ設置",
          "粉塵 → 局所排気の追加",
          "清掃困難箇所 → 点検窓の設置・分解可能化",
        ],
      },
      {
        type: "paragraph",
        heading: "第3ステップ：自主保全仮基準",
        text: "清掃・点検・給油の暫定基準（時間・頻度・方法）をオペレーター自身が作成します。守れる基準が肝心で、後で改訂しながら洗練していきます。",
      },
      {
        type: "note",
        heading: "「守れる基準」が原則",
        text: "詳細すぎる基準は守られません。最初は60%の精度でも、運用しながら磨いていく方が成功します。",
      },
    ],
    quiz: [
      {
        question: "自主保全 第2ステップの目的は？",
        options: ["清掃に時間をかけること", "汚れの発生源を絶ち困難箇所を改善すること", "標準化", "総点検"],
        answer: 1,
        explanation: "発生源対策と困難箇所改善が第2ステップの目的です。",
      },
      {
        question: "仮基準作成で重要な原則は？",
        options: ["細かいほど良い", "守れる基準にする", "管理者が作る", "改訂しない"],
        answer: 1,
        explanation: "「守れる基準」が原則。守られない基準は意味がありません。",
      },
    ],
  },
  {
    id: "step4-5",
    title: "第4-5ステップ：総点検と自主点検",
    description: "設備技能を高め点検精度を上げる",
    category: "jishu-hozen",
    grade: "1",
    order: 2,
    sections: [
      {
        type: "paragraph",
        heading: "第4ステップ：総点検",
        text: "設備の構造・機能を学び、専門家でなくても点検できる技能を身につけるステップです。「総点検教育」を通じて、ボルト・潤滑・油圧・電気などの基本技能を養います。",
      },
      {
        type: "bullets",
        heading: "総点検教育のテーマ例",
        items: [
          "ボルト・ナット — 規定トルク・緩み発見・合いマーク",
          "潤滑 — 油の種類・給油方式・劣化判定",
          "駆動系 — チェーン・ベルト・歯車の点検",
          "油圧・空気圧 — 漏れ・圧力・温度",
          "電気 — 端子の緩み・絶縁・接地",
        ],
      },
      {
        type: "paragraph",
        heading: "第5ステップ：自主点検",
        text: "総点検で学んだ技能を活かし、仮基準を磨き上げて「自主点検基準書」を確立します。点検時間の短縮、効率化、ポカヨケ化が課題になります。",
      },
    ],
    quiz: [
      {
        question: "第4ステップ「総点検」の目的は？",
        options: ["設備の構造・機能を学び点検技能を高める", "清掃の徹底", "標準化", "改善活動"],
        answer: 0,
        explanation: "総点検教育を通じて、専門家でなくても点検できる技能を養うのが目的です。",
      },
    ],
  },
];

const G1_KAIZEN: Lesson[] = [
  {
    id: "pm-analysis",
    title: "PM分析",
    description: "Phenomenon-Mechanism分析で慢性ロスを撲滅",
    category: "kaizen-kaiseki",
    grade: "1",
    order: 1,
    sections: [
      {
        type: "paragraph",
        heading: "PM分析とは",
        text: "Phenomenon（現象）とPhysical/Mechanism（物理メカニズム）の頭文字。\n\nなぜなぜ分析で解けない慢性的なロスや微欠陥を、物理現象から科学的に追究する手法です。",
      },
      {
        type: "numbered",
        heading: "PM分析の8ステップ",
        items: [
          "現象の明確化 — 何が・いつ・どこで",
          "現象の物理的解析 — 物理原理で説明",
          "成立条件の列挙 — その現象が起きる物理条件すべて",
          "4M（人・機・材・法）との関連付け",
          "あるべき姿の設定",
          "調査方法の決定",
          "現状と「あるべき姿」の差を測定",
          "対策の立案・実施",
        ],
      },
      {
        type: "note",
        heading: "なぜなぜとの違い",
        text: "なぜなぜが「論理的に追究」するのに対し、PM分析は「物理的・科学的に追究」します。慢性的な不良・微欠陥に効果的です。",
      },
    ],
    quiz: [
      {
        question: "PM分析のPは何の略ですか？",
        options: ["Production", "Phenomenon（現象）", "Prevention", "Plant"],
        answer: 1,
        explanation: "Phenomenon（現象）の頭文字です。Mは物理メカニズム。",
      },
      {
        question: "PM分析が特に有効な問題は？",
        options: ["原因がはっきりした故障", "慢性的に発生する微欠陥や原因不明の不良", "段取り時間短縮", "教育課題"],
        answer: 1,
        explanation: "慢性的・複合的な問題で、なぜなぜでは解けない場合に効果を発揮します。",
      },
    ],
  },
  {
    id: "ie-methods",
    title: "IE手法",
    description: "動作分析・時間分析・稼働分析",
    category: "kaizen-kaiseki",
    grade: "1",
    order: 2,
    sections: [
      {
        type: "paragraph",
        heading: "IEとは",
        text: "Industrial Engineering（生産工学）。作業や工程を科学的に分析し、最適化する手法体系。「人の作業」を改善するのに強い。",
      },
      {
        type: "definitions",
        heading: "代表的なIE手法",
        definitions: [
          { term: "動作分析（サーブリッグ）", def: "作業者の手の動きを18種類の基本動素に分解して分析。" },
          { term: "時間分析（タイムスタディ）", def: "ストップウォッチで作業時間を測り、標準時間を設定する。" },
          { term: "稼働分析（ワークサンプリング）", def: "ランダムな時刻に作業者を観察し、稼働率を統計的に算出。" },
          { term: "工程分析", def: "材料・人・情報の流れを記号で表現し、無駄を発見。" },
          { term: "ライン編成", def: "工程間のサイクルタイムを揃え、無駄な待ちをなくす。" },
        ],
      },
    ],
    quiz: [
      {
        question: "IEのIは何の略ですか？",
        options: ["International", "Industrial（生産工学）", "Information", "Internal"],
        answer: 1,
        explanation: "Industrial Engineering（生産工学）です。",
      },
      {
        question: "ワークサンプリングは何を分析する手法ですか？",
        options: ["材料の流れ", "稼働率（観測時点の作業状態の統計）", "動素", "標準時間"],
        answer: 1,
        explanation: "ランダムな時刻に観察して、稼働状態の割合を統計的に求めます。",
      },
    ],
  },
];

const G1_SETSUBI: Lesson[] = [
  {
    id: "shindan",
    title: "設備診断技術",
    description: "振動・温度・油分析による状態監視",
    category: "setsubi-hozen",
    grade: "1",
    order: 1,
    sections: [
      {
        type: "paragraph",
        heading: "設備診断技術とは",
        text: "設備の状態を計測機器で定量的に把握し、異常の予兆を早期発見する技術。CBM（状態基準保全）の基盤となります。",
      },
      {
        type: "table",
        heading: "代表的な診断技術",
        table: {
          headers: ["技術", "対象", "判定指標"],
          rows: [
            ["振動診断", "回転機械（モータ・ポンプ・軸受）", "振動加速度・速度・変位"],
            ["温度診断", "電気設備・軸受・配管", "赤外線サーモグラフィの温度分布"],
            ["油分析", "潤滑油・作動油", "金属粉量・水分・粘度・酸価"],
            ["音響診断", "リーク・ベアリング", "超音波・可聴音"],
            ["電流診断", "モータ", "電流波形・FFT解析"],
          ],
        },
      },
      {
        type: "definitions",
        heading: "信頼性工学の用語",
        definitions: [
          { term: "MTBF", def: "Mean Time Between Failures。平均故障間隔。高いほど信頼性高い。" },
          { term: "MTTR", def: "Mean Time To Repair。平均修理時間。短いほど保全性高い。" },
          { term: "稼働率", def: "Availability = MTBF / (MTBF + MTTR)" },
          { term: "バスタブ曲線", def: "初期故障期 → 偶発故障期 → 摩耗故障期 と推移する故障率の曲線。" },
        ],
      },
      {
        type: "formula",
        heading: "稼働率の計算式",
        text: "稼働率 = MTBF / (MTBF + MTTR)\n\n例: MTBF 100h, MTTR 5h → 100 / 105 = 95.2%",
      },
    ],
    quiz: [
      {
        question: "MTBFは何の指標ですか？",
        options: ["平均修理時間", "平均故障間隔", "稼働率", "故障件数"],
        answer: 1,
        explanation: "Mean Time Between Failures = 平均故障間隔です。",
      },
      {
        question: "MTBF 80h、MTTR 20h のときの稼働率は？",
        options: ["50%", "75%", "80%", "100%"],
        answer: 2,
        explanation: "80 / (80 + 20) = 80%。MTBFとMTTRから稼働率を計算できます。",
      },
      {
        question: "バスタブ曲線の3つの期間に含まれないのは？",
        options: ["初期故障期", "偶発故障期", "回復期", "摩耗故障期"],
        answer: 2,
        explanation: "「回復期」は含まれません。初期・偶発・摩耗の3期です。",
      },
    ],
  },
  {
    id: "plc-sequence",
    title: "PLCとシーケンス制御",
    description: "プログラマブル・ロジック・コントローラの基本",
    category: "setsubi-hozen",
    grade: "1",
    order: 2,
    sections: [
      {
        type: "paragraph",
        heading: "PLCとは",
        text: "Programmable Logic Controller。リレー回路をプログラムで実現する制御装置。工場の自動制御の中核を担います。",
      },
      {
        type: "definitions",
        heading: "シーケンス制御の基本要素",
        definitions: [
          { term: "入力（X）", def: "押しボタン・センサーなど外部からの信号。" },
          { term: "出力（Y）", def: "モータ・ランプ・電磁弁などへの信号。" },
          { term: "内部リレー（M）", def: "プログラム内部で使う仮想リレー。" },
          { term: "タイマ（T）", def: "時間遅延を作る要素。" },
          { term: "カウンタ（C）", def: "回数を数える要素。" },
        ],
      },
      {
        type: "bullets",
        heading: "ラダー図の基本記号",
        items: [
          "──| |── A接点（NO: Normally Open）",
          "──|/|── B接点（NC: Normally Closed）",
          "──( )── コイル（出力）",
        ],
      },
    ],
    quiz: [
      {
        question: "PLCの正式名称は？",
        options: ["Process Logic Computer", "Programmable Logic Controller", "Plant Loop Controller", "Power Line Communication"],
        answer: 1,
        explanation: "Programmable Logic Controller（プログラマブル・ロジック・コントローラ）です。",
      },
      {
        question: "ラダー図の「──| |──」は何を表しますか？",
        options: ["B接点", "A接点", "コイル", "タイマ"],
        answer: 1,
        explanation: "A接点（NO接点）。条件が成立するとONになる接点です。",
      },
    ],
  },
];

export const ALL_LESSONS: Lesson[] = [
  ...G2_SEISAN, ...G2_LOSS, ...G2_JISHU, ...G2_KAIZEN, ...G2_SETSUBI,
  ...G1_SEISAN, ...G1_LOSS, ...G1_JISHU, ...G1_KAIZEN, ...G1_SETSUBI,
  ...EXTRA_LESSONS_G2, ...EXTRA_LESSONS_G1,
];

export function getLessons(grade: Grade, category: CategoryId): Lesson[] {
  return ALL_LESSONS.filter((l) => l.grade === grade && l.category === category).sort(
    (a, b) => a.order - b.order
  );
}

export function getLesson(grade: Grade, category: CategoryId, lessonId: string): Lesson | null {
  return ALL_LESSONS.find(
    (l) => l.grade === grade && l.category === category && l.id === lessonId
  ) ?? null;
}

export function getCategoryInfo(id: CategoryId): Category | null {
  return CATEGORIES.find((c) => c.id === id) ?? null;
}

export function getCategoryStorageId(grade: Grade, category: CategoryId): string {
  return `${grade}-${category}`;
}

export function getAllStaticParams() {
  return ALL_LESSONS.map((l) => ({ grade: l.grade, category: l.category, lesson: l.id }));
}

export function getAllCategoryParams() {
  const set = new Set<string>();
  const out: { grade: Grade; category: CategoryId }[] = [];
  for (const l of ALL_LESSONS) {
    const key = `${l.grade}-${l.category}`;
    if (!set.has(key)) {
      set.add(key);
      out.push({ grade: l.grade, category: l.category });
    }
  }
  return out;
}

export function getAllGradeParams() {
  return [{ grade: "2" as Grade }, { grade: "1" as Grade }];
}
