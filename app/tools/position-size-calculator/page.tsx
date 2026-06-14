import Header from "@/components/Header";
import PositionSizeCalculator from "@/components/tools/PositionSizeCalculator";
import { siteUrl } from "@/lib/markets";
import { canonicalPath } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Position Size Calculator",
  description:
    "Free position size calculator for estimating shares, units, risk budget, and position value from account size, risk percentage, entry price, and stop price.",
  alternates: {
    canonical: canonicalPath("/tools/position-size-calculator"),
  },
  openGraph: {
    title: "Position Size Calculator",
    description:
      "Estimate position size from account size, risk percentage, entry price, and stop price.",
    url: canonicalPath("/tools/position-size-calculator"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Position Size Calculator",
    description:
      "Estimate position size from account size, risk percentage, entry price, and stop price.",
  },
};

export default function PositionSizeCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Position Size Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    url: `${siteUrl}/tools/position-size-calculator`,
    description:
      "A free educational calculator for estimating position size from account size, risk percentage, entry price, and stop price.",
    publisher: {
      "@type": "Organization",
      name: "ProStockCharts",
      url: siteUrl,
    },
  };

  return (
    <div className="min-h-screen">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/tools"
          className="text-sm text-blue-400 transition-colors hover:text-blue-300"
        >
          All tools
        </Link>
        <div className="mb-8 mt-6 max-w-3xl">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Risk Planning
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white">
            Position Size Calculator
          </h1>
          <p className="text-lg leading-relaxed text-zinc-400">
            Estimate how many shares or units fit a defined risk budget before
            opening a trade. Use the result as a planning reference alongside
            liquidity, volatility, chart structure, and your own research.
          </p>
        </div>

        <PositionSizeCalculator />

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Define risk first",
              body:
                "Start with the dollar amount or account percentage you are willing to risk before comparing potential reward.",
            },
            {
              title: "Respect the stop distance",
              body:
                "A wider stop reduces the number of shares or units that fit the same risk budget.",
            },
            {
              title: "Check real-world costs",
              body:
                "Slippage, commissions, taxes, borrow fees, and liquidity can change the actual result.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-zinc-800/50 bg-zinc-900/35 p-5"
            >
              <h2 className="mb-2 text-lg font-semibold tracking-tight text-white">
                {item.title}
              </h2>
              <p className="text-sm leading-relaxed text-zinc-500">
                {item.body}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10 border-t border-zinc-800/60 pt-8">
          <h2 className="mb-3 text-2xl font-semibold tracking-tight text-white">
            Educational use only
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            This calculator is for research and education. It does not tell you
            whether to buy, sell, short, or hold any security, and it does not
            account for your financial situation.
          </p>
        </section>
      </main>
    </div>
  );
}
