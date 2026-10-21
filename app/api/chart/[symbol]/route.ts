import { NextRequest, NextResponse } from "next/server";
import yahooFinance from "@/lib/yahoo";
import { marketDataCacheHeaders, noStoreHeaders } from "@/lib/api-cache";
import { isValidMarketSymbol, normalizeSymbol } from "@/lib/symbols";
import { INTERVALS, type ChartInterval } from "@/lib/chart-utils";

const DAY_MS = 24 * 60 * 60 * 1000;
const DATE_RE = /^\d{4}-\d{2}-\d{2}(T[\d:.]+Z)?$/;
const INTRADAY_INTERVALS = new Set<string>(["1m", "5m", "15m", "1h"]);
// Yahoo only serves intraday bars from a recent window, regardless of span.
const INTRADAY_LOOKBACK_DAYS: Record<string, number> = { "1m": 30, "5m": 60, "15m": 60, "1h": 730 };
const MAX_CUSTOM_SPAN_DAYS = 365 * 60;

function parseDateParam(value: string | null): Date | null | "invalid" {
  if (!value) return null;
  if (value.length > 32 || !DATE_RE.test(value)) return "invalid";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "invalid" : d;
}

interface RangeConfig {
  periodLabel: string;
  interval: string;
  intraday: boolean;
}

const rangeMap: Record<string, RangeConfig> = {
  "1d": { periodLabel: "1d", interval: "5m", intraday: true },
  "5d": { periodLabel: "5d", interval: "30m", intraday: true },
  "1mo": { periodLabel: "1mo", interval: "1d", intraday: false },
  "3mo": { periodLabel: "3mo", interval: "1d", intraday: false },
  "6mo": { periodLabel: "6mo", interval: "1d", intraday: false },
  "ytd": { periodLabel: "ytd", interval: "1d", intraday: false },
  "1y": { periodLabel: "1y", interval: "1d", intraday: false },
  "5y": { periodLabel: "5y", interval: "1wk", intraday: false },
  "max": { periodLabel: "max", interval: "1wk", intraday: false },
};

function getStartDate(period: string): Date {
  const now = new Date();
  switch (period) {
    case "1d":
      return new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
    case "5d":
      return new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
    case "1mo":
      return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    case "3mo":
      return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    case "6mo":
      return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    case "ytd":
      return new Date(now.getFullYear(), 0, 1);
    case "1y":
      return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    case "5y":
      return new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
    case "max":
      // Yahoo clamps to the first available bar, so this really is "max".
      return new Date(Date.UTC(1970, 0, 2));
    default:
      return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  }
}

function filterToLastTradingDay(quotes: any[]): any[] {
  if (quotes.length === 0) return quotes;

  // Group volume by UTC date to find the last real trading session
  const volumeByDay: Record<string, number> = {};
  for (const q of quotes) {
    const day = new Date(q.date).toISOString().split("T")[0];
    volumeByDay[day] = (volumeByDay[day] || 0) + (q.volume || 0);
  }

  // Find the most recent date with actual trading volume
  const tradingDays = Object.entries(volumeByDay)
    .filter(([, vol]) => vol > 0)
    .map(([day]) => day)
    .sort();

  if (tradingDays.length === 0) return quotes;
  const lastTradingDay = tradingDays[tradingDays.length - 1];

  return quotes.filter(
    (q: any) => new Date(q.date).toISOString().split("T")[0] === lastTradingDay
  );
}

function removeZeroVolumeTail(quotes: any[]): any[] {
  const hasVolume = quotes.some((q) => (q.volume || 0) > 0);
  if (!hasVolume) return quotes;

  return quotes.filter((q) => (q.volume || 0) > 0);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  const sp = request.nextUrl.searchParams;
  const range = sp.get("range") || "1y";
  const requestedInterval = sp.get("interval");
  const startParam = parseDateParam(sp.get("startDate"));
  const endParam = parseDateParam(sp.get("endDate"));

  const symbol = normalizeSymbol(params.symbol);
  const config = rangeMap[range] || rangeMap["1y"];

  if (!isValidMarketSymbol(symbol)) {
    return NextResponse.json(
      { data: [], error: "Invalid market symbol" },
      { status: 400, headers: noStoreHeaders }
    );
  }

  const badRequest = (error: string) =>
    NextResponse.json({ data: [], error }, { status: 400, headers: noStoreHeaders });

  if (requestedInterval && !INTERVALS.some((i) => i.value === requestedInterval)) {
    return badRequest("Invalid interval");
  }
  if (startParam === "invalid" || endParam === "invalid") {
    return badRequest("Invalid date");
  }

  const interval = (requestedInterval || config.interval) as ChartInterval | "30m";
  const now = new Date();
  const period1 = startParam ?? getStartDate(config.periodLabel);
  // endDate is a calendar day chosen by the user: make it inclusive.
  let period2 = endParam ? new Date(endParam.getTime() + (sp.get("endDate")!.length === 10 ? DAY_MS : 0)) : now;
  if (period2 > now) period2 = now;

  if (period1 >= period2) return badRequest("startDate must be before endDate");
  const spanDays = (period2.getTime() - period1.getTime()) / DAY_MS;
  if (spanDays > MAX_CUSTOM_SPAN_DAYS) return badRequest("Date range too large");

  const intervalLimit = INTERVALS.find((i) => i.value === interval)?.maxDays ?? Infinity;
  // Fixed ranges pad a few days for weekends/holidays; allow that slack.
  const slack = startParam ? 0 : 6;
  if (spanDays > intervalLimit + slack) return badRequest("Interval not available for this range");
  const lookback = INTRADAY_LOOKBACK_DAYS[interval];
  if (lookback && (now.getTime() - period1.getTime()) / DAY_MS > lookback + 1) {
    return badRequest("Intraday data is only available for recent dates");
  }

  const intraday = INTRADAY_INTERVALS.has(interval) || interval === "30m";

  try {
    const chartOptions = { period1, period2, interval: interval as any };

    const result = await yahooFinance.chart(symbol, chartOptions);

    const resultQuotes = Array.isArray(result.quotes) ? result.quotes : [];
    let quotes = resultQuotes.filter(
      (q: any) =>
        q.open != null && q.close != null && q.high != null && q.low != null
    );

    const isCrypto = symbol.includes("-");
    if (range === "1d" && !isCrypto) {
      quotes = filterToLastTradingDay(quotes);
      quotes = removeZeroVolumeTail(quotes);
    }

    const data = quotes.map((q: any) => {
      const date = new Date(q.date);
      return {
        time: intraday
          ? Math.floor(date.getTime() / 1000)
          : date.toISOString().split("T")[0],
        open: parseFloat(q.open.toFixed(2)),
        high: parseFloat(q.high.toFixed(2)),
        low: parseFloat(q.low.toFixed(2)),
        close: parseFloat(q.close.toFixed(2)),
        volume: q.volume || 0,
      };
    });

    return NextResponse.json(
      {
        data,
        meta: {
          symbol,
          range: config.periodLabel,
          interval: interval,
          source: "Yahoo Finance",
          updatedAt: new Date().toISOString(),
        },
      },
      { headers: marketDataCacheHeaders }
    );
  } catch (error) {
    console.error("Chart error:", error);
    return NextResponse.json(
      { data: [], error: "Chart data temporarily unavailable" },
      { status: 502, headers: noStoreHeaders }
    );
  }
}
