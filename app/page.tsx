import Header from "@/components/Header";
import SavedMarkets from "@/components/SavedMarkets";
import SearchBox from "@/components/SearchBox";
import { educationArticles } from "@/lib/education";
import { marketHubs, siteUrl } from "@/lib/markets";
import Link from "next/link";

const popularStocks = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corp." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "NVDA", name: "NVIDIA Corp." },
  { symbol: "META", name: "Meta Platforms" },
  { symbol: "JPM", name: "JPMorgan Chase" },
];

const popularCrypto = [
  { symbol: "BTC-USD", name: "Bitcoin" },
  { symbol: "ETH-USD", name: "Ethereum" },
  { symbol: "SOL-USD", name: "Solana" },
  { symbol: "XRP-USD", name: "XRP" },
];

const popularCommodities = [
  { symbol: "GC=F", name: "Gold" },
  { symbol: "SI=F", name: "Silver" },
  { symbol: "CL=F", name: "Crude Oil" },
  { symbol: "NG=F", name: "Natural Gas" },
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ProStockCharts",
    url: siteUrl,
    description:
      "Free professional stock charts, market data, news, and exportable historical price data.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/stock/{search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="min-h-screen">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        {/* Hero */}
        <div className="flex flex-col items-center justify-center px-4 pt-28 pb-20">
          <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
            <svg
              width="28"
              height="28"
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
          <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-3 tracking-tight">
            Free Professional Stock Charts
          </h1>
          <p className="text-zinc-400 text-lg text-center mb-10 max-w-2xl">
            Fast interactive stock charts, candlestick views, market data, news,
            and CSV exports for stocks, ETFs, crypto, commodities, futures, and
            indices. No signup required.
          </p>
          <div className="w-full max-w-xl">
            <SearchBox autoFocus large />
          </div>
        </div>

        {/* Popular Assets */}
        <div className="max-w-4xl mx-auto px-4 pb-24 space-y-8">
          <div>
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
              Popular Stocks
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {popularStocks.map((stock) => (
                <Link
                  key={stock.symbol}
                  href={`/stock/${stock.symbol}`}
                  className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl px-4 py-3.5 hover:bg-zinc-800/60 hover:border-zinc-700/60 transition-all group"
                >
                  <div className="font-semibold text-white group-hover:text-blue-400 transition-colors text-sm">
                    {stock.symbol}
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5 truncate">
                    {stock.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
              Crypto
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {popularCrypto.map((item) => (
                <Link
                  key={item.symbol}
                  href={`/stock/${item.symbol}`}
                  className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl px-4 py-3.5 hover:bg-zinc-800/60 hover:border-zinc-700/60 transition-all group"
                >
                  <div className="font-semibold text-white group-hover:text-amber-400 transition-colors text-sm">
                    {item.symbol}
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5 truncate">
                    {item.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
              Commodities & Futures
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {popularCommodities.map((item) => (
                <Link
                  key={item.symbol}
                  href={`/stock/${item.symbol}`}
                  className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl px-4 py-3.5 hover:bg-zinc-800/60 hover:border-zinc-700/60 transition-all group"
                >
                  <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors text-sm">
                    {item.symbol}
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5 truncate">
                    {item.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <SavedMarkets />

        <section className="max-w-4xl mx-auto px-4 pb-24">
          <div className="bg-zinc-900/40 border border-zinc-800/40 rounded-3xl p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-white tracking-tight mb-3">
              Professional charting without the clutter
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-6">
              ProStockCharts is built for quick market research: type a ticker,
              open a clean chart, switch between line and candlestick views, and
              export historical price data when you need it. Use it to scan
              popular stocks, broad market ETFs, crypto pairs, commodity
              futures, and major indices from one fast interface.
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                "No account or paywall",
                "Line and candlestick charts",
                "CSV and JSON data exports",
              ].map((item) => (
                <div
                  key={item}
                  className="bg-zinc-800/30 rounded-xl px-4 py-3 text-sm text-zinc-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 pb-24">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
            Explore Markets
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketHubs.map((hub) => (
              <Link
                key={hub.slug}
                href={`/${hub.slug}`}
                className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5 hover:bg-zinc-800/50 hover:border-zinc-700/60 transition-all"
              >
                <div className="text-sm font-semibold text-white mb-2">
                  {hub.title}
                </div>
                <p className="text-sm text-zinc-500 line-clamp-4">
                  {hub.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 pb-24">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
            Learn Stock Charts
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {educationArticles.slice(0, 4).map((article) => (
              <Link
                key={article.slug}
                href={`/learn/${article.slug}`}
                className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5 hover:bg-zinc-800/50 hover:border-zinc-700/60 transition-all"
              >
                <div className="text-sm font-semibold text-white mb-2">
                  {article.title}
                </div>
                <p className="text-sm text-zinc-500 line-clamp-2">
                  {article.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
