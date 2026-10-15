/**
 * Chart Data Provider Interface
 * Abstracts data fetching to support multiple providers (Yahoo, licensed providers, etc.)
 */

export interface ChartDataPoint {
  time: string | number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartDataResponse {
  data: ChartDataPoint[];
  meta: {
    symbol: string;
    range?: string;
    interval?: string;
    source: string;
    updatedAt: string;
  };
}

export interface ChartDataProvider {
  /**
   * Fetch chart data for a symbol
   * @param symbol - The ticker symbol
   * @param options - Fetching options (range, interval, dates, etc.)
   */
  fetchChartData(
    symbol: string,
    options: ChartDataFetchOptions
  ): Promise<ChartDataResponse>;
}

export interface ChartDataFetchOptions {
  range?: string;
  interval?: string;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Yahoo Finance implementation of ChartDataProvider
 */
export class YahooChartDataProvider implements ChartDataProvider {
  async fetchChartData(
    symbol: string,
    options: ChartDataFetchOptions
  ): Promise<ChartDataResponse> {
    const params = new URLSearchParams();
    
    if (options.range) {
      params.set("range", options.range);
    }
    if (options.interval) {
      params.set("interval", options.interval);
    }
    if (options.startDate) {
      params.set("startDate", options.startDate.toISOString());
    }
    if (options.endDate) {
      params.set("endDate", options.endDate.toISOString());
    }

    const res = await fetch(`/api/chart/${encodeURIComponent(symbol)}?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Chart request failed: ${res.status}`);
    }

    return await res.json();
  }
}

/**
 * Default provider instance
 */
export const defaultChartDataProvider: ChartDataProvider =
  new YahooChartDataProvider();
