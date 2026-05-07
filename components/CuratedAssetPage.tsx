import Header from "@/components/Header";
import Link from "next/link";
import type { MarketAsset, MarketHub } from "@/lib/markets";

export default function CuratedAssetPage({
  asset,
  hub,
}: {
  asset: MarketAsset;
  hub: MarketHub;
}) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href={`/${hub.slug}`}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Back to {hub.title}
          </Link>
          <h1 className="text-4xl font-bold text-white tracking-tight mt-4 mb-4">
            {asset.name} ({asset.symbol}) Chart
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            View the free professional {asset.name} chart with price history,
            candlestick and line chart views, volume context, key market data,
            latest news, and exportable historical data.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mb-8">
          <InfoCard label="Symbol" value={asset.symbol} />
          <InfoCard label="Type" value={asset.type} />
          <InfoCard label="Category" value={asset.category} />
        </div>

        <section className="bg-zinc-900/40 border border-zinc-800/40 rounded-3xl p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white tracking-tight mb-3">
            About this chart
          </h2>
          <p className="text-zinc-400 leading-relaxed mb-4">
            {asset.description} Traders and investors often use this chart to
            review trend direction, volatility, price range, and recent market
            reaction before comparing it with related assets.
          </p>
          <p className="text-zinc-400 leading-relaxed">
            ProStockCharts keeps the experience focused: search a ticker,
            change chart ranges, switch to candlesticks, and export historical
            data without creating an account.
          </p>
        </section>

        <Link
          href={`/stock/${asset.symbol}?range=1y&type=candle`}
          className="inline-flex items-center justify-center bg-blue-500 text-white font-semibold rounded-xl px-5 py-3 hover:bg-blue-400 transition-colors"
        >
          Open {asset.symbol} Interactive Chart
        </Link>
      </main>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4">
      <div className="text-[11px] text-zinc-500 uppercase tracking-widest mb-1">
        {label}
      </div>
      <div className="text-sm font-semibold text-white">{value}</div>
    </div>
  );
}
