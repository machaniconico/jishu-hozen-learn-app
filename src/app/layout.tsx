import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { SwRegister } from "@/components/sw-register";

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
    "自主保全士検定 1級・2級の試験対策。問題バンク460問以上・本番モード模試（タイマー・科目別足切り判定）・計算ドリル・実技（記述）対策・弱点復習・直前まとめを備えた無料学習サイト。",
  keywords: [
    "自主保全士",
    "自主保全士1級",
    "自主保全士2級",
    "自主保全士 過去問",
    "自主保全士 模擬試験",
    "TPM",
    "JIPM",
    "設備保全",
    "プラントメンテナンス",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
  appleWebApp: {
    capable: true,
    title: "自主保全士",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#f59e0b",
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
          <SwRegister />
          <Navigation />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-gray-800 py-6 px-4 text-center text-xs text-gray-500">
            <p>
              自主保全士検定対策アプリ © 2026 ·
              <span className="ml-2 text-gray-600">非公式の独立した学習サイト（受験前に JIPM 公式情報をご確認ください）</span>
            </p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
