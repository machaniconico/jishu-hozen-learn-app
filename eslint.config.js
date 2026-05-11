// Minimal flat config — Next.js 16 + Turbopack handles bulk of static analysis via TypeScript.
// This file exists primarily to satisfy ESLint v9's requirement for a config file.
export default [
  {
    ignores: [".next/**", "node_modules/**", "out/**", "next-env.d.ts"],
  },
];
