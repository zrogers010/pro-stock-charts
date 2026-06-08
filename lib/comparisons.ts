import { fetchStockSnapshot, type QuoteData } from "@/lib/stock-data";

export type Comparison = {
  slug: string;
  title: string;
  description: string;
  symbols: [string, string];
  category: "ETF" | "Stock" | "Crypto";
  notes: string[];
};

export type ComparisonSnapshot = {
  symbol: string;
  quote: QuoteData | null;
};

export const comparisons: Comparison[] = [
  {
    slug: "spy-vs-qqq",
    title: "SPY vs QQQ",
    description:
      "Compare the SPDR S&P 500 ETF with the Invesco QQQ Trust for broad-market versus Nasdaq 100 exposure.",
    symbols: ["SPY", "QQQ"],
    category: "ETF",
    notes: [
      "SPY tracks the S&P 500 and is commonly used as a broad US large-cap benchmark.",
      "QQQ tracks the Nasdaq 100 and typically has heavier large-cap technology exposure.",
      "Compare price trend, volume, and recent percentage change before choosing a market proxy.",
    ],
  },
  {
    slug: "spy-vs-vti",
    title: "SPY vs VTI",
    description:
      "Compare S&P 500 exposure with a total US stock market ETF using live chart links and quote snapshots.",
    symbols: ["SPY", "VTI"],
    category: "ETF",
    notes: [
      "SPY focuses on large US companies in the S&P 500.",
      "VTI is designed for broader total US stock market exposure.",
      "The two ETFs can move similarly, but holdings breadth and index construction differ.",
    ],
  },
  {
    slug: "qqq-vs-iwm",
    title: "QQQ vs IWM",
    description:
      "Compare Nasdaq 100 ETF exposure with Russell 2000 small-cap ETF exposure.",
    symbols: ["QQQ", "IWM"],
    category: "ETF",
    notes: [
      "QQQ is often used for large-cap growth and technology-heavy exposure.",
      "IWM is commonly used to follow US small-cap stock performance.",
      "This pair can help frame growth leadership versus small-cap participation.",
    ],
  },
  {
    slug: "aapl-vs-msft",
    title: "AAPL vs MSFT",
    description:
      "Compare Apple and Microsoft quote snapshots, volume, market cap, and chart links.",
    symbols: ["AAPL", "MSFT"],
    category: "Stock",
    notes: [
      "Apple and Microsoft are two of the most-followed US mega-cap technology stocks.",
      "Review chart trend, market cap, volume, and company-specific news before comparing performance.",
      "This comparison is for research and education, not a recommendation.",
    ],
  },
];

export function getComparison(slug: string) {
  return comparisons.find((comparison) => comparison.slug === slug);
}

export async function fetchComparisonSnapshots(
  comparison: Comparison
): Promise<[ComparisonSnapshot, ComparisonSnapshot]> {
  const snapshots = await Promise.all(
    comparison.symbols.map(async (symbol) => ({
      symbol,
      quote: (await fetchStockSnapshot(symbol))?.quote ?? null,
    }))
  );

  return snapshots as [ComparisonSnapshot, ComparisonSnapshot];
}
