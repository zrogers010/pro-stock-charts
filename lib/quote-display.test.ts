import { describe, it, expect } from "vitest";
import { getQuoteDisplayState } from "@/lib/quote-display";
import type { QuoteData } from "@/lib/stock-data";

describe("Quote Display State", () => {
  const baseQuote: QuoteData = {
    symbol: "AAPL",
    shortName: "Apple Inc.",
    regularMarketPrice: 150.0,
    regularMarketChange: 2.5,
    regularMarketChangePercent: 1.69,
    regularMarketTime: new Date("2026-10-14T16:00:00Z"),
    exchangeDataDelayedBy: 0,
  };

  it("should show regular price during trading hours", () => {
    const quote: QuoteData = {
      ...baseQuote,
      marketState: "REGULAR",
    };

    const state = getQuoteDisplayState(quote);

    expect(state.price).toBe(150.0);
    expect(state.change).toBe(2.5);
    expect(state.changePercent).toBe(1.69);
    expect(state.label).toBe("Regular");
  });

  it("should show 'Delayed' label when exchange data is delayed", () => {
    const quote: QuoteData = {
      ...baseQuote,
      marketState: "REGULAR",
      exchangeDataDelayedBy: 15,
    };

    const state = getQuoteDisplayState(quote);

    expect(state.price).toBe(150.0);
    expect(state.label).toBe("Delayed");
  });

  it("should show 'Closed' label when market is closed", () => {
    const quote: QuoteData = {
      ...baseQuote,
      marketState: "CLOSED",
    };

    const state = getQuoteDisplayState(quote);

    expect(state.price).toBe(150.0);
    expect(state.change).toBe(2.5);
    expect(state.label).toBe("Closed");
  });

  it("should show pre-market price and label when market is in PRE state", () => {
    const quote: QuoteData = {
      ...baseQuote,
      marketState: "PRE",
      preMarketPrice: 151.5,
      preMarketChange: 1.5,
      preMarketChangePercent: 1.0,
      preMarketTime: new Date("2026-10-14T12:30:00Z"),
    };

    const state = getQuoteDisplayState(quote);

    expect(state.price).toBe(151.5);
    expect(state.change).toBe(1.5);
    expect(state.changePercent).toBe(1.0);
    expect(state.label).toBe("Pre-market");
  });

  it("should show regular price if PRE state but no preMarketPrice", () => {
    const quote: QuoteData = {
      ...baseQuote,
      marketState: "PRE",
      // no preMarketPrice field
    };

    const state = getQuoteDisplayState(quote);

    expect(state.price).toBe(150.0);
    expect(state.change).toBe(2.5);
    // Should fall back to regular market data
  });

  it("should show post-market price and 'After hours' label when market is in POST state", () => {
    const quote: QuoteData = {
      ...baseQuote,
      marketState: "POST",
      postMarketPrice: 149.0,
      postMarketChange: -1.0,
      postMarketChangePercent: -0.67,
      postMarketTime: new Date("2026-10-14T20:00:00Z"),
    };

    const state = getQuoteDisplayState(quote);

    expect(state.price).toBe(149.0);
    expect(state.change).toBe(-1.0);
    expect(state.changePercent).toBe(-0.67);
    expect(state.label).toBe("After hours");
  });

  it("should show regular price if POST state but no postMarketPrice", () => {
    const quote: QuoteData = {
      ...baseQuote,
      marketState: "POST",
      // no postMarketPrice field
    };

    const state = getQuoteDisplayState(quote);

    expect(state.price).toBe(150.0);
    expect(state.change).toBe(2.5);
    // Should fall back to regular market data
  });

  it("should handle POSTPOST market state as after hours", () => {
    const quote: QuoteData = {
      ...baseQuote,
      marketState: "POSTPOST",
      postMarketPrice: 148.5,
      postMarketChange: -1.5,
      postMarketChangePercent: -1.0,
      postMarketTime: new Date("2026-10-14T21:00:00Z"),
    };

    const state = getQuoteDisplayState(quote);

    expect(state.price).toBe(148.5);
    expect(state.label).toBe("After hours");
  });

  it("should handle PREPRE market state as closed", () => {
    const quote: QuoteData = {
      ...baseQuote,
      marketState: "PREPRE",
    };

    const state = getQuoteDisplayState(quote);

    expect(state.label).toBe("Closed");
  });

  it("should handle null quote gracefully", () => {
    const state = getQuoteDisplayState(null);

    expect(state.price).toBeUndefined();
    expect(state.change).toBeUndefined();
    expect(state.changePercent).toBeUndefined();
    expect(state.label).toBe("—");
    expect(state.timestamp).toBe("—");
  });

  it("should handle undefined quote gracefully", () => {
    const state = getQuoteDisplayState(undefined);

    expect(state.price).toBeUndefined();
    expect(state.label).toBe("—");
  });

  it("should handle quote without marketState field", () => {
    const quote: QuoteData = {
      ...baseQuote,
      // no marketState field
    };

    const state = getQuoteDisplayState(quote);

    expect(state.price).toBe(150.0);
    expect(state.change).toBe(2.5);
    // Should default to regular market data
  });

  it("should show delayed ETF quote correctly", () => {
    const quote: QuoteData = {
      symbol: "SPY",
      shortName: "SPDR S&P 500 ETF",
      regularMarketPrice: 425.0,
      regularMarketChange: -0.5,
      regularMarketChangePercent: -0.12,
      regularMarketTime: new Date("2026-10-14T15:45:00Z"),
      marketState: "REGULAR",
      exchangeDataDelayedBy: 15,
    };

    const state = getQuoteDisplayState(quote);

    expect(state.price).toBe(425.0);
    expect(state.change).toBe(-0.5);
    expect(state.label).toBe("Delayed");
  });

  it("should format timestamps correctly", () => {
    const quote: QuoteData = {
      ...baseQuote,
      regularMarketTime: new Date("2026-10-14T16:00:00Z"),
    };

    const state = getQuoteDisplayState(quote);

    expect(state.timestamp).toBeTruthy();
    expect(state.timestamp).not.toBe("—");
    // The exact format depends on formatDateTime, but it should be a string
    expect(typeof state.timestamp).toBe("string");
  });
});
