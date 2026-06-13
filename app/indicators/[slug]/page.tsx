import Header from "@/components/Header";
import {
  getIndicatorArticle,
  indicatorArticles,
} from "@/lib/indicators";
import { coreAssets, siteUrl } from "@/lib/markets";
import { canonicalPath } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return indicatorArticles.map((article) => ({ slug: article.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const article = getIndicatorArticle(params.slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: canonicalPath(`/indicators/${article.slug}`),
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: canonicalPath(`/indicators/${article.slug}`),
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
  };
}

export default function IndicatorArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = getIndicatorArticle(params.slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: `${siteUrl}/indicators/${article.slug}`,
    author: {
      "@type": "Organization",
      name: "ProStockCharts",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "ProStockCharts",
      url: siteUrl,
    },
  };

  const relatedArticles = indicatorArticles.filter(
    (item) => item.slug !== article.slug
  );

  return (
    <div className="min-h-screen">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/indicators"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          All indicators
        </Link>
        <div className="mt-6 mb-10">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
            {article.readTime}
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
            {article.title}
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            {article.description}
          </p>
        </div>

        <section className="mb-10 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5">
          <h2 className="text-lg font-semibold text-white tracking-tight mb-2">
            Common Formula
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            {article.formula}
          </p>
        </section>

        <div className="space-y-8">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-semibold text-white tracking-tight mb-3">
                {section.heading}
              </h2>
              <p className="text-zinc-400 leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-white tracking-tight mb-3">
            Best Used For
          </h2>
          <ul className="space-y-2 text-zinc-400">
            {article.bestFor.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-white tracking-tight mb-3">
            Common Mistakes
          </h2>
          <ul className="space-y-2 text-zinc-400">
            {article.pitfalls.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 border-t border-zinc-800/60 pt-8">
          <h2 className="text-2xl font-semibold text-white tracking-tight mb-3">
            Practice on real charts
          </h2>
          <p className="text-zinc-400 leading-relaxed mb-4">
            Use indicators as a research layer on top of price, volume, source
            timestamps, and market context. ProStockCharts pages are for
            research and education, not investment advice.
          </p>
          <div className="flex flex-wrap gap-2">
            {coreAssets.slice(0, 6).map((asset) => (
              <Link
                key={asset.symbol}
                href={`/stock/${asset.symbol}`}
                className="rounded-lg border border-zinc-800/70 bg-zinc-900/50 px-3 py-2 text-sm font-medium text-zinc-300 hover:border-zinc-700 hover:text-white"
              >
                {asset.symbol} chart
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 border-t border-zinc-800/60 pt-8">
          <h2 className="text-2xl font-semibold text-white tracking-tight mb-3">
            Related indicators
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedArticles.map((item) => (
              <Link
                key={item.slug}
                href={`/indicators/${item.slug}`}
                className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4 hover:border-zinc-700 hover:bg-zinc-800/40"
              >
                <div className="text-sm font-semibold text-white">
                  {item.shortTitle}
                </div>
                <p className="mt-1 text-sm text-zinc-500 line-clamp-2">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
