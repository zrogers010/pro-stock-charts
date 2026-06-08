"use client";

import Link from "next/link";
import SearchBox from "./SearchBox";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <span className="text-base font-semibold text-white tracking-tight">
              ProStockCharts
            </span>
          </Link>
          <div className="flex-1 max-w-lg mx-6">
            <SearchBox />
          </div>
          <nav className="hidden lg:flex items-center gap-4 text-sm text-zinc-500">
            <Link href="/market-movers" className="hover:text-white transition-colors">
              Movers
            </Link>
            <Link href="/compare" className="hover:text-white transition-colors">
              Compare
            </Link>
            <Link href="/premium" className="hover:text-white transition-colors">
              Premium
            </Link>
            <Link href="/stocks" className="hover:text-white transition-colors">
              Stocks
            </Link>
            <Link href="/etfs" className="hover:text-white transition-colors">
              ETFs
            </Link>
            <Link href="/crypto" className="hover:text-white transition-colors">
              Crypto
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
