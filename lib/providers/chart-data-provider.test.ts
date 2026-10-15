/**
 * Tests for chart data provider interface
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { YahooChartDataProvider } from "./chart-data-provider";
import type { ChartDataFetchOptions } from "./chart-data-provider";

describe("YahooChartDataProvider", () => {
  let provider: YahooChartDataProvider;
  let fetchSpy: typeof global.fetch;

  beforeAll(() => {
    fetchSpy = global.fetch;
  });

  afterAll(() => {
    global.fetch = fetchSpy;
  });

  beforeEach(() => {
    provider = new YahooChartDataProvider();
  });

  it("should construct correct URL with range", async () => {
    let capturedUrl = "";
    global.fetch = async (url: string | Request | URL) => {
      capturedUrl = url.toString();
      return new Response(
        JSON.stringify({ data: [], meta: { symbol: "AAPL", source: "Yahoo", updatedAt: new Date().toISOString() } }),
        { status: 200 }
      );
    };

    await provider.fetchChartData("AAPL", { range: "1y" });
    expect(capturedUrl).toContain("/api/chart/AAPL");
    expect(capturedUrl).toContain("range=1y");
  });

  it("should construct correct URL with interval", async () => {
    let capturedUrl = "";
    global.fetch = async (url: string | Request | URL) => {
      capturedUrl = url.toString();
      return new Response(
        JSON.stringify({ data: [], meta: { symbol: "AAPL", source: "Yahoo", updatedAt: new Date().toISOString() } }),
        { status: 200 }
      );
    };

    await provider.fetchChartData("AAPL", { range: "1d", interval: "5m" });
    expect(capturedUrl).toContain("range=1d");
    expect(capturedUrl).toContain("interval=5m");
  });

  it("should construct correct URL with custom dates", async () => {
    let capturedUrl = "";
    global.fetch = async (url: string | Request | URL) => {
      capturedUrl = url.toString();
      return new Response(
        JSON.stringify({ data: [], meta: { symbol: "AAPL", source: "Yahoo", updatedAt: new Date().toISOString() } }),
        { status: 200 }
      );
    };

    const startDate = new Date("2024-01-01");
    const endDate = new Date("2024-12-31");

    await provider.fetchChartData("AAPL", {
      startDate,
      endDate,
    });

    expect(capturedUrl).toContain("startDate=2024-01-01");
    expect(capturedUrl).toContain("endDate=2024-12-31");
  });

  it("should throw error on failed fetch", async () => {
    global.fetch = async () => {
      return new Response("Not Found", { status: 404 });
    };

    await expect(
      provider.fetchChartData("INVALID", { range: "1y" })
    ).rejects.toThrow("Chart request failed: 404");
  });

  it("should parse response data correctly", async () => {
    const mockData = {
      data: [
        { time: "2024-01-01", open: 100, high: 110, low: 95, close: 105, volume: 1000000 },
      ],
      meta: {
        symbol: "AAPL",
        source: "Yahoo Finance",
        updatedAt: new Date().toISOString(),
      },
    };

    global.fetch = async () => {
      return new Response(JSON.stringify(mockData), { status: 200 });
    };

    const result = await provider.fetchChartData("AAPL", { range: "1d" });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].close).toBe(105);
    expect(result.meta.symbol).toBe("AAPL");
  });
});
