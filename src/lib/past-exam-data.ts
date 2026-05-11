import type { QuizQuestion } from "@/components/quiz";
import type { Grade } from "@/lib/lessons-data";

export interface ExamSet {
  id: string;
  title: string;
  grade: Grade;
  description: string;
  questions: QuizQuestion[];
}

const EXAM_G2: QuizQuestion[] = [
  { question: "TPMが目指す「ゼロ」の組み合わせとして正しいのは？", options: ["故障・残業・災害・ロス・クレーム", "故障・不良・災害・ロス・クレーム", "故障・不良・残業・遅刻・在庫", "故障・不良・在庫・コスト・納期遅れ"], answer: 1, explanation: "故障・不良・災害・ロス・クレームの5つのゼロを目指します。" },
  { question: "5Sの順序として正しいのは？", options: ["整頓 → 整理 → 清掃 → 清潔 → しつけ", "整理 → 整頓 → 清掃 → 清潔 → しつけ", "清掃 → 整理 → 整頓 → 清潔 → しつけ", "整理 → 清掃 → 整頓 → 清潔 → しつけ"], answer: 1, explanation: "整理→整頓→清掃→清潔→しつけ の順です。" },
  { question: "ハインリッヒの法則の比率は？", options: ["1:5:30", "1:10:100", "1:29:300", "1:50:500"], answer: 2, explanation: "1（重大）：29（軽傷）：300（ヒヤリハット）です。" },
  { question: "設備7大ロスに含まれないのは？", options: ["故障ロス", "立上りロス", "管理ロス", "速度低下ロス"], answer: 2, explanation: "管理ロスは人の5大ロスです。" },
  { question: "OEEの計算式は？", options: ["時間稼働率 + 性能稼働率 + 良品率", "時間稼働率 × 性能稼働率 × 良品率", "稼働時間 ÷ 暦時間", "良品数 ÷ 生産計画数"], answer: 1, explanation: "OEE = 時間稼働率 × 性能稼働率 × 良品率（掛け算）。" },
  { question: "時間稼働率80%、性能稼働率90%、良品率95%のときのOEEは？", options: ["約68%", "約78%", "約85%", "約92%"], answer: 0, explanation: "0.80 × 0.90 × 0.95 = 0.684 ≒ 68%。" },
  { question: "自主保全 第1ステップは？", options: ["総点検", "初期清掃", "標準化", "自主点検"], answer: 1, explanation: "第1ステップは「初期清掃」。徹底清掃で異常を発見します。" },
  { question: "「清掃は点検なり」の意味として正しいのは？", options: ["清掃の前に点検する", "清掃しながら設備の異常を発見する", "点検後に清掃する", "清掃は専門の点検員がやる"], answer: 1, explanation: "清掃を通じて設備状態の異常を発見する活動です。" },
  { question: "設備の基本条件4つに含まれないのは？", options: ["清掃", "点検", "給油", "塗装"], answer: 3, explanation: "清掃・点検・給油・増締めの4つです。塗装は含まれません。" },
  { question: "汚れの放置・給油不足など人為的に発生する劣化は？", options: ["自然劣化", "経年劣化", "強制劣化", "突発劣化"], answer: 2, explanation: "強制劣化です。基本条件を守れば防げます。" },
  { question: "なぜなぜ分析で避けるべき対策は？", options: ["標準作業の改訂", "ポカヨケの設置", "「気をつける」「教育する」", "点検基準の追加"], answer: 2, explanation: "「気をつける」「教育する」は仕組みではないため対策になりません。" },
  { question: "QC七つ道具で「魚の骨」の形をしている図は？", options: ["パレート図", "特性要因図", "ヒストグラム", "管理図"], answer: 1, explanation: "特性要因図（フィッシュボーン）です。4Mで原因を整理します。" },
  { question: "PDCAの順序として正しいのは？", options: ["Plan → Do → Check → Act", "Plan → Check → Do → Act", "Do → Plan → Act → Check", "Check → Plan → Do → Act"], answer: 0, explanation: "Plan → Do → Check → Act が正しい順序です。" },
  { question: "ボルトの緩みを発見する印を何という？", options: ["指示マーク", "合いマーク", "監査マーク", "完成マーク"], answer: 1, explanation: "合いマークがずれていると緩みが発生しています。" },
  { question: "潤滑油の粘度等級を表すのは？", options: ["ISO 9001", "ISO VG", "JIS Q", "ASTM D"], answer: 1, explanation: "ISO VG（Viscosity Grade）。数字が大きいほど粘度が高い。" },
  { question: "電気作業の前にまずやるべきことは？", options: ["材料準備", "電源遮断と検電", "工具点検", "保護具装着"], answer: 1, explanation: "電源を切り検電で確認するのが最初の安全確保です。" },
  { question: "電力Wの計算式は？", options: ["W = V + A", "W = V × A", "W = V / A", "W = A / V"], answer: 1, explanation: "電力 = 電圧 × 電流（W = V × A）。" },
  { question: "モータの絶縁抵抗を測る計器は？", options: ["テスタ", "メガー", "オシロスコープ", "クランプメータ"], answer: 1, explanation: "メガー（絶縁抵抗計）です。" },
  { question: "1日8時間稼働で480個生産する場合のタクトタイムは？", options: ["30秒", "60秒", "90秒", "120秒"], answer: 1, explanation: "28800秒 ÷ 480個 = 60秒/個。" },
  { question: "「自分の設備は自分で守る」を合言葉とする活動は？", options: ["計画保全", "個別改善", "自主保全", "品質保全"], answer: 2, explanation: "自主保全活動の合言葉です。" },
];

const EXAM_G1: QuizQuestion[] = [
  { question: "TPM8本柱に含まれないのは？", options: ["個別改善", "営業効率化", "品質保全", "事務間接効率化"], answer: 1, explanation: "営業効率化は含まれません。" },
  { question: "計画保全の進化として正しい順序は？", options: ["PM → BM → CBM", "BM → PM → CBM", "CBM → PM → BM", "BM → CBM → PM"], answer: 1, explanation: "事後保全（BM）→ 予防保全（PM）→ 状態基準保全（CBM）と進化します。" },
  { question: "リスクの計算式として正しいのは？", options: ["リスク = 重篤度 + 可能性", "リスク = 重篤度 × 可能性", "リスク = 重篤度 ÷ 可能性", "リスク = 重篤度 - 可能性"], answer: 1, explanation: "リスク = 重篤度 × 可能性が定量化の基本式です。" },
  { question: "リスク低減で最優先される対策は？", options: ["個人用保護具", "管理的対策", "工学的対策", "本質安全"], answer: 3, explanation: "危険源そのものを取り除く本質安全が最優先です。" },
  { question: "16大ロスのうち「人の効率を阻害するロス」はいくつ？", options: ["3", "5", "7", "8"], answer: 1, explanation: "管理・動作・編成・自動化置換・測定調整の5つです。" },
  { question: "TEEPはOEEに何を掛けたもの？", options: ["良品率", "設備稼働率（負荷時間/暦時間）", "性能稼働率", "保全コスト率"], answer: 1, explanation: "暦時間ベースの設備稼働率を掛けます。" },
  { question: "ボトルネック工程の特徴は？", options: ["最も早い工程", "最も遅い工程", "最もコストの高い工程", "最も人手の多い工程"], answer: 1, explanation: "ライン全体を律速する最も遅い工程がボトルネックです。" },
  { question: "PM分析のPMが意味するのは？", options: ["Plant Maintenance", "Phenomenon-Mechanism", "Productive Management", "Process Method"], answer: 1, explanation: "Phenomenon（現象）と物理メカニズムから科学的に分析します。" },
  { question: "ワークサンプリングは何を求めるIE手法？", options: ["動素分析", "稼働率の統計値", "標準時間", "歩行距離"], answer: 1, explanation: "ランダムな時刻に観察して稼働率を統計的に算出します。" },
  { question: "MTBFは何を表すか？", options: ["平均修理時間", "平均故障間隔", "稼働率", "故障件数"], answer: 1, explanation: "Mean Time Between Failures = 平均故障間隔です。" },
  { question: "MTBF 100h、MTTR 5h のときの稼働率は？", options: ["80%", "90%", "95.2%", "99%"], answer: 2, explanation: "100 / (100 + 5) ≒ 95.2%。" },
  { question: "バスタブ曲線の3期間に含まれないのは？", options: ["初期故障期", "偶発故障期", "回復期", "摩耗故障期"], answer: 2, explanation: "回復期は含まれません。初期・偶発・摩耗の3期です。" },
  { question: "PLCの正式名称は？", options: ["Process Logic Computer", "Programmable Logic Controller", "Plant Loop Controller", "Power Line Communication"], answer: 1, explanation: "Programmable Logic Controller。" },
  { question: "ラダー図の「──| |──」が表すのは？", options: ["B接点（NC）", "A接点（NO）", "コイル", "タイマ"], answer: 1, explanation: "A接点（Normally Open）です。" },
  { question: "OPL（One Point Lesson）の推奨形式は？", options: ["A3・3枚", "A4・1枚で10分以内", "A4・10枚で1時間", "A5・複数枚"], answer: 1, explanation: "1テーマ・A4 1枚・10分以内が基本です。" },
  { question: "「強制劣化」の主な対策は？", options: ["計画的な部品交換", "基本条件の維持（清掃・点検・給油・増締め）", "新設備への更新", "設計変更"], answer: 1, explanation: "強制劣化は人為的なので、基本条件の維持で防げます。" },
  { question: "自主保全第2ステップの目的は？", options: ["標準化", "発生源・困難箇所対策", "自主点検", "総点検"], answer: 1, explanation: "汚れの発生源対策と清掃困難箇所の改善が目的です。" },
  { question: "設備診断技術で「振動診断」が主な対象とするのは？", options: ["電気回路", "回転機械（モータ・軸受）", "配管の漏れ", "塗装の劣化"], answer: 1, explanation: "回転機械が振動診断の主要対象です。" },
  { question: "サーモグラフィで検出できるのは？", options: ["音の振動数", "温度分布", "電気抵抗", "色彩の変化"], answer: 1, explanation: "赤外線サーモグラフィは温度分布を可視化します。" },
  { question: "潤滑油の白濁の主因として最も適切なのは？", options: ["酸化", "水分混入", "金属粉混入", "高温劣化"], answer: 1, explanation: "水分混入で油が白濁します。" },
];

export const EXAM_SETS: ExamSet[] = [
  { id: "g2-mock-1", title: "2級 模擬試験 第1回", grade: "2", description: "2級の試験範囲から20問を出題。本番形式の4択問題で実力をチェック。", questions: EXAM_G2 },
  { id: "g1-mock-1", title: "1級 模擬試験 第1回", grade: "1", description: "1級の試験範囲から20問を出題。応用知識を問う問題が中心です。", questions: EXAM_G1 },
];

export function getExamSet(id: string): ExamSet | null {
  return EXAM_SETS.find((s) => s.id === id) ?? null;
}
