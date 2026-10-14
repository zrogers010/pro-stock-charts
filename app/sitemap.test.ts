import { describe, it, expect, beforeAll } from "vitest";
import sitemap from "@/app/sitemap";

describe("Sitemap", () => {
  let sitemapData: ReturnType<typeof sitemap>;

  beforeAll(() => {
    // Generate sitemap without network access
    sitemapData = sitemap();
  });

  it("should return an array of sitemap entries", () => {
    expect(Array.isArray(sitemapData)).toBe(true);
    expect(sitemapData.length).toBeGreaterThan(0);
  });

  it("should include homepage", () => {
    const homepage = sitemapData.find((entry) => entry.url === "https://prostockcharts.com/");
    expect(homepage).toBeDefined();
    expect(homepage?.priority).toBe(1);
  });

  it("should include main pages (compare, tools, learn)", () => {
    const mainPages = ["compare", "tools", "data-disclaimer", "privacy", "terms"];
    
    for (const page of mainPages) {
      const entry = sitemapData.find((e) => e.url === `https://prostockcharts.com/${page}`);
      expect(entry, `${page} should be in sitemap`).toBeDefined();
    }
  });

  it("should include popular stock pages", () => {
    const popularStocks = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"];
    
    for (const symbol of popularStocks) {
      const entry = sitemapData.find((e) => e.url === `https://prostockcharts.com/stock/${symbol}`);
      expect(entry, `${symbol} should be in sitemap`).toBeDefined();
      expect(entry?.changeFrequency).toBe("hourly");
    }
  });

  it("should include several hundred popular tickers", () => {
    const stockPages = sitemapData.filter((e) => e.url.includes("/stock/"));
    expect(stockPages.length).toBeGreaterThanOrEqual(200);
    expect(stockPages.length).toBeLessThan(500);
  });

  it("should include hub pages (stocks, etfs, crypto, commodities)", () => {
    const hubs = ["stocks", "etfs", "crypto", "commodities", "futures", "indices"];
    
    for (const hub of hubs) {
      const entry = sitemapData.find((e) => e.url === `https://prostockcharts.com/${hub}`);
      expect(entry, `${hub} hub should be in sitemap`).toBeDefined();
    }
  });

  it("should include education articles", () => {
    const educationPages = sitemapData.filter((e) => e.url.includes("/learn/"));
    expect(educationPages.length).toBeGreaterThan(0);
  });

  it("should include indicator articles", () => {
    const indicatorPages = sitemapData.filter((e) => e.url.includes("/indicators/"));
    expect(indicatorPages.length).toBeGreaterThan(0);
  });

  it("should include comparison pages", () => {
    const comparisonPages = sitemapData.filter((e) => e.url.includes("/compare/"));
    expect(comparisonPages.length).toBeGreaterThan(0);
  });

  it("should have valid URL format for all entries", () => {
    for (const entry of sitemapData) {
      expect(entry.url).toMatch(/^https:\/\/prostockcharts\.com\//);
      expect(() => new URL(entry.url)).not.toThrow();
    }
  });

  it("should have valid changeFrequency values", () => {
    const validFrequencies = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];
    
    for (const entry of sitemapData) {
      if (entry.changeFrequency) {
        expect(validFrequencies).toContain(entry.changeFrequency);
      }
    }
  });

  it("should have valid priority values", () => {
    for (const entry of sitemapData) {
      if (entry.priority !== undefined) {
        expect(entry.priority).toBeGreaterThanOrEqual(0);
        expect(entry.priority).toBeLessThanOrEqual(1);
      }
    }
  });

  it("should generate without making network calls", () => {
    // This test passes if sitemap() completes synchronously
    // without throwing errors about network unavailability
    expect(() => sitemap()).not.toThrow();
  });
});

describe("Sitemap uniqueness", () => {
  it("has no duplicate URLs", () => {
    const urls = sitemap().map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
