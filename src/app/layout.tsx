import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "自主保全士 学習アプリ | 1級・2級対応",
  description:
    "自主保全士検定 1級・2級の試験対策。5科目（生産の基本・ロス構造・自主保全活動・改善解析・設備保全）をテキスト・クイズ・フラッシュカード・模擬試験で学べる無料学習サイト。",
  keywords: [
    "自主保全士",
    "自主保全士1級",
    "自主保全士2級",
    "TPM",
    "JIPM",
    "設備保全",
    "プラントメンテナンス",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-gray-950 text-gray-100 dark:bg-gray-950 dark:text-gray-100 light:bg-white light:text-gray-900 transition-colors">
        <ThemeProvider>
          <Navigation />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-gray-800 py-6 px-4 text-center text-xs text-gray-500">
            <p>
              自主保全士検定対策アプリ © 2026 ·
              <span className="ml-2 text-gray-600">非公式の独立した学習サイトです</span>
            </p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
