import Header from "@/components/Header";
import Link from "next/link";
import type { MarketHub } from "@/lib/markets";

export default function MarketHubPage({ hub }: { hub: MarketHub }) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <div className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">
            {hub.eyebrow}
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
            {hub.title}
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed max-w-3xl">
            {hub.intro}
          </p>
        </div>

        <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-12">
          {hub.assets.map((asset) => (
            <Link
              key={asset.symbol}
              href={`/stock/${asset.symbol}`}
              className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5 hover:bg-zinc-800/50 hover:border-zinc-700/60 transition-all"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <div className="text-lg font-semibold text-white">
                    {asset.symbol}
                  </div>
                  <div className="text-sm text-zinc-500">{asset.name}</div>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-300 bg-blue-400/10 rounded-full px-2 py-1">
                  {asset.type}
                </span>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {asset.description}
              </p>
            </Link>
          ))}
        </section>

        <section className="bg-zinc-900/40 border border-zinc-800/40 rounded-3xl p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-white tracking-tight mb-3">
            Why use these {hub.eyebrow.toLowerCase()} charts?
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            Each chart page combines price action, range controls, line and
            candlestick views, quote details, market statistics, news, related
            tickers, and exportable historical data. Use these hubs as a
            starting point for market scans, watchlist research, and fast chart
            comparisons.
          </p>
        </section>
      </main>
    </div>
  );
}
