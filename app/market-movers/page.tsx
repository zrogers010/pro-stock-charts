import Header from "@/components/Header";
import {
  fetchMarketMovers,
  type MarketMover,
  type MarketMoverList,
} from "@/lib/market-movers";
import { formatCurrency, formatLargeNumber } from "@/lib/format";
import { canonicalPath } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Stock Market Movers",
  description:
    "Track today's top stock gainers, top losers, and most active US stocks with free charts and market data.",
  alternates: {
    canonical: canonicalPath("/market-movers"),
  },
  openGraph: {
    title: "Stock Market Movers",
    description:
      "Track today's top stock gainers, top losers, and most active US stocks with free charts and market data.",
    url: canonicalPath("/market-movers"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stock Market Movers",
    description:
      "Track today's top stock gainers, top losers, and most active US stocks with free charts and market data.",
  },
};

function formatSignedNumber(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "—";
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(2)}`;
}

function formatSignedPercent(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "—";
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(2)}%`;
}

function MarketMoverRow({ mover }: { mover: MarketMover }) {
  const isPositive = (mover.changePercent || 0) >= 0;
  const changeClass = isPositive ? "text-emerald-400" : "text-red-400";

  return (
    <Link
      href={`/stock/${encodeURIComponent(mover.symbol)}`}
      className="grid grid-cols-[minmax(0,1.4fr)_0.8fr_0.8fr] gap-3 border-t border-zinc-800/50 px-4 py-3 text-sm transition-colors hover:bg-zinc-800/35 sm:grid-cols-[minmax(0,1.5fr)_0.8fr_0.8fr_0.9fr]"
    >
      <div className="min-w-0">
        <div className="font-semibold text-white">{mover.symbol}</div>
        <div className="truncate text-xs text-zinc-500">{mover.name}</div>
      </div>
      <div className="text-right text-zinc-300">
        {formatCurrency(mover.price)}
      </div>
      <div className={`text-right font-medium ${changeClass}`}>
        <div>{formatSignedPercent(mover.changePercent)}</div>
        <div className="text-xs">{formatSignedNumber(mover.change)}</div>
      </div>
      <div className="hidden text-right text-zinc-400 sm:block">
        {formatLargeNumber(mover.volume)}
      </div>
    </Link>
  );
}

function MarketMoverTable({ list }: { list: MarketMoverList }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/45">
      <div className="border-b border-zinc-800/60 p-5">
        <h2 className="text-lg font-semibold text-white">{list.title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-zinc-500">
          {list.description}
        </p>
      </div>
      <div className="grid grid-cols-[minmax(0,1.4fr)_0.8fr_0.8fr] gap-3 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-zinc-600 sm:grid-cols-[minmax(0,1.5fr)_0.8fr_0.8fr_0.9fr]">
        <div>Symbol</div>
        <div className="text-right">Price</div>
        <div className="text-right">Change</div>
        <div className="hidden text-right sm:block">Volume</div>
      </div>
      {list.movers.length > 0 ? (
        <div>
          {list.movers.map((mover) => (
            <MarketMoverRow key={mover.symbol} mover={mover} />
          ))}
        </div>
      ) : (
        <div className="border-t border-zinc-800/50 px-4 py-6 text-sm text-zinc-500">
          Market mover data is temporarily unavailable. Try again shortly or
          search for a specific ticker.
        </div>
      )}
    </section>
  );
}

export default async function MarketMoversPage() {
  const moverLists = await fetchMarketMovers();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Stock Market Movers",
    url: canonicalPath("/market-movers"),
    description:
      "Today's top stock gainers, top losers, and most active US stocks.",
  };

  return (
    <div className="min-h-screen">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-400">
            Market Movers
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white">
            Stock Market Movers
          </h1>
          <p className="text-lg leading-relaxed text-zinc-400">
            Track today&apos;s top gainers, top losers, and most active US
            stocks, then open any ticker for a full chart, quote details, and
            market context.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-500">
            Market mover data is sourced from third-party market data and may
            be delayed, incomplete, or unavailable. This page is for research
            and education only, not investment advice.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          {moverLists.map((list) => (
            <MarketMoverTable key={list.id} list={list} />
          ))}
        </div>

        <section className="mt-10 rounded-2xl border border-zinc-800/50 bg-zinc-900/35 p-5">
          <h2 className="mb-2 text-sm font-semibold text-white">
            How to use market movers
          </h2>
          <p className="text-sm leading-relaxed text-zinc-500">
            Movers can highlight unusual price or volume activity, but large
            intraday moves often need context. Check the chart trend, volume,
            quote timestamp, news, and company details before drawing
            conclusions.
          </p>
        </section>
      </main>
    </div>
  );
}
