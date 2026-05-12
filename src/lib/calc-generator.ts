/**
 * 計算問題ジェネレーター (calculation drill generator)
 *
 * Pure-logic module — no React, SSR-safe. Every call produces freshly
 * randomized numbers so the user can practice the exam's quantitative
 * questions infinitely.
 *
 * All correct answers are *computed*, never hard-coded; the three
 * distractors are deliberate plausible mistakes; option order is shuffled.
 */

export type CalcTopicId =
  | "oee" // 設備総合効率
  | "availability" // 時間稼働率
  | "performance" // 性能稼働率
  | "yield" // 良品率／歩留り
  | "takt" // タクトタイム
  | "mtbf-mttr" // MTBF/MTTR と稼働率
  | "ohm" // オームの法則
  | "power" // 電力 P=VI
  | "reliability-series" // 直列システム信頼度
  | "reliability-parallel" // 並列システム信頼度
  | "ratio"; // 不良率・直行率など割合

export interface CalcProblem {
  topic: CalcTopicId;
  topicLabel: string; // 日本語ラベル e.g. "設備総合効率(OEE)"
  question: string; // 完成した問題文（数値埋め込み済み）
  /** 4 multiple-choice options as display strings (one is the correct answer). */
  options: [string, string, string, string];
  answer: number; // 0-3 index of correct option
  /** worked solution, step by step, in Japanese */
  solution: string;
  /** the correct numeric answer as a display string (same text as options[answer]) */
  answerText: string;
}

export const CALC_TOPICS: { id: CalcTopicId; label: string; desc: string }[] = [
  { id: "oee", label: "設備総合効率(OEE)", desc: "時間稼働率×性能稼働率×良品率" },
  { id: "availability", label: "時間稼働率", desc: "稼働時間÷負荷時間" },
  { id: "performance", label: "性能稼働率", desc: "基準サイクルタイム×加工数÷稼働時間" },
  { id: "yield", label: "良品率／歩留り", desc: "良品数÷加工数" },
  { id: "takt", label: "タクトタイム", desc: "稼働時間(秒)÷必要生産数" },
  {
    id: "mtbf-mttr",
    label: "MTBF・MTTR・稼働率",
    desc: "MTBF=総動作時間÷故障回数、稼働率=MTBF÷(MTBF+MTTR)",
  },
  { id: "ohm", label: "オームの法則", desc: "V=IR" },
  { id: "power", label: "電力 P=VI", desc: "P=V×I" },
  { id: "reliability-series", label: "直列システム信頼度", desc: "R=R1×R2×…" },
  { id: "reliability-parallel", label: "並列システム信頼度", desc: "R=1−∏(1−Ri)" },
  { id: "ratio", label: "不良率・直行率", desc: "割合の計算" },
];

const TOPIC_LABEL: Record<CalcTopicId, string> = CALC_TOPICS.reduce(
  (acc, t) => {
    acc[t.id] = t.label;
    return acc;
  },
  {} as Record<CalcTopicId, string>
);

const ALL_TOPIC_IDS: CalcTopicId[] = CALC_TOPICS.map((t) => t.id);

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Round to `d` decimal places, returning a number (avoids 0.1+0.2 noise). */
function round(value: number, d = 0): number {
  const f = 10 ** d;
  return Math.round(value * f) / f;
}

/** Format a number with up to `d` decimals, trimming trailing zeros. */
function fmt(value: number, d = 2): string {
  const r = round(value, d);
  if (Number.isInteger(r)) return String(r);
  return r.toFixed(d).replace(/0+$/, "").replace(/\.$/, "");
}

function pct(fraction: number, d = 1): string {
  return `${fmt(fraction * 100, d)}%`;
}

/** Fisher–Yates shuffle (returns a new array). */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build the option set: take the correct display text plus 3 distractor
 * display texts (deduplicated against the correct one and each other),
 * shuffle, and report where the correct answer landed.
 */
function buildOptions(
  correct: string,
  rawDistractors: string[]
): { options: [string, string, string, string]; answer: number } {
  const seen = new Set<string>([correct]);
  const distractors: string[] = [];
  for (const d of rawDistractors) {
    if (distractors.length === 3) break;
    if (!seen.has(d)) {
      seen.add(d);
      distractors.push(d);
    }
  }
  // Pad if some distractors collided — keep options at exactly 4.
  let pad = 1;
  while (distractors.length < 3) {
    const candidate = `${correct} (${"?".repeat(pad)})`;
    if (!seen.has(candidate)) {
      seen.add(candidate);
      distractors.push(candidate);
    }
    pad += 1;
  }
  const all = shuffle([correct, ...distractors]);
  return {
    options: all as [string, string, string, string],
    answer: all.indexOf(correct),
  };
}

function make(
  topic: CalcTopicId,
  question: string,
  correctText: string,
  distractors: string[],
  solution: string
): CalcProblem {
  const { options, answer } = buildOptions(correctText, distractors);
  return {
    topic,
    topicLabel: TOPIC_LABEL[topic],
    question,
    options,
    answer,
    solution,
    answerText: correctText,
  };
}

// ---------------------------------------------------------------------------
// Per-topic generators
// ---------------------------------------------------------------------------

/** OEE = 時間稼働率 × 性能稼働率 × 良品率 (product). */
function genOee(): CalcProblem {
  // rates in tidy steps
  const avail = randInt(75, 95) / 100; // 時間稼働率
  const perf = randInt(70, 95) / 100; // 性能稼働率
  const quality = randInt(90, 99) / 100; // 良品率

  const oee = avail * perf * quality;
  const correct = pct(oee, 1);

  // distractor 1: 平均にしてしまう（足し算→割る）
  const wrongAvg = pct((avail + perf + quality) / 3, 1);
  // distractor 2: 良品率を掛け忘れる
  const wrongNoQuality = pct(avail * perf, 1);
  // distractor 3: 性能稼働率を掛け忘れる
  const wrongNoPerf = pct(avail * quality, 1);
  // distractor 4 (backup): 四捨五入をずらす
  const wrongRound = pct(round(oee, 0) / 100 + 0.01, 1);

  const question =
    `ある設備で、時間稼働率 ${pct(avail, 0)}、性能稼働率 ${pct(perf, 0)}、` +
    `良品率 ${pct(quality, 0)} であった。設備総合効率(OEE)はおよそいくらか。`;
  const solution =
    `設備総合効率 = 時間稼働率 × 性能稼働率 × 良品率\n` +
    ` = ${fmt(avail, 2)} × ${fmt(perf, 2)} × ${fmt(quality, 2)}\n` +
    ` = ${fmt(oee, 4)} ≒ ${correct}`;

  return make(
    "oee",
    question,
    correct,
    [wrongNoQuality, wrongNoPerf, wrongAvg, wrongRound],
    solution
  );
}

/** 時間稼働率 = 稼働時間 / 負荷時間。 負荷時間 と 停止時間 を与える。 */
function genAvailability(): CalcProblem {
  const load = randInt(40, 48) * 10; // 負荷時間 [分] 400〜480
  // 停止時間 chosen so the rate is reasonable
  const downRatio = randInt(5, 25) / 100;
  const down = round(load * downRatio, 0); // 停止時間 [分]
  const run = load - down; // 稼働時間 [分]

  const rate = run / load;
  const correct = pct(rate, 1);

  // distractor 1: 停止時間 ÷ 負荷時間 を答えてしまう
  const wrongDownRate = pct(down / load, 1);
  // distractor 2: 稼働時間 ÷ 停止時間（意味のない比）
  const wrongVsDown = down > 0 ? pct(run / down, 1) : pct(rate + 0.05, 1);
  // distractor 3: 負荷時間 ÷ 稼働時間（逆数）
  const wrongInverse = pct(load / run, 1);
  // backup
  const wrongOff = pct(rate - 0.03, 1);

  const question =
    `1日の負荷時間が ${load}分、設備の停止時間が ${down}分であった。` +
    `この設備の時間稼働率はおよそいくらか。`;
  const solution =
    `稼働時間 = 負荷時間 − 停止時間 = ${load} − ${down} = ${run}分\n` +
    `時間稼働率 = 稼働時間 ÷ 負荷時間 = ${run} ÷ ${load} = ${fmt(rate, 4)} ≒ ${correct}`;

  return make(
    "availability",
    question,
    correct,
    [wrongDownRate, wrongInverse, wrongVsDown, wrongOff],
    solution
  );
}

/** 性能稼働率 = (基準サイクルタイム × 加工数) / 稼働時間。 */
function genPerformance(): CalcProblem {
  const cycle = pick([1.5, 2, 2.5, 3, 4, 5]); // 基準サイクルタイム [分/個]
  const count = randInt(60, 200); // 加工数 [個]
  const ideal = cycle * count; // 理想正味稼働時間 [分]
  // 実際の稼働時間 is larger (実サイクルが遅い)
  const slack = randInt(5, 30) / 100;
  const run = round(ideal * (1 + slack), 0); // 稼働時間 [分]

  const rate = ideal / run;
  const correct = pct(rate, 1);

  // distractor 1: 稼働時間 ÷ (サイクル×加工数) を答える（逆数）
  const wrongInverse = pct(run / ideal, 1);
  // distractor 2: 加工数 ÷ 稼働時間 (個/分) を％にしてしまう
  const wrongRate2 = pct(count / run, 1);
  // distractor 3: 割る数を少し取り違える
  const wrongMisDiv = pct(ideal / Math.max(1, run - randInt(10, 40)), 1);
  // backup
  const wrongOff = pct(rate - 0.04, 1);

  const question =
    `基準サイクルタイム ${fmt(cycle, 1)}分/個 の製品を ${count}個 加工した。` +
    `この間の稼働時間は ${run}分であった。性能稼働率はおよそいくらか。`;
  const solution =
    `性能稼働率 = (基準サイクルタイム × 加工数) ÷ 稼働時間\n` +
    ` = (${fmt(cycle, 1)} × ${count}) ÷ ${run}\n` +
    ` = ${fmt(ideal, 1)} ÷ ${run} = ${fmt(rate, 4)} ≒ ${correct}`;

  return make(
    "performance",
    question,
    correct,
    [wrongInverse, wrongMisDiv, wrongRate2, wrongOff],
    solution
  );
}

/** 良品率 = 良品数 / 加工数。 */
function genYield(): CalcProblem {
  const total = randInt(40, 200) * 5; // 加工数
  const defectRatio = randInt(1, 12) / 100;
  const defect = Math.max(1, round(total * defectRatio, 0)); // 不良数
  const good = total - defect; // 良品数

  const rate = good / total;
  const correct = pct(rate, 1);

  // distractor 1: 不良率を答えてしまう
  const wrongDefectRate = pct(defect / total, 1);
  // distractor 2: 良品数 ÷ 不良数 (意味のない比)
  const wrongVsDefect = pct(good / defect, 1);
  // distractor 3: 加工数 ÷ 良品数（逆数）
  const wrongInverse = pct(total / good, 1);
  // backup
  const wrongOff = pct(rate - 0.02, 1);

  const question =
    `ある工程で ${total}個 を加工したところ、不良品が ${defect}個 発生した。` +
    `良品率はおよそいくらか。`;
  const solution =
    `良品数 = 加工数 − 不良数 = ${total} − ${defect} = ${good}個\n` +
    `良品率 = 良品数 ÷ 加工数 = ${good} ÷ ${total} = ${fmt(rate, 4)} ≒ ${correct}`;

  return make(
    "yield",
    question,
    correct,
    [wrongDefectRate, wrongVsDefect, wrongInverse, wrongOff],
    solution
  );
}

/** タクトタイム = 稼働時間(秒) / 必要生産数。 */
function genTakt(): CalcProblem {
  // pick hours that give nice second totals
  const hours = pick([7, 7.5, 8]);
  const seconds = Math.round(hours * 3600); // 稼働時間 [秒]
  // choose 必要生産数 so タクト is a tidy integer if possible
  const candidates = [seconds / 60, seconds / 90, seconds / 120, seconds / 45, seconds / 30].filter(
    (v) => Number.isInteger(v) && v > 0
  );
  let need: number;
  if (candidates.length > 0) {
    need = pick(candidates);
  } else {
    need = randInt(200, 800);
  }
  const takt = seconds / need; // [秒/個]
  const correct = `${fmt(takt, 1)}秒`;

  // distractor 1: 必要生産数 ÷ 稼働時間 を答える（逆数）
  const wrongInverse = `${fmt(need / seconds, 4)}秒`;
  // distractor 2: 時間を分のまま割ってしまう（÷60 忘れ）
  const wrongMinutes = `${fmt(Math.round(hours * 60) / need, 2)}秒`;
  // distractor 3: ÷60 を余計にしてしまう
  const wrongExtraDiv = `${fmt(takt / 60, 2)}秒`;
  // backup
  const wrongOff = `${fmt(takt + pick([5, 10, -5, 2]), 1)}秒`;

  const question =
    `1日 ${fmt(hours, 1)}時間 稼働し、その間に ${need}個 を生産する必要がある。` +
    `タクトタイムはいくらか。`;
  const solution =
    `稼働時間 = ${fmt(hours, 1)}時間 × 3600 = ${seconds}秒\n` +
    `タクトタイム = 稼働時間(秒) ÷ 必要生産数 = ${seconds} ÷ ${need} = ${fmt(takt, 2)}秒/個`;

  return make(
    "takt",
    question,
    correct,
    [wrongInverse, wrongExtraDiv, wrongMinutes, wrongOff],
    solution
  );
}

/** MTBF と MTTR。 二系統の出題: MTBF を求める / 稼働率(A) を求める。 */
function genMtbfMttr(): CalcProblem {
  if (Math.random() < 0.5) {
    // --- MTBF を求める ---
    const failures = randInt(2, 8); // 故障回数
    const mtbfTarget = randInt(20, 200); // 各回の平均（おおよそ）
    const totalUp = mtbfTarget * failures + randInt(-failures, failures); // 総動作時間 [h]
    const mtbf = totalUp / failures;
    const correct = `${fmt(mtbf, 1)}時間`;

    // distractor 1: 故障回数 ÷ 総動作時間（逆数）
    const wrongInverse = `${fmt(failures / totalUp, 4)}時間`;
    // distractor 2: 総動作時間 ÷ (故障回数+1) で割ってしまう
    const wrongPlusOne = `${fmt(totalUp / (failures + 1), 1)}時間`;
    // distractor 3: 総動作時間そのまま
    const wrongRaw = `${fmt(totalUp, 0)}時間`;
    // backup
    const wrongOff = `${fmt(mtbf + pick([5, 10, -5, 8]), 1)}時間`;

    const question =
      `ある設備が合計 ${totalUp}時間 稼働する間に ${failures}回 故障した。` +
      `この設備の平均故障間隔(MTBF)はおよそいくらか。`;
    const solution = `MTBF = 総動作時間 ÷ 故障回数 = ${totalUp} ÷ ${failures} = ${fmt(mtbf, 2)}時間`;

    return make(
      "mtbf-mttr",
      question,
      correct,
      [wrongInverse, wrongPlusOne, wrongRaw, wrongOff],
      solution
    );
  }

  // --- 稼働率 A を求める ---
  const mtbf = randInt(8, 40) * 10; // MTBF [h] 80〜400
  const mttr = pick([0.5, 1, 2, 3, 4, 5, 6, 8]); // MTTR [h]
  const a = mtbf / (mtbf + mttr);
  const correct = pct(a, 2);

  // distractor 1: MTTR ÷ (MTBF+MTTR)（故障率側）
  const wrongDownRate = pct(mttr / (mtbf + mttr), 2);
  // distractor 2: MTBF ÷ MTTR を％にしてしまう
  const wrongRatio = pct(mtbf / mttr, 2);
  // distractor 3: MTBF ÷ (MTBF − MTTR)（符号ミス）
  const wrongMinus = pct(mtbf / (mtbf - mttr), 2);
  // backup
  const wrongOff = pct(a - 0.01, 2);

  const question =
    `ある設備の MTBF が ${mtbf}時間、MTTR が ${fmt(mttr, 1)}時間 である。` +
    `この設備の稼働率(アベイラビリティ)はおよそいくらか。`;
  const solution =
    `稼働率 A = MTBF ÷ (MTBF + MTTR) = ${mtbf} ÷ (${mtbf} + ${fmt(mttr, 1)})\n` +
    ` = ${mtbf} ÷ ${fmt(mtbf + mttr, 1)} = ${fmt(a, 4)} ≒ ${correct}`;

  return make(
    "mtbf-mttr",
    question,
    correct,
    [wrongDownRate, wrongRatio, wrongMinus, wrongOff],
    solution
  );
}

/** オームの法則 V = I × R。 {V,I,R} のうち2つを与え、残り1つを問う。 */
function genOhm(): CalcProblem {
  const r = pick([5, 10, 20, 25, 50, 100]); // [Ω]
  const i = pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5]); // [A]
  const v = round(i * r, 2); // [V]
  const askWhat = pick(["V", "I", "R"] as const);

  if (askWhat === "V") {
    const correct = `${fmt(v, 1)}V`;
    const wrongDivide = `${fmt(r / i, 2)}V`; // R÷I にしてしまう
    const wrongAdd = `${fmt(i + r, 1)}V`; // 足してしまう
    const wrongIdivR = `${fmt(i / r, 4)}V`; // I÷R
    const wrongOff = `${fmt(v + pick([5, 10, -5, 2]), 1)}V`;
    const question = `抵抗 ${fmt(r, 0)}Ω に ${fmt(i, 1)}A の電流が流れているとき、両端の電圧は何 V か。`;
    const solution = `オームの法則: V = I × R = ${fmt(i, 1)} × ${fmt(r, 0)} = ${fmt(v, 2)}V`;
    return make("ohm", question, correct, [wrongDivide, wrongAdd, wrongIdivR, wrongOff], solution);
  }
  if (askWhat === "I") {
    const correct = `${fmt(i, 2)}A`;
    const wrongMul = `${fmt(v * r, 1)}A`; // V×R
    const wrongInverse = `${fmt(r / v, 4)}A`; // R÷V
    const wrongSub = `${fmt(Math.abs(v - r), 2)}A`; // V−R
    const wrongOff = `${fmt(i + pick([0.5, 1, -0.5]), 2)}A`;
    const question = `${fmt(v, 1)}V の電圧を ${fmt(r, 0)}Ω の抵抗に加えたとき、流れる電流は何 A か。`;
    const solution = `オームの法則: I = V ÷ R = ${fmt(v, 1)} ÷ ${fmt(r, 0)} = ${fmt(i, 2)}A`;
    return make("ohm", question, correct, [wrongMul, wrongInverse, wrongSub, wrongOff], solution);
  }
  // askWhat === "R"
  const correct = `${fmt(r, 1)}Ω`;
  const wrongMul = `${fmt(v * i, 1)}Ω`; // V×I
  const wrongInverse = `${fmt(i / v, 4)}Ω`; // I÷V
  const wrongSub = `${fmt(Math.abs(v - i), 2)}Ω`; // V−I
  const wrongOff = `${fmt(r + pick([5, 10, -5, 2]), 1)}Ω`;
  const question = `${fmt(v, 1)}V の電圧を加えると ${fmt(i, 1)}A の電流が流れた。この抵抗は何 Ω か。`;
  const solution = `オームの法則: R = V ÷ I = ${fmt(v, 1)} ÷ ${fmt(i, 1)} = ${fmt(r, 2)}Ω`;
  return make("ohm", question, correct, [wrongMul, wrongInverse, wrongSub, wrongOff], solution);
}

/** 電力 P = V × I。 {P,V,I} のうち2つを与え、残り1つを問う。 */
function genPower(): CalcProblem {
  const v = pick([24, 100, 200]); // [V]
  const i = pick([0.5, 1, 1.5, 2, 3, 5, 10]); // [A]
  const p = round(v * i, 1); // [W]
  const askWhat = pick(["P", "V", "I"] as const);

  if (askWhat === "P") {
    const correct = `${fmt(p, 1)}W`;
    const wrongDivide = `${fmt(v / i, 2)}W`; // V÷I
    const wrongAdd = `${fmt(v + i, 1)}W`; // 足してしまう
    const wrongIoverV = `${fmt(i / v, 4)}W`; // I÷V
    const wrongOff = `${fmt(p + pick([10, 50, -10, 100]), 1)}W`;
    const question = `${fmt(v, 0)}V の電源に ${fmt(i, 1)}A の電流が流れる負荷をつないだ。消費電力は何 W か。`;
    const solution = `電力: P = V × I = ${fmt(v, 0)} × ${fmt(i, 1)} = ${fmt(p, 1)}W`;
    return make("power", question, correct, [wrongDivide, wrongAdd, wrongIoverV, wrongOff], solution);
  }
  if (askWhat === "I") {
    const correct = `${fmt(i, 2)}A`;
    const wrongMul = `${fmt(p * v, 0)}A`; // P×V
    const wrongInverse = `${fmt(v / p, 4)}A`; // V÷P
    const wrongSub = `${fmt(Math.abs(p - v), 1)}A`; // P−V
    const wrongOff = `${fmt(i + pick([0.5, 1, -0.5]), 2)}A`;
    const question = `${fmt(v, 0)}V の電源で消費電力が ${fmt(p, 0)}W のとき、流れる電流は何 A か。`;
    const solution = `電力の式 P = V × I より I = P ÷ V = ${fmt(p, 0)} ÷ ${fmt(v, 0)} = ${fmt(i, 2)}A`;
    return make("power", question, correct, [wrongMul, wrongInverse, wrongSub, wrongOff], solution);
  }
  // askWhat === "V"
  const correct = `${fmt(v, 1)}V`;
  const wrongMul = `${fmt(p * i, 0)}V`; // P×I
  const wrongInverse = `${fmt(i / p, 4)}V`; // I÷P
  const wrongSub = `${fmt(Math.abs(p - i), 1)}V`; // P−I
  const wrongOff = `${fmt(v + pick([10, 24, -10]), 1)}V`;
  const question = `消費電力 ${fmt(p, 0)}W、電流 ${fmt(i, 1)}A の機器がある。電源電圧は何 V か。`;
  const solution = `電力の式 P = V × I より V = P ÷ I = ${fmt(p, 0)} ÷ ${fmt(i, 1)} = ${fmt(v, 2)}V`;
  return make("power", question, correct, [wrongMul, wrongInverse, wrongSub, wrongOff], solution);
}

/** 直列システムの信頼度 = R1 × R2 × … (2〜3要素)。 */
function genReliabilitySeries(): CalcProblem {
  const n = randInt(2, 3);
  const rs: number[] = [];
  for (let k = 0; k < n; k++) rs.push(randInt(80, 99) / 100);
  const product = rs.reduce((a, b) => a * b, 1);
  const correct = pct(product, 2);

  // distractor 1: 平均をとってしまう
  const wrongAvg = pct(rs.reduce((a, b) => a + b, 0) / n, 2);
  // distractor 2: 並列の式で計算してしまう 1−∏(1−Ri)
  const wrongParallel = pct(1 - rs.reduce((a, b) => a * (1 - b), 1), 2);
  // distractor 3: 一番低い要素の値をそのまま答える
  const wrongMin = pct(Math.min(...rs), 2);
  // backup
  const wrongOff = pct(product - 0.02, 2);

  const list = rs.map((r) => fmt(r, 2)).join("、");
  const question =
    `信頼度がそれぞれ ${list} の要素が ${n}個 直列に接続されている。` +
    `このシステム全体の信頼度はおよそいくらか。`;
  const solution =
    `直列システムの信頼度 = ${rs.map((r) => fmt(r, 2)).join(" × ")}\n` +
    ` = ${fmt(product, 4)} ≒ ${correct}`;

  return make(
    "reliability-series",
    question,
    correct,
    [wrongAvg, wrongParallel, wrongMin, wrongOff],
    solution
  );
}

/** 並列(冗長)システムの信頼度 = 1 − ∏(1 − Ri) (2〜3要素)。 */
function genReliabilityParallel(): CalcProblem {
  const n = randInt(2, 3);
  const rs: number[] = [];
  for (let k = 0; k < n; k++) rs.push(randInt(70, 95) / 100);
  const reliability = 1 - rs.reduce((a, b) => a * (1 - b), 1);
  const correct = pct(reliability, 2);

  // distractor 1: 直列の式で計算してしまう ∏Ri
  const wrongSeries = pct(rs.reduce((a, b) => a * b, 1), 2);
  // distractor 2: ∏(1−Ri) で止めてしまう（1− を忘れる）
  const wrongNoOneMinus = pct(rs.reduce((a, b) => a * (1 - b), 1), 2);
  // distractor 3: 信頼度を単純に足してしまう
  const wrongSum = pct(Math.min(0.999, rs.reduce((a, b) => a + b, 0)), 2);
  // backup
  const wrongOff = pct(reliability - 0.01, 2);

  const list = rs.map((r) => fmt(r, 2)).join("、");
  const question =
    `信頼度がそれぞれ ${list} の要素が ${n}個 並列(冗長)に接続されている。` +
    `このシステム全体の信頼度はおよそいくらか。`;
  const solution =
    `並列システムの信頼度 = 1 − ${rs.map((r) => `(1 − ${fmt(r, 2)})`).join(" × ")}\n` +
    ` = 1 − ${rs.map((r) => fmt(1 - r, 2)).join(" × ")}\n` +
    ` = 1 − ${fmt(rs.reduce((a, b) => a * (1 - b), 1), 4)} = ${fmt(reliability, 4)} ≒ ${correct}`;

  return make(
    "reliability-parallel",
    question,
    correct,
    [wrongSeries, wrongNoOneMinus, wrongSum, wrongOff],
    solution
  );
}

/** 割合 — 不良率 または 直行率(一発良品率)。 */
function genRatio(): CalcProblem {
  if (Math.random() < 0.5) {
    // --- 不良率 = 不良数 / 生産数 ---
    const produced = randInt(50, 400) * 5;
    const defectRatio = randInt(1, 15) / 100;
    const defect = Math.max(1, round(produced * defectRatio, 0));
    const rate = defect / produced;
    const correct = pct(rate, 2);

    const wrongGoodRate = pct((produced - defect) / produced, 2); // 良品率
    const wrongVsGood = pct(defect / (produced - defect), 2); // 不良数÷良品数
    const wrongInverse = pct(produced / defect, 2); // 逆数
    const wrongOff = pct(rate + 0.01, 2);

    const question =
      `ある製品を ${produced}個 生産したところ、${defect}個 が不良であった。不良率はおよそいくらか。`;
    const solution = `不良率 = 不良数 ÷ 生産数 = ${defect} ÷ ${produced} = ${fmt(rate, 4)} ≒ ${correct}`;
    return make("ratio", question, correct, [wrongGoodRate, wrongVsGood, wrongInverse, wrongOff], solution);
  }

  // --- 直行率 = (手直しなしの良品数) / 投入数 ---
  const input = randInt(40, 300) * 5; // 投入数
  const reworkRatio = randInt(3, 20) / 100;
  const rework = Math.max(1, round(input * reworkRatio, 0)); // 手直し・不良数
  const straight = input - rework; // 一発良品数
  const rate = straight / input;
  const correct = pct(rate, 2);

  const wrongReworkRate = pct(rework / input, 2); // 手直し率を答える
  const wrongVsRework = pct(straight / rework, 2); // 良品数÷手直し数
  const wrongInverse = pct(input / straight, 2); // 逆数
  const wrongOff = pct(rate - 0.01, 2);

  const question =
    `工程に ${input}個 を投入し、そのうち ${rework}個 が手直しまたは不良となった。` +
    `直行率(一発で良品になった割合)はおよそいくらか。`;
  const solution =
    `一発良品数 = 投入数 − 手直し・不良数 = ${input} − ${rework} = ${straight}個\n` +
    `直行率 = 一発良品数 ÷ 投入数 = ${straight} ÷ ${input} = ${fmt(rate, 4)} ≒ ${correct}`;
  return make("ratio", question, correct, [wrongReworkRate, wrongVsRework, wrongInverse, wrongOff], solution);
}

// ---------------------------------------------------------------------------
// Dispatch
// ---------------------------------------------------------------------------

const GENERATORS: Record<CalcTopicId, () => CalcProblem> = {
  oee: genOee,
  availability: genAvailability,
  performance: genPerformance,
  yield: genYield,
  takt: genTakt,
  "mtbf-mttr": genMtbfMttr,
  ohm: genOhm,
  power: genPower,
  "reliability-series": genReliabilitySeries,
  "reliability-parallel": genReliabilityParallel,
  ratio: genRatio,
};

/** Generate one random problem for a given topic. */
export function generateProblem(topic: CalcTopicId): CalcProblem {
  const gen = GENERATORS[topic] ?? genOee;
  return gen();
}

/**
 * Generate `n` random problems across the given topics (or all topics if
 * omitted). Randomizes both topic and numbers.
 */
export function generateDrill(n: number, topics?: CalcTopicId[]): CalcProblem[] {
  const valid = (topics && topics.length > 0 ? topics : ALL_TOPIC_IDS).filter((t) =>
    ALL_TOPIC_IDS.includes(t)
  );
  const pool = valid.length > 0 ? valid : ALL_TOPIC_IDS;
  const count = Math.max(1, Math.floor(n));
  const out: CalcProblem[] = [];
  for (let k = 0; k < count; k++) {
    out.push(generateProblem(pick(pool)));
  }
  return out;
}
