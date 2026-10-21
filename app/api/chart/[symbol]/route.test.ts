import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const chart = vi.fn();
vi.mock("@/lib/yahoo", () => ({ default: { chart: (...a: unknown[]) => chart(...a) } }));

import { GET } from "./route";

const call = (qs: string, symbol = "AAPL") =>
  GET(new NextRequest(`http://localhost/api/chart/${symbol}?${qs}`), { params: { symbol } });

const bar = (date: string) => ({ date: new Date(date), open: 1, high: 2, low: 0.5, close: 1.5, volume: 10 });

describe("GET /api/chart/[symbol]", () => {
  beforeEach(() => {
    chart.mockReset();
    chart.mockResolvedValue({ quotes: [bar("2026-09-15T14:00:00Z"), bar("2026-09-15T15:00:00Z")] });
  });

  it.each([
    "interval=bogus",
    "startDate=garbage",
    "startDate=2025-03-10&endDate=2025-03-01",
    "range=max&interval=1m",
    "range=1y&interval=5m",
    "interval=1m&startDate=2020-01-01&endDate=2020-01-03",
    "startDate=1800-01-01",
  ])("rejects %s with 400 without calling Yahoo", async (qs) => {
    const res = await call(qs);
    expect(res.status).toBe(400);
    expect(chart).not.toHaveBeenCalled();
  });

  it("uses unix timestamps for intraday intervals regardless of range", async () => {
    const res = await call("range=1mo&interval=1h");
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(typeof body.data[0].time).toBe("number");
    expect(new Set(body.data.map((d: { time: number }) => d.time)).size).toBe(2);
    expect(chart.mock.calls[0][1].interval).toBe("1h");
  });

  it("treats a calendar endDate as inclusive", async () => {
    await call("startDate=2025-03-01&endDate=2025-03-31");
    const opts = chart.mock.calls[0][1];
    expect(opts.period1.toISOString()).toBe("2025-03-01T00:00:00.000Z");
    expect(opts.period2.toISOString()).toBe("2025-04-01T00:00:00.000Z");
  });
});
