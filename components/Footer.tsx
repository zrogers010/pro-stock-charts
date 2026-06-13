import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-sm font-semibold text-white">
              ProStockCharts
            </div>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-zinc-500">
              Market data and charts are provided for research and educational
              use only. This site does not provide investment advice. Quotes
              may be delayed depending on the data source and exchange; verify
              prices with your broker or data provider before trading.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-500">
            <Link href="/data-disclaimer" className="hover:text-zinc-300">
              Data Disclaimer
            </Link>
            <Link href="/privacy" className="hover:text-zinc-300">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-zinc-300">
              Terms
            </Link>
            <Link href="/market-movers" className="hover:text-zinc-300">
              Market Movers
            </Link>
            <Link href="/compare" className="hover:text-zinc-300">
              Compare
            </Link>
            <Link href="/indicators" className="hover:text-zinc-300">
              Indicators
            </Link>
            <Link href="/premium" className="hover:text-zinc-300">
              Premium
            </Link>
            <Link href="/stocks" className="hover:text-zinc-300">
              Stocks
            </Link>
            <Link href="/etfs" className="hover:text-zinc-300">
              ETFs
            </Link>
            <Link href="/learn/how-to-read-candlestick-charts" className="hover:text-zinc-300">
              Learn
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
