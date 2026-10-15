/**
 * Tests for chart utility functions
 */

import { describe, it, expect } from "vitest";
import {
  isValidIntervalForRange,
  getDefaultIntervalForRange,
  getValidIntervalsForRange,
  getStartDateForRange,
  normalizeToPercentChange,
  findReferenceValue,
  type ChartInterval,
  type ChartRange,
} from "./chart-utils";

describe("isValidIntervalForRange", () => {
  it("should allow 1m interval for 1d range", () => {
    expect(isValidIntervalForRange("1m", "1d")).toBe(true);
  });

  it("should not allow 1m interval for 1y range", () => {
    expect(isValidIntervalForRange("1m", "1y")).toBe(false);
  });

  it("should allow 1d interval for any range", () => {
    expect(isValidIntervalForRange("1d", "1d")).toBe(true);
    expect(isValidIntervalForRange("1d", "1y")).toBe(true);
    expect(isValidIntervalForRange("1d", "5y")).toBe(true);
    expect(isValidIntervalForRange("1d", "max")).toBe(true);
  });

  it("should handle custom date range", () => {
    const start = new Date("2024-01-01");
    const end = new Date("2024-01-03");
    expect(isValidIntervalForRange("1m", "1d", start, end)).toBe(true);
    expect(isValidIntervalForRange("5m", "1d", start, end)).toBe(true);
  });

  it("should reject 1m for long custom ranges", () => {
    const start = new Date("2024-01-01");
    const end = new Date("2024-02-01");
    expect(isValidIntervalForRange("1m", "1d", start, end)).toBe(false);
  });
});

describe("getDefaultIntervalForRange", () => {
  it("should return appropriate intervals for short ranges", () => {
    expect(getDefaultIntervalForRange("1d")).toBe("5m");
    expect(getDefaultIntervalForRange("5d")).toBe("15m");
  });

  it("should return 1h for medium ranges", () => {
    expect(getDefaultIntervalForRange("1mo")).toBe("1h");
  });

  it("should return 1d for long ranges", () => {
    expect(getDefaultIntervalForRange("1y")).toBe("1d");
  });

  it("should return 1wk for very long ranges", () => {
    expect(getDefaultIntervalForRange("5y")).toBe("1wk");
    expect(getDefaultIntervalForRange("max")).toBe("1wk");
  });

  it("should handle YTD range", () => {
    const interval = getDefaultIntervalForRange("ytd");
    expect(["1h", "1d"]).toContain(interval);
  });
});

describe("getValidIntervalsForRange", () => {
  it("should return all short intervals for 1d", () => {
    const valid = getValidIntervalsForRange("1d");
    expect(valid).toContain("1m");
    expect(valid).toContain("5m");
    expect(valid).toContain("15m");
  });

  it("should exclude 1m for 1y", () => {
    const valid = getValidIntervalsForRange("1y");
    expect(valid).not.toContain("1m");
    expect(valid).toContain("1d");
  });

  it("should return long intervals for max", () => {
    const valid = getValidIntervalsForRange("max");
    expect(valid).toContain("1d");
    expect(valid).toContain("1wk");
    expect(valid).toContain("1mo");
  });
});

describe("getStartDateForRange", () => {
  it("should calculate start date for 1d range", () => {
    const end = new Date("2024-06-15T12:00:00Z");
    const start = getStartDateForRange("1d", end);
    expect(start.getTime()).toBe(end.getTime() - 1 * 24 * 60 * 60 * 1000);
  });

  it("should calculate start date for 1y range", () => {
    const end = new Date("2024-06-15T12:00:00Z");
    const start = getStartDateForRange("1y", end);
    expect(start.getFullYear()).toBe(2023);
    expect(start.getMonth()).toBe(5);
    expect([15, 16]).toContain(start.getDate());
  });

  it("should return Jan 1 for ytd range", () => {
    const end = new Date("2024-06-15T12:00:00Z");
    const start = getStartDateForRange("ytd", end);
    expect(start.getFullYear()).toBe(2024);
    expect(start.getMonth()).toBe(0);
    expect(start.getDate()).toBe(1);
  });

  it("should return far past date for max range", () => {
    const end = new Date("2024-06-15T12:00:00Z");
    const start = getStartDateForRange("max", end);
    expect(start.getFullYear()).toBe(2004);
  });
});

describe("normalizeToPercentChange", () => {
  it("should calculate percentage change correctly", () => {
    const data = [
      { time: "2024-01-01", value: 100 },
      { time: "2024-01-02", value: 110 },
      { time: "2024-01-03", value: 95 },
    ];

    const normalized = normalizeToPercentChange(data, 100);

    expect(normalized[0].value).toBe(0);
    expect(normalized[1].value).toBe(10);
    expect(normalized[2].value).toBe(-5);
  });

  it("should handle zero reference value", () => {
    const data = [
      { time: "2024-01-01", value: 10 },
      { time: "2024-01-02", value: 20 },
    ];

    const normalized = normalizeToPercentChange(data, 0);

    expect(normalized[0].value).toBe(0);
    expect(normalized[1].value).toBe(0);
  });

  it("should preserve time values", () => {
    const data = [
      { time: 1704067200, value: 100 },
      { time: 1704153600, value: 105 },
    ];

    const normalized = normalizeToPercentChange(data, 100);

    expect(normalized[0].time).toBe(1704067200);
    expect(normalized[1].time).toBe(1704153600);
  });

  it("should handle negative reference values", () => {
    const data = [
      { time: "2024-01-01", value: -100 },
      { time: "2024-01-02", value: -110 },
    ];

    const normalized = normalizeToPercentChange(data, -100);

    expect(normalized[0].value).toBeCloseTo(0);
    expect(normalized[1].value).toBe(10);
  });
});

describe("findReferenceValue", () => {
  it("should return first value when no visible range", () => {
    const data = [
      { time: "2024-01-01", value: 100 },
      { time: "2024-01-02", value: 110 },
    ];

    expect(findReferenceValue(data)).toBe(100);
  });

  it("should return 0 for empty data", () => {
    expect(findReferenceValue([])).toBe(0);
  });

  it("should find first visible value within range", () => {
    const data = [
      { time: 1704067200, value: 100 }, // 2024-01-01
      { time: 1704153600, value: 110 }, // 2024-01-02
      { time: 1704240000, value: 120 }, // 2024-01-03
    ];

    const visibleRange = { from: 1704153600, to: 1704326400 };
    expect(findReferenceValue(data, visibleRange)).toBe(110);
  });

  it("should handle string times in visible range", () => {
    const data = [
      { time: "2024-01-01", value: 100 },
      { time: "2024-01-02", value: 110 },
      { time: "2024-01-03", value: 120 },
    ];

    const visibleRange = {
      from: new Date("2024-01-02").getTime() / 1000,
      to: new Date("2024-01-04").getTime() / 1000,
    };
    expect(findReferenceValue(data, visibleRange)).toBe(110);
  });

  it("should return first value if no point is within range", () => {
    const data = [
      { time: 1704067200, value: 100 },
      { time: 1704153600, value: 110 },
    ];

    const visibleRange = { from: 1800000000, to: 1900000000 };
    expect(findReferenceValue(data, visibleRange)).toBe(100);
  });
});
