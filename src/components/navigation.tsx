"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const TOP_ITEMS = [
  { href: "/", label: "ホーム" },
  { href: "/dashboard", label: "進捗" },
];

const STUDY_ITEMS = [
  { href: "/quiz", label: "クイズ" },
  { href: "/flashcards", label: "フラッシュカード" },
  { href: "/past-exam", label: "模擬試験" },
  { href: "/glossary", label: "用語集" },
];

const NAV_GROUPS = [
  {
    label: "2級",
    color: "green",
    items: [
      { href: "/learn/2/seisan-kihon", label: "生産の基本" },
      { href: "/learn/2/loss-efficiency", label: "ロスと効率化" },
      { href: "/learn/2/jishu-hozen", label: "自主保全活動" },
      { href: "/learn/2/kaizen-kaiseki", label: "改善・解析" },
      { href: "/learn/2/setsubi-hozen", label: "設備保全の基礎" },
    ],
  },
  {
    label: "1級",
    color: "red",
    items: [
      { href: "/learn/1/seisan-kihon", label: "生産の基本" },
      { href: "/learn/1/loss-efficiency", label: "ロスと効率化" },
      { href: "/learn/1/jishu-hozen", label: "自主保全活動" },
      { href: "/learn/1/kaizen-kaiseki", label: "改善・解析" },
      { href: "/learn/1/setsubi-hozen", label: "設備保全の基礎" },
    ],
  },
];

type NavGroup = typeof NAV_GROUPS[number];

function DropdownGroup({
  group,
  isActive,
}: {
  group: NavGroup;
  isActive: (href: string) => boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasActiveItem = group.items.some((item) => isActive(item.href));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeColorMap: Record<string, string> = {
    green: "bg-green-500/20 text-green-400",
    red: "bg-red-500/20 text-red-400",
    amber: "bg-amber-500/20 text-amber-400",
  };
  const activeCls = activeColorMap[group.color] ?? activeColorMap.amber;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${
          hasActiveItem
            ? activeCls
            : "text-gray-400 hover:text-gray-100 hover:bg-gray-800"
        }`}
      >
        {group.label}
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 min-w-[180px] z-50">
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 text-xs transition-colors ${
                isActive(item.href)
                  ? activeCls
                  : "text-gray-300 hover:text-gray-100 hover:bg-gray-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
            <span className="text-2xl">🔧</span>
            <span className="text-amber-400">自主保全士</span>
            <span className="text-gray-500 text-sm font-medium">Learn</span>
          </Link>

          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-colors"
              aria-label="メニューを開く"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <nav className="hidden md:flex flex-wrap items-center gap-0.5 pb-2">
          {TOP_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-2.5 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                isActive(item.href)
                  ? "bg-amber-500/20 text-amber-400"
                  : "text-gray-400 hover:text-gray-100 hover:bg-gray-800"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <span className="mx-1 text-gray-700">|</span>
          {NAV_GROUPS.map((group) => (
            <DropdownGroup key={group.label} group={group} isActive={isActive} />
          ))}
          <span className="mx-1 text-gray-700">|</span>
          {STUDY_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-2.5 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                isActive(item.href)
                  ? "bg-amber-500/20 text-amber-400"
                  : "text-gray-400 hover:text-gray-100 hover:bg-gray-800"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900 max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-1">
            {TOP_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-amber-500/20 text-amber-400"
                    : "text-gray-300 hover:text-gray-100 hover:bg-gray-800"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-800 px-4 py-4 space-y-4">
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-3 py-1.5 rounded text-sm transition-colors ${
                        isActive(item.href)
                          ? "bg-amber-500/20 text-amber-400"
                          : "text-gray-400 hover:text-gray-100 hover:bg-gray-800"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                学習モード
              </p>
              <div className="space-y-0.5">
                {STUDY_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-1.5 rounded text-sm transition-colors ${
                      isActive(item.href)
                        ? "bg-amber-500/20 text-amber-400"
                        : "text-gray-400 hover:text-gray-100 hover:bg-gray-800"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
