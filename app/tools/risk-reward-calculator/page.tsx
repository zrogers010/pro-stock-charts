import Header from "@/components/Header";
import RiskRewardCalculator from "@/components/tools/RiskRewardCalculator";
import { siteUrl } from "@/lib/markets";
import { canonicalPath } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Risk Reward Calculator",
  description:
    "Free risk reward calculator for estimating risk/reward ratio, potential loss, potential profit, and break-even win rate from entry, stop, target, and position size.",
  alternates: {
    canonical: canonicalPath("/tools/risk-reward-calculator"),
  },
  openGraph: {
    title: "Risk Reward Calculator",
    description:
      "Estimate risk/reward ratio, potential loss, potential profit, and break-even win rate from entry, stop, target, and position size.",
    url: canonicalPath("/tools/risk-reward-calculator"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Risk Reward Calculator",
    description:
      "Estimate risk/reward ratio, potential loss, potential profit, and break-even win rate.",
  },
};

export default function RiskRewardCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Risk Reward Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    url: `${siteUrl}/tools/risk-reward-calculator`,
    description:
      "A free educational calculator for estimating risk/reward ratio, potential loss, potential profit, and break-even win rate.",
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
            Trade Planning
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white">
            Risk Reward Calculator
          </h1>
          <p className="text-lg leading-relaxed text-zinc-400">
            Estimate the relationship between planned risk and potential reward
            before opening a trade. Use the output as a planning reference, not
            a recommendation.
          </p>
        </div>

        <RiskRewardCalculator />

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Compare scenarios",
              body:
                "Small changes in stop distance or target price can materially change the ratio and break-even win rate.",
            },
            {
              title: "Pair with sizing",
              body:
                "A strong ratio does not control risk by itself. Pair it with position sizing and a defined risk budget.",
            },
            {
              title: "Account for execution",
              body:
                "Real fills can differ from planned prices because of spreads, slippage, liquidity, and market gaps.",
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
            whether a trade is attractive, whether to buy or sell, or how much
            risk is appropriate for your financial situation.
          </p>
        </section>
      </main>
    </div>
  );
}
