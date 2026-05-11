type Difficulty = "beginner" | "intermediate" | "advanced";

const styles: Record<Difficulty, { label: string; cls: string }> = {
  beginner: { label: "2級レベル", cls: "bg-green-500/15 border-green-500/40 text-green-400" },
  intermediate: { label: "中級", cls: "bg-blue-500/15 border-blue-500/40 text-blue-400" },
  advanced: { label: "1級レベル", cls: "bg-red-500/15 border-red-500/40 text-red-400" },
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const s = styles[difficulty];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-xs font-semibold ${s.cls}`}>
      {s.label}
    </span>
  );
}

const gradeStyles: Record<string, string> = {
  "2級": "bg-green-500/15 border-green-500/40 text-green-400",
  "1級": "bg-red-500/15 border-red-500/40 text-red-400",
  "共通": "bg-amber-500/15 border-amber-500/40 text-amber-400",
};

export function GradeBadge({ grade }: { grade: "2級" | "1級" | "共通" }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-xs font-semibold ${gradeStyles[grade]}`}>
      {grade}
    </span>
  );
}
