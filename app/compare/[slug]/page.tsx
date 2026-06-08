import Header from "@/components/Header";
import {
  comparisons,
  fetchComparisonSnapshots,
  getComparison,
  type ComparisonSnapshot,
} from "@/lib/comparisons";
import { formatCurrency, formatDateTime, formatLargeNumber } from "@/lib/format";
import { canonicalPath } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 300;

export function generateStaticParams() {
  return comparisons.map((comparison) => ({ slug: comparison.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const comparison = getComparison(params.slug);
  if (!comparison) return {};

  return {
    title: `${comparison.title} Comparison`,
    description: comparison.description,
    alternates: {
      canonical: canonicalPath(`/compare/${comparison.slug}`),
    },
    openGraph: {
      title: `${comparison.title} Comparison`,
      description: comparison.description,
      url: canonicalPath(`/compare/${comparison.slug}`),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${comparison.title} Comparison`,
      description: comparison.description,
    },
  };
}

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

function getDisplayName(snapshot: ComparisonSnapshot) {
  const quote = snapshot.quote;
  return quote?.longName || quote?.shortName || quote?.symbol || snapshot.symbol;
}

function MetricRow({
  label,
  left,
  right,
}: {
  label: string;
  left: string;
  right: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_0.8fr_0.8fr] gap-3 border-t border-zinc-800/50 px-4 py-3 text-sm">
      <div className="text-zinc-500">{label}</div>
      <div className="text-right font-medium text-zinc-200">{left}</div>
      <div className="text-right font-medium text-zinc-200">{right}</div>
    </div>
  );
}

function QuoteCard({ snapshot }: { snapshot: ComparisonSnapshot }) {
  const quote = snapshot.quote;
  const changePercent = quote?.regularMarketChangePercent;
  const isPositive = (changePercent || 0) >= 0;
  const changeClass = isPositive ? "text-emerald-400" : "text-red-400";

  return (
    <section className="rounded-2xl border border-zinc-800/60 bg-zinc-900/45 p-5">
      <div className="mb-4">
        <div className="text-2xl font-bold text-white">{snapshot.symbol}</div>
        <div className="mt-1 truncate text-sm text-zinc-500">
          {getDisplayName(snapshot)}
        </div>
      </div>
      <div className="mb-5">
        <div className="text-3xl font-bold tracking-tight text-white">
          {formatCurrency(quote?.regularMarketPrice)}
        </div>
        <div className={`mt-1 text-sm font-semibold ${changeClass}`}>
          {formatSignedNumber(quote?.regularMarketChange)} (
          {formatSignedPercent(changePercent)})
        </div>
      </div>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">Volume</dt>
          <dd className="font-medium text-zinc-300">
            {formatLargeNumber(quote?.regularMarketVolume)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">Market cap</dt>
          <dd className="font-medium text-zinc-300">
            {formatLargeNumber(quote?.marketCap)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">Exchange</dt>
          <dd className="font-medium text-zinc-300">
            {quote?.fullExchangeName || quote?.exchange || "—"}
          </dd>
        </div>
      </dl>
      <Link
        href={`/stock/${encodeURIComponent(snapshot.symbol)}?range=1y&type=candle`}
        className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-400"
      >
        Open {snapshot.symbol} Chart
      </Link>
    </section>
  );
}

export default async function ComparisonPage({
  params,
}: {
  params: { slug: string };
}) {
  const comparison = getComparison(params.slug);
  if (!comparison) notFound();

  const [left, right] = await fetchComparisonSnapshots(comparison);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${comparison.title} Comparison`,
    url: canonicalPath(`/compare/${comparison.slug}`),
    description: comparison.description,
  };

  return (
    <div className="min-h-screen">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/compare"
            className="text-sm text-blue-400 transition-colors hover:text-blue-300"
          >
            Back to comparisons
          </Link>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            {comparison.title} Comparison
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-zinc-400">
            {comparison.description}
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-500">
            Quote data may be delayed, incomplete, or unavailable. This
            comparison is for research and education only, not investment
            advice.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <QuoteCard snapshot={left} />
          <QuoteCard snapshot={right} />
        </div>

        <section className="mt-8 overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/45">
          <div className="grid grid-cols-[1fr_0.8fr_0.8fr] gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-widest text-zinc-600">
            <div>Metric</div>
            <div className="text-right">{left.symbol}</div>
            <div className="text-right">{right.symbol}</div>
          </div>
          <MetricRow
            label="Price"
            left={formatCurrency(left.quote?.regularMarketPrice)}
            right={formatCurrency(right.quote?.regularMarketPrice)}
          />
          <MetricRow
            label="Day change"
            left={formatSignedPercent(left.quote?.regularMarketChangePercent)}
            right={formatSignedPercent(right.quote?.regularMarketChangePercent)}
          />
          <MetricRow
            label="Volume"
            left={formatLargeNumber(left.quote?.regularMarketVolume)}
            right={formatLargeNumber(right.quote?.regularMarketVolume)}
          />
          <MetricRow
            label="Market cap"
            left={formatLargeNumber(left.quote?.marketCap)}
            right={formatLargeNumber(right.quote?.marketCap)}
          />
          <MetricRow
            label="Last quote"
            left={formatDateTime(left.quote?.regularMarketTime)}
            right={formatDateTime(right.quote?.regularMarketTime)}
          />
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-800/50 bg-zinc-900/35 p-5">
          <h2 className="mb-3 text-sm font-semibold text-white">
            Research notes
          </h2>
          <ul className="space-y-2 text-sm leading-relaxed text-zinc-500">
            {comparison.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
