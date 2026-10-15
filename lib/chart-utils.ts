/**
 * Chart utility functions for intervals, ranges, and data transformations
 */

export type ChartInterval = "1m" | "5m" | "15m" | "1h" | "1d" | "1wk" | "1mo";
export type ChartRange = "1d" | "5d" | "1mo" | "3mo" | "6mo" | "ytd" | "1y" | "5y" | "max";

export interface IntervalConfig {
  value: ChartInterval;
  label: string;
  maxDays: number;
}

export interface RangeConfig {
  value: ChartRange;
  label: string;
  days: number | null; // null for 'max'
}

export const INTERVALS: IntervalConfig[] = [
  { value: "1m", label: "1m", maxDays: 7 },
  { value: "5m", label: "5m", maxDays: 60 },
  { value: "15m", label: "15m", maxDays: 60 },
  { value: "1h", label: "1h", maxDays: 730 },
  { value: "1d", label: "1D", maxDays: Infinity },
  { value: "1wk", label: "1W", maxDays: Infinity },
  { value: "1mo", label: "1M", maxDays: Infinity },
];

export const RANGES: RangeConfig[] = [
  { value: "1d", label: "1D", days: 1 },
  { value: "5d", label: "5D", days: 5 },
  { value: "1mo", label: "1M", days: 30 },
  { value: "3mo", label: "3M", days: 90 },
  { value: "6mo", label: "6M", days: 180 },
  { value: "ytd", label: "YTD", days: null },
  { value: "1y", label: "1Y", days: 365 },
  { value: "5y", label: "5Y", days: 1825 },
  { value: "max", label: "Max", days: null },
];

/**
 * Check if an interval is valid for a given range
 */
export function isValidIntervalForRange(
  interval: ChartInterval,
  range: ChartRange,
  startDate?: Date,
  endDate?: Date
): boolean {
  const intervalConfig = INTERVALS.find((i) => i.value === interval);
  if (!intervalConfig) return false;

  let days: number;

  if (startDate && endDate) {
    days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  } else {
    const rangeConfig = RANGES.find((r) => r.value === range);
    if (!rangeConfig) return false;

    if (rangeConfig.days === null) {
      if (range === "ytd") {
        const now = new Date();
        const yearStart = new Date(now.getFullYear(), 0, 1);
        days = Math.ceil((now.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24));
      } else {
        // 'max' - assume 10 years
        days = 3650;
      }
    } else {
      days = rangeConfig.days;
    }
  }

  return days <= intervalConfig.maxDays;
}

/**
 * Get the default interval for a given range
 */
export function getDefaultIntervalForRange(range: ChartRange): ChartInterval {
  const rangeConfig = RANGES.find((r) => r.value === range);
  const days = rangeConfig?.days ?? (range === "ytd" ? 365 : 3650);

  if (days <= 1) return "5m";
  if (days <= 5) return "15m";
  if (days <= 60) return "1h";
  if (days <= 365) return "1d";
  return "1wk";
}

/**
 * Get valid intervals for a range
 */
export function getValidIntervalsForRange(range: ChartRange): ChartInterval[] {
  return INTERVALS.filter((interval) =>
    isValidIntervalForRange(interval.value, range)
  ).map((i) => i.value);
}

/**
 * Calculate the start date for a given range
 */
export function getStartDateForRange(range: ChartRange, endDate: Date = new Date()): Date {
  const rangeConfig = RANGES.find((r) => r.value === range);
  
  if (!rangeConfig) {
    return new Date(endDate.getFullYear() - 1, endDate.getMonth(), endDate.getDate());
  }

  if (range === "ytd") {
    return new Date(endDate.getFullYear(), 0, 1);
  }

  if (range === "max") {
    // Return a date far in the past; Yahoo will handle the actual max
    return new Date(endDate.getFullYear() - 20, endDate.getMonth(), endDate.getDate());
  }

  if (rangeConfig.days === null) {
    return new Date(endDate.getFullYear() - 1, endDate.getMonth(), endDate.getDate());
  }

  return new Date(endDate.getTime() - rangeConfig.days * 24 * 60 * 60 * 1000);
}

/**
 * Normalize chart data to percentage change from a reference point
 */
export function normalizeToPercentChange(
  data: Array<{ time: string | number; value: number }>,
  referenceValue: number
): Array<{ time: string | number; value: number }> {
  if (referenceValue === 0) {
    return data.map((d) => ({ time: d.time, value: 0 }));
  }

  return data.map((d) => ({
    time: d.time,
    value: ((d.value - referenceValue) / referenceValue) * 100,
  }));
}

/**
 * Find the reference value (first visible data point) for normalization
 */
export function findReferenceValue(
  data: Array<{ time: string | number; value: number }>,
  visibleRange?: { from: number; to: number }
): number {
  if (data.length === 0) return 0;

  if (!visibleRange) {
    return data[0].value;
  }

  // Find the first data point within the visible range
  for (const point of data) {
    const time = typeof point.time === "string" 
      ? new Date(point.time).getTime() / 1000 
      : point.time;
    
    if (time >= visibleRange.from) {
      return point.value;
    }
  }

  return data[0].value;
}
