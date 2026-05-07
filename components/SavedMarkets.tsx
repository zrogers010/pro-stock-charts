"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function SavedMarkets() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);

  useEffect(() => {
    setWatchlist(
      JSON.parse(window.localStorage.getItem("psc_watchlist") || "[]")
    );
    setRecents(
      JSON.parse(window.localStorage.getItem("psc_recent_symbols") || "[]")
    );
  }, []);

  if (watchlist.length === 0 && recents.length === 0) return null;

  return (
    <section className="max-w-4xl mx-auto px-4 pb-24">
      <div className="grid md:grid-cols-2 gap-6">
        <SavedList title="Your Watchlist" symbols={watchlist} />
        <SavedList title="Recently Viewed" symbols={recents} />
      </div>
    </section>
  );
}

function SavedList({ title, symbols }: { title: string; symbols: string[] }) {
  if (symbols.length === 0) {
    return (
      <div className="bg-zinc-900/40 border border-zinc-800/40 rounded-2xl p-5">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
          {title}
        </h2>
        <p className="text-sm text-zinc-600">No saved symbols yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/40 rounded-2xl p-5">
      <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
        {title}
      </h2>
      <div className="flex flex-wrap gap-2">
        {symbols.map((symbol) => (
          <Link
            key={symbol}
            href={`/stock/${symbol}`}
            className="bg-zinc-800/60 text-sm font-semibold text-white rounded-lg px-3 py-2 hover:bg-zinc-700 transition-colors"
          >
            {symbol}
          </Link>
        ))}
      </div>
    </div>
  );
}
