import { Metadata } from "next";
import { redirect } from "next/navigation";
import StockView from "./StockView";
import { formatCurrency, formatLargeNumber } from "@/lib/format";
import { siteUrl } from "@/lib/markets";
import { fetchStockSnapshot, getDisplayName } from "@/lib/stock-data";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { symbol: string };
}): Promise<Metadata> {
  const symbol = params.symbol.toUpperCase();
  const snapshot = await fetchStockSnapshot(symbol);
  const quote = snapshot?.quote;
  const displayName = getDisplayName(quote);
  const exchange = quote?.fullExchangeName || quote?.exchange;
  const price = quote?.regularMarketPrice
    ? ` at ${formatCurrency(quote.regularMarketPrice)}`
    : "";
  const exchangeCopy = exchange ? ` on ${exchange}` : "";

  return {
    title: `${displayName} (${symbol}) Stock Chart`,
    description: `View the ${displayName} (${symbol}) stock chart${price}${exchangeCopy}. Free candlestick charts, price history, key statistics, market data, and news.`,
    alternates: {
      canonical: `/stock/${encodeURIComponent(symbol)}`,
    },
    openGraph: {
      title: `${displayName} (${symbol}) Stock Chart`,
      description: `Free interactive ${symbol} chart with price, volume, key statistics, market data, and news.`,
      url: `/stock/${encodeURIComponent(symbol)}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayName} (${symbol}) Stock Chart`,
      description: `Free interactive ${symbol} chart with price, volume, key statistics, market data, and news.`,
    },
  };
}

export default function StockPage({
  params,
}: {
  params: { symbol: string };
}) {
  const symbol = params.symbol.toUpperCase();
  if (params.symbol !== symbol) redirect(`/stock/${encodeURIComponent(symbol)}`);

  return <StockPageContent symbol={symbol} />;
}

async function StockPageContent({ symbol }: { symbol: string }) {
  const snapshot = await fetchStockSnapshot(symbol);
  const quote = snapshot?.quote ?? null;
  const summary = snapshot?.summary ?? null;
  const displayName = getDisplayName(quote);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${displayName} (${symbol}) Stock Chart`,
    url: `${siteUrl}/stock/${encodeURIComponent(symbol)}`,
    description: `Free professional chart, quote data, key statistics, and news for ${displayName}.`,
    about: {
      "@type": "Thing",
      name: displayName,
      identifier: symbol,
    },
    mainEntity: {
      "@type": "Dataset",
      name: `${symbol} price history and market data`,
      description: `Price, volume, market capitalization, and chart data for ${displayName}.`,
      keywords: [
        `${symbol} stock chart`,
        `${displayName} stock price`,
        `${symbol} candlestick chart`,
        `${symbol} market data`,
      ],
      creator: {
        "@type": "Organization",
        name: "ProStockCharts",
        url: siteUrl,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StockView
        symbol={symbol}
        initialQuote={quote}
        initialSummary={summary}
      />
    </>
  );
}
