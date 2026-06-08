"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SavedLayout = {
  symbol: string;
  range: string;
  type: "area" | "candle";
  savedAt?: string;
};

export default function SavedMarkets() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);
  const [layouts, setLayouts] = useState<SavedLayout[]>([]);

  useEffect(() => {
    setWatchlist(
      JSON.parse(window.localStorage.getItem("psc_watchlist") || "[]")
    );
    setRecents(
      JSON.parse(window.localStorage.getItem("psc_recent_symbols") || "[]")
    );
    setLayouts(readSavedLayouts());
  }, []);

  if (watchlist.length === 0 && recents.length === 0 && layouts.length === 0) {
    return null;
  }

  return (
    <section className="max-w-4xl mx-auto px-4 pb-24">
      <div className="grid md:grid-cols-3 gap-6">
        <SavedList title="Your Watchlist" symbols={watchlist} />
        <SavedList title="Recently Viewed" symbols={recents} />
        <SavedLayoutList layouts={layouts} />
      </div>
    </section>
  );
}

function readSavedLayouts(): SavedLayout[] {
  const layouts: SavedLayout[] = [];

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key?.startsWith("psc_chart_layout_")) continue;

    try {
      const symbol = key.replace("psc_chart_layout_", "");
      const parsed = JSON.parse(window.localStorage.getItem(key) || "{}") as Omit<
        SavedLayout,
        "symbol"
      >;
      if (!parsed.range || (parsed.type !== "area" && parsed.type !== "candle")) {
        continue;
      }
      layouts.push({ symbol, ...parsed });
    } catch {
      continue;
    }
  }

  return layouts
    .sort((a, b) => (b.savedAt || "").localeCompare(a.savedAt || ""))
    .slice(0, 6);
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

function SavedLayoutList({ layouts }: { layouts: SavedLayout[] }) {
  if (layouts.length === 0) {
    return (
      <div className="bg-zinc-900/40 border border-zinc-800/40 rounded-2xl p-5">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
          Saved Layouts
        </h2>
        <p className="text-sm text-zinc-600">No saved chart layouts yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/40 rounded-2xl p-5">
      <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
        Saved Layouts
      </h2>
      <div className="space-y-2">
        {layouts.map((layout) => (
          <Link
            key={`${layout.symbol}-${layout.range}-${layout.type}`}
            href={`/stock/${layout.symbol}?range=${layout.range}&type=${layout.type}`}
            className="block rounded-lg bg-zinc-800/50 px-3 py-2 transition-colors hover:bg-zinc-700/70"
          >
            <div className="text-sm font-semibold text-white">
              {layout.symbol}
            </div>
            <div className="text-xs text-zinc-500">
              {layout.range.toUpperCase()} /{" "}
              {layout.type === "candle" ? "Candle" : "Line"}
            </div>
          </Link>
        ))}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-zinc-600">
        Layouts are saved locally in this browser. Account sync is coming later.
      </p>
    </div>
  );
}
