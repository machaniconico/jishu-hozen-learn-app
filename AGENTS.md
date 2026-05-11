# Agent notes for jishu-hozen-learn-app

## Stack
- Next.js 16 (App Router, `output: "export"` 静的ビルド)
- React 19, TypeScript, Tailwind CSS 4
- 進捗は localStorage に保存（キー `jishu-hozen-progress`）

## Conventions
- 全コンテンツは `src/lib/lessons-data.ts` 等のデータファイルで管理（個別JSXは書かない）
- ダークモード基本、`html.light` で明るいモードに切り替え
- 級別: `'2級' | '1級' | '共通'` の3値で各レッスンを分類

## Color theme
- Primary: amber-500 (#f59e0b)
- Accent: orange-600 (#ea580c)
- 工場・整備のイメージ。安全色のオレンジを基調にする

## Content sources
- 公式テキストPDFは未所持。コンテンツはJIPM 公式試験範囲の一般知識から構成。
- 試験範囲: 5科目 (生産の基本/生産効率化とロス/自主保全活動/改善解析/設備保全の基礎) × 2級/1級
