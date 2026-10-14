import type { QuoteData } from "./stock-data";
import { formatDateTime } from "./format";

export interface QuoteDisplayState {
  price: number | undefined;
  change: number | undefined;
  changePercent: number | undefined;
  label: string; // "Pre-market" | "After hours" | "Delayed" | "Closed" | "Regular"
  timestamp: string;
}

/**
 * Get the correct price, change, and label based on market state
 * and pre/post market data availability
 */
export function getQuoteDisplayState(quote: QuoteData | null | undefined): QuoteDisplayState {
  if (!quote) {
    return {
      price: undefined,
      change: undefined,
      changePercent: undefined,
      label: "—",
      timestamp: "—",
    };
  }

  const marketState = quote.marketState?.toUpperCase();
  const hasPreMarket = quote.preMarketPrice != null;
  const hasPostMarket = quote.postMarketPrice != null;

  // Pre-market: show pre-market price if available
  if (marketState === "PRE" && hasPreMarket) {
    return {
      price: quote.preMarketPrice,
      change: quote.preMarketChange,
      changePercent: quote.preMarketChangePercent,
      label: "Pre-market",
      timestamp: formatDateTime(quote.preMarketTime),
    };
  }

  // Post-market / After hours: show post-market price if available
  if ((marketState === "POST" || marketState === "POSTPOST") && hasPostMarket) {
    return {
      price: quote.postMarketPrice,
      change: quote.postMarketChange,
      changePercent: quote.postMarketChangePercent,
      label: "After hours",
      timestamp: formatDateTime(quote.postMarketTime),
    };
  }

  // Regular trading hours or closed: show regular price
  const isDelayed = (quote.exchangeDataDelayedBy ?? 0) > 0;
  const isClosed = marketState === "CLOSED" || marketState === "PREPRE";
  
  let label = "Regular";
  if (isClosed) {
    label = "Closed";
  } else if (isDelayed) {
    label = "Delayed";
  }

  return {
    price: quote.regularMarketPrice,
    change: quote.regularMarketChange,
    changePercent: quote.regularMarketChangePercent,
    label,
    timestamp: formatDateTime(quote.regularMarketTime),
  };
}
