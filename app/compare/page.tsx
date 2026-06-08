import Header from "@/components/Header";
import { comparisons } from "@/lib/comparisons";
import { canonicalPath } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stock and ETF Comparisons",
  description:
    "Compare curated stocks and ETFs with quote snapshots, chart links, and research context.",
  alternates: {
    canonical: canonicalPath("/compare"),
  },
  openGraph: {
    title: "Stock and ETF Comparisons",
    description:
      "Compare curated stocks and ETFs with quote snapshots, chart links, and research context.",
    url: canonicalPath("/compare"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stock and ETF Comparisons",
    description:
      "Compare curated stocks and ETFs with quote snapshots, chart links, and research context.",
  },
};

export default function ComparePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-400">
            Compare
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white">
            Stock and ETF Comparisons
          </h1>
          <p className="text-lg leading-relaxed text-zinc-400">
            Compare curated ETFs and stocks with quote snapshots, chart links,
            and plain-language research context. Start with a small set of
            high-signal comparisons instead of thin generated pages.
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-2">
          {comparisons.map((comparison) => (
            <Link
              key={comparison.slug}
              href={`/compare/${comparison.slug}`}
              className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-5 transition-all hover:border-zinc-700/60 hover:bg-zinc-800/50"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-white">
                  {comparison.title}
                </h2>
                <span className="rounded-full bg-blue-400/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-300">
                  {comparison.category}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-zinc-500">
                {comparison.description}
              </p>
            </Link>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-zinc-800/50 bg-zinc-900/35 p-5">
          <h2 className="mb-2 text-sm font-semibold text-white">
            Comparison guardrails
          </h2>
          <p className="text-sm leading-relaxed text-zinc-500">
            These pages are for market research and education. They are not
            rankings, recommendations, or personalized advice. Verify important
            quote and fund information with your broker, exchange, fund issuer,
            or primary data provider.
          </p>
        </section>
      </main>
    </div>
  );
}
