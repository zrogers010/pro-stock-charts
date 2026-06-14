import Header from "@/components/Header";
import { indicatorArticles } from "@/lib/indicators";
import { siteUrl } from "@/lib/markets";
import { canonicalPath } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Technical Indicators Explained",
  description:
    "Educational guides to RSI, MACD, Bollinger Bands, and other technical indicators for stock chart research.",
  alternates: {
    canonical: canonicalPath("/indicators"),
  },
  openGraph: {
    title: "Technical Indicators Explained",
    description:
      "Learn how popular technical indicators work, where they help, and where their signals can fail.",
    url: canonicalPath("/indicators"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Technical Indicators Explained",
    description:
      "Educational guides to RSI, MACD, Bollinger Bands, and other technical indicators.",
  },
};

export default function IndicatorsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Technical Indicators Explained",
    description:
      "Educational guides to common technical indicators used in market chart research.",
    url: `${siteUrl}/indicators`,
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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          Back to charts
        </Link>
        <div className="mt-6 mb-10 max-w-3xl">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
            Chart Education
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
            Technical Indicators Explained
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            Learn what common chart indicators measure, how traders typically
            read them, and why no single signal should be treated as investment
            advice.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {indicatorArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/indicators/${article.slug}`}
              className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5 hover:bg-zinc-800/50 hover:border-zinc-700/60 transition-all"
            >
              <div className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">
                {article.readTime}
              </div>
              <h2 className="text-lg font-semibold text-white tracking-tight mb-2">
                {article.shortTitle}
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {article.description}
              </p>
            </Link>
          ))}
        </div>

        <section className="mt-12 border-t border-zinc-800/60 pt-8">
          <h2 className="text-2xl font-semibold text-white tracking-tight mb-3">
            Use indicators as research tools
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            Indicators can make momentum, trend, and volatility easier to scan,
            but they are derived from price and volume data. They should be
            checked against the chart, timeframe, liquidity, market context, and
            your own research process.
          </p>
        </section>
      </main>
    </div>
  );
}
