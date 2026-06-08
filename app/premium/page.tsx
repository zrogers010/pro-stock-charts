import Header from "@/components/Header";
import PremiumInterest from "@/components/PremiumInterest";
import { canonicalPath } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Premium Research Workflows",
  description:
    "Explore potential ProStockCharts premium workflows such as synced watchlists, saved layouts, alerts, and multi-chart dashboards.",
  alternates: {
    canonical: canonicalPath("/premium"),
  },
  openGraph: {
    title: "Premium Research Workflows",
    description:
      "Explore potential ProStockCharts premium workflows such as synced watchlists, saved layouts, alerts, and multi-chart dashboards.",
    url: canonicalPath("/premium"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Research Workflows",
    description:
      "Explore potential ProStockCharts premium workflows such as synced watchlists, saved layouts, alerts, and multi-chart dashboards.",
  },
};

const principles = [
  "Keep core charts free and useful.",
  "Add premium only around repeat research workflows.",
  "Avoid personalized advice, predictions, or broker-like behavior.",
  "Build demand signals before adding accounts or payments.",
];

export default function PremiumPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Premium Research Workflows",
    url: canonicalPath("/premium"),
    description:
      "Potential premium workflows for ProStockCharts, including saved layouts, cloud watchlists, alerts, and dashboards.",
  };

  return (
    <div className="min-h-screen">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-400">
            Premium
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white">
            Premium Research Workflows
          </h1>
          <p className="text-lg leading-relaxed text-zinc-400">
            ProStockCharts is staying free for core charting. Premium should
            only add durable workflow value: synced layouts, better watchlists,
            alerts, and multi-chart research dashboards.
          </p>
        </div>

        <section className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-zinc-800/50 bg-zinc-900/40 p-6">
            <h2 className="mb-3 text-xl font-semibold tracking-tight text-white">
              Free now
            </h2>
            <p className="text-sm leading-relaxed text-zinc-500">
              Public charts, quote snapshots, market movers, comparison pages,
              watchlists, recently viewed symbols, and local saved chart
              layouts should remain useful without an account.
            </p>
          </div>
          <div className="rounded-3xl border border-zinc-800/50 bg-zinc-900/40 p-6">
            <h2 className="mb-3 text-xl font-semibold tracking-tight text-white">
              Premium later
            </h2>
            <p className="text-sm leading-relaxed text-zinc-500">
              Paid features should focus on workflow sync and repeat research,
              not trading recommendations. Pricing is intentionally undecided
              until there is enough demand signal.
            </p>
          </div>
        </section>

        <PremiumInterest />

        <section className="mt-8 rounded-3xl border border-zinc-800/50 bg-zinc-900/35 p-6">
          <h2 className="mb-4 text-xl font-semibold tracking-tight text-white">
            Product principles
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {principles.map((principle) => (
              <div
                key={principle}
                className="rounded-2xl border border-zinc-800/50 bg-zinc-950/30 p-4 text-sm text-zinc-400"
              >
                {principle}
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8">
          <Link
            href="/stock/AAPL"
            className="inline-flex items-center justify-center rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-400"
          >
            Try a chart first
          </Link>
        </div>
      </main>
    </div>
  );
}
