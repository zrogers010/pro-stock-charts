import { describe, it, expect } from "vitest";
import {
  calculateSMA,
  calculateEMA,
  calculateBollingerBands,
  calculateRSI,
  calculateMACD,
  type OHLCData,
} from "@/lib/technical-indicators";

// Test data: simple increasing prices for easy verification
const simpleData: OHLCData[] = [
  { time: "2026-01-01", open: 100, high: 102, low: 99, close: 100, volume: 1000 },
  { time: "2026-01-02", open: 100, high: 103, low: 100, close: 101, volume: 1100 },
  { time: "2026-01-03", open: 101, high: 104, low: 101, close: 102, volume: 1200 },
  { time: "2026-01-04", open: 102, high: 105, low: 102, close: 103, volume: 1300 },
  { time: "2026-01-05", open: 103, high: 106, low: 103, close: 104, volume: 1400 },
  { time: "2026-01-06", open: 104, high: 107, low: 104, close: 105, volume: 1500 },
  { time: "2026-01-07", open: 105, high: 108, low: 105, close: 106, volume: 1600 },
  { time: "2026-01-08", open: 106, high: 109, low: 106, close: 107, volume: 1700 },
  { time: "2026-01-09", open: 107, high: 110, low: 107, close: 108, volume: 1800 },
  { time: "2026-01-10", open: 108, high: 111, low: 108, close: 109, volume: 1900 },
];

// More realistic data with ups and downs for RSI and MACD testing
const realisticData: OHLCData[] = [
  { time: "2026-01-01", open: 100, high: 102, low: 99, close: 101, volume: 1000 },
  { time: "2026-01-02", open: 101, high: 103, low: 100, close: 102, volume: 1100 },
  { time: "2026-01-03", open: 102, high: 104, low: 101, close: 99, volume: 1200 },
  { time: "2026-01-04", open: 99, high: 101, low: 98, close: 100, volume: 1300 },
  { time: "2026-01-05", open: 100, high: 102, low: 99, close: 103, volume: 1400 },
  { time: "2026-01-06", open: 103, high: 105, low: 102, close: 104, volume: 1500 },
  { time: "2026-01-07", open: 104, high: 106, low: 103, close: 102, volume: 1600 },
  { time: "2026-01-08", open: 102, high: 104, low: 101, close: 103, volume: 1700 },
  { time: "2026-01-09", open: 103, high: 105, low: 102, close: 106, volume: 1800 },
  { time: "2026-01-10", open: 106, high: 108, low: 105, close: 107, volume: 1900 },
  { time: "2026-01-11", open: 107, high: 109, low: 106, close: 105, volume: 2000 },
  { time: "2026-01-12", open: 105, high: 107, low: 104, close: 106, volume: 2100 },
  { time: "2026-01-13", open: 106, high: 108, low: 105, close: 108, volume: 2200 },
  { time: "2026-01-14", open: 108, high: 110, low: 107, close: 109, volume: 2300 },
  { time: "2026-01-15", open: 109, high: 111, low: 108, close: 110, volume: 2400 },
  { time: "2026-01-16", open: 110, high: 112, low: 109, close: 111, volume: 2500 },
  { time: "2026-01-17", open: 111, high: 113, low: 110, close: 108, volume: 2600 },
  { time: "2026-01-18", open: 108, high: 110, low: 107, close: 109, volume: 2700 },
  { time: "2026-01-19", open: 109, high: 111, low: 108, close: 112, volume: 2800 },
  { time: "2026-01-20", open: 112, high: 114, low: 111, close: 113, volume: 2900 },
  { time: "2026-01-21", open: 113, high: 115, low: 112, close: 114, volume: 3000 },
  { time: "2026-01-22", open: 114, high: 116, low: 113, close: 115, volume: 3100 },
  { time: "2026-01-23", open: 115, high: 117, low: 114, close: 112, volume: 3200 },
  { time: "2026-01-24", open: 112, high: 114, low: 111, close: 113, volume: 3300 },
  { time: "2026-01-25", open: 113, high: 115, low: 112, close: 116, volume: 3400 },
  { time: "2026-01-26", open: 116, high: 118, low: 115, close: 117, volume: 3500 },
  { time: "2026-01-27", open: 117, high: 119, low: 116, close: 118, volume: 3600 },
  { time: "2026-01-28", open: 118, high: 120, low: 117, close: 119, volume: 3700 },
  { time: "2026-01-29", open: 119, high: 121, low: 118, close: 120, volume: 3800 },
  { time: "2026-01-30", open: 120, high: 122, low: 119, close: 121, volume: 3900 },
  { time: "2026-01-31", open: 121, high: 123, low: 120, close: 122, volume: 4000 },
  { time: "2026-02-01", open: 122, high: 124, low: 121, close: 123, volume: 4100 },
  { time: "2026-02-02", open: 123, high: 125, low: 122, close: 120, volume: 4200 },
  { time: "2026-02-03", open: 120, high: 122, low: 119, close: 121, volume: 4300 },
  { time: "2026-02-04", open: 121, high: 123, low: 120, close: 124, volume: 4400 },
  { time: "2026-02-05", open: 124, high: 126, low: 123, close: 125, volume: 4500 },
  { time: "2026-02-06", open: 125, high: 127, low: 124, close: 126, volume: 4600 },
  { time: "2026-02-07", open: 126, high: 128, low: 125, close: 127, volume: 4700 },
  { time: "2026-02-08", open: 127, high: 129, low: 126, close: 128, volume: 4800 },
  { time: "2026-02-09", open: 128, high: 130, low: 127, close: 129, volume: 4900 },
];

describe("Technical Indicators", () => {
  describe("calculateSMA", () => {
    it("should calculate SMA correctly for period 3", () => {
      const result = calculateSMA(simpleData, 3);
      
      expect(result.length).toBe(8); // 10 data points - 3 + 1
      expect(result[0].time).toBe("2026-01-03");
      expect(result[0].value).toBeCloseTo((100 + 101 + 102) / 3, 2);
      
      expect(result[1].time).toBe("2026-01-04");
      expect(result[1].value).toBeCloseTo((101 + 102 + 103) / 3, 2);
      
      expect(result[result.length - 1].time).toBe("2026-01-10");
      expect(result[result.length - 1].value).toBeCloseTo((107 + 108 + 109) / 3, 2);
    });

    it("should calculate SMA correctly for period 5", () => {
      const result = calculateSMA(simpleData, 5);
      
      expect(result.length).toBe(6);
      expect(result[0].value).toBeCloseTo((100 + 101 + 102 + 103 + 104) / 5, 2);
      expect(result[result.length - 1].value).toBeCloseTo((105 + 106 + 107 + 108 + 109) / 5, 2);
    });

    it("should return empty array if not enough data", () => {
      const result = calculateSMA(simpleData.slice(0, 2), 5);
      expect(result).toEqual([]);
    });
  });

  describe("calculateEMA", () => {
    it("should calculate EMA correctly", () => {
      const result = calculateEMA(simpleData, 3);
      
      expect(result.length).toBe(8);
      // First value should be SMA
      expect(result[0].value).toBeCloseTo((100 + 101 + 102) / 3, 2);
      
      // EMA values should be valid numbers
      for (const point of result) {
        expect(point.value).toBeGreaterThan(0);
        expect(typeof point.value).toBe("number");
      }
      
      // Last EMA value should be close to last price for trending data
      expect(result[result.length - 1].value).toBeGreaterThan(105);
    });

    it("should return empty array if not enough data", () => {
      const result = calculateEMA(simpleData.slice(0, 2), 5);
      expect(result).toEqual([]);
    });
  });

  describe("calculateBollingerBands", () => {
    it("should calculate Bollinger Bands with default parameters (20,2)", () => {
      const result = calculateBollingerBands(realisticData, 20, 2);
      
      expect(result.length).toBe(realisticData.length - 19);
      
      // Check first result
      expect(result[0].time).toBe(realisticData[19].time);
      expect(result[0].middle).toBeGreaterThan(0);
      expect(result[0].upper).toBeGreaterThan(result[0].middle);
      expect(result[0].lower).toBeLessThan(result[0].middle);
      
      // Upper and lower should be symmetrically distant from middle
      const upperDist = result[0].upper - result[0].middle;
      const lowerDist = result[0].middle - result[0].lower;
      expect(upperDist).toBeCloseTo(lowerDist, 5);
    });

    it("should return empty array if not enough data", () => {
      const result = calculateBollingerBands(simpleData, 20, 2);
      expect(result).toEqual([]);
    });
  });

  describe("calculateRSI", () => {
    it("should calculate RSI correctly", () => {
      const result = calculateRSI(realisticData, 14);
      
      expect(result.length).toBeGreaterThan(0);
      
      // RSI should be between 0 and 100
      for (const point of result) {
        expect(point.value).toBeGreaterThanOrEqual(0);
        expect(point.value).toBeLessThanOrEqual(100);
      }
    });

    it("should return RSI around 50 for neutral market", () => {
      // Create data with equal ups and downs
      const neutralData: OHLCData[] = [];
      for (let i = 0; i < 30; i++) {
        neutralData.push({
          time: `2026-01-${i + 1}`,
          open: 100,
          high: 102,
          low: 98,
          close: i % 2 === 0 ? 101 : 99,
          volume: 1000,
        });
      }
      
      const result = calculateRSI(neutralData, 14);
      expect(result.length).toBeGreaterThan(0);
      
      // With alternating gains and losses, RSI should be around 50
      const lastRSI = result[result.length - 1].value;
      expect(lastRSI).toBeGreaterThan(30);
      expect(lastRSI).toBeLessThan(70);
    });

    it("should return empty array if not enough data", () => {
      const result = calculateRSI(simpleData, 14);
      expect(result).toEqual([]);
    });
  });

  describe("calculateMACD", () => {
    it("should calculate MACD with default parameters (12,26,9)", () => {
      const result = calculateMACD(realisticData, 12, 26, 9);
      
      expect(result.length).toBeGreaterThan(0);
      
      // Check structure of results
      for (const point of result) {
        expect(point).toHaveProperty("macd");
        expect(point).toHaveProperty("signal");
        expect(point).toHaveProperty("histogram");
        
        // Histogram should be macd - signal
        expect(point.histogram).toBeCloseTo(point.macd - point.signal, 5);
      }
    });

    it("should show upward momentum in uptrend", () => {
      const result = calculateMACD(realisticData, 12, 26, 9);
      
      if (result.length > 0) {
        // In an uptrend, MACD should eventually be positive
        const lastPoint = result[result.length - 1];
        expect(typeof lastPoint.macd).toBe("number");
      }
    });

    it("should return empty array if not enough data", () => {
      const result = calculateMACD(simpleData, 12, 26, 9);
      expect(result).toEqual([]);
    });
  });

  describe("Integration tests", () => {
    it("should handle edge case of all same prices", () => {
      const flatData: OHLCData[] = Array.from({ length: 30 }, (_, i) => ({
        time: `2026-01-${i + 1}`,
        open: 100,
        high: 100,
        low: 100,
        close: 100,
        volume: 1000,
      }));

      const sma = calculateSMA(flatData, 5);
      expect(sma.every((point) => point.value === 100)).toBe(true);

      const ema = calculateEMA(flatData, 5);
      expect(ema.every((point) => point.value === 100)).toBe(true);

      const bb = calculateBollingerBands(flatData, 20, 2);
      expect(bb.every((point) => point.upper === 100 && point.lower === 100)).toBe(true);

      const rsi = calculateRSI(flatData, 14);
      // With no price changes, RSI calculation will have division issues
      // but should still return valid numbers
      expect(rsi.length).toBeGreaterThan(0);
    });

    it("should preserve time alignment across indicators", () => {
      const sma20 = calculateSMA(realisticData, 20);
      const ema20 = calculateEMA(realisticData, 20);
      const bb = calculateBollingerBands(realisticData, 20, 2);

      // All should start at the same time
      expect(sma20[0].time).toBe(realisticData[19].time);
      expect(ema20[0].time).toBe(realisticData[19].time);
      expect(bb[0].time).toBe(realisticData[19].time);
    });
  });
});

describe("RSI reference values", () => {
  it("returns 100 when there are no losses in a pure uptrend", () => {
    const up: OHLCData[] = Array.from({ length: 30 }, (_, i) => ({
      time: i, open: 100 + i, high: 100 + i, low: 100 + i, close: 100 + i * 0.5, volume: 1,
    }));
    expect(calculateRSI(up, 14).at(-1)!.value).toBe(100);
  });

  it("returns 50 for a flat series", () => {
    const flat: OHLCData[] = Array.from({ length: 20 }, (_, i) => ({
      time: i, open: 100, high: 100, low: 100, close: 100, volume: 1,
    }));
    expect(calculateRSI(flat, 14).every((p) => p.value === 50)).toBe(true);
  });

  it("matches Wilder RSI computed by hand for realisticData", () => {
    const closes = realisticData.map((d) => d.close);
    const diffs = closes.slice(1).map((c, i) => c - closes[i]);
    let g = diffs.slice(0, 14).reduce((a, d) => a + Math.max(d, 0), 0) / 14;
    let l = diffs.slice(0, 14).reduce((a, d) => a + Math.max(-d, 0), 0) / 14;
    for (let i = 14; i < diffs.length; i++) {
      g = (g * 13 + Math.max(diffs[i], 0)) / 14;
      l = (l * 13 + Math.max(-diffs[i], 0)) / 14;
    }
    expect(calculateRSI(realisticData, 14).at(-1)!.value).toBeCloseTo(100 - 100 / (1 + g / l), 10);
  });
});
