"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  createChart,
  ColorType,
  IChartApi,
  LineStyle,
  PriceScaleMode,
} from "lightweight-charts";
import { trackEvent } from "@/lib/analytics";
import { formatCurrency, formatNumber } from "@/lib/format";
import {
  calculateSMA,
  calculateEMA,
  calculateBollingerBands,
  calculateRSI,
  calculateMACD,
  type OHLCData,
} from "@/lib/technical-indicators";
import {
  RANGES,
  INTERVALS,
  getDefaultIntervalForRange,
  getValidIntervalsForRange,
  normalizeToPercentChange,
  type ChartRange,
  type ChartInterval,
} from "@/lib/chart-utils";
import { defaultChartDataProvider } from "@/lib/providers/chart-data-provider";

interface ChartDataPoint {
  time: string | number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

type ChartType = "area" | "candle";
type PriceScale = "normal" | "logarithmic" | "percentage";

type IndicatorSettings = {
  sma20: boolean;
  sma50: boolean;
  sma200: boolean;
  ema: boolean;
  bb: boolean;
  rsi: boolean;
  macd: boolean;
};

type SavedChartLayout = {
  range: ChartRange;
  interval: ChartInterval;
  type: ChartType;
  priceScale: PriceScale;
  indicators: IndicatorSettings;
  compareTickers: string[];
  chartHeight: number;
  customStartDate?: string;
  customEndDate?: string;
  savedAt: string;
};

const defaultIndicators: IndicatorSettings = {
  sma20: false,
  sma50: false,
  sma200: false,
  ema: false,
  bb: false,
  rsi: false,
  macd: false,
};

function chartLayoutKey(symbol: string) {
  return `psc_chart_layout_${symbol.toUpperCase()}`;
}

function readSavedLayout(symbol: string): SavedChartLayout | null {
  try {
    const stored = window.localStorage.getItem(chartLayoutKey(symbol));
    if (!stored) return null;
    const parsed = JSON.parse(stored) as SavedChartLayout;
    if (!parsed.indicators) {
      parsed.indicators = { ...defaultIndicators };
    }
    return parsed;
  } catch {
    return null;
  }
}

function serializeIndicators(ind: IndicatorSettings): string {
  const active = Object.entries(ind)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => key);
  return active.join(",");
}

function deserializeIndicators(value: string): IndicatorSettings {
  const active = value.split(",").filter(Boolean);
  const result = { ...defaultIndicators };
  for (const key of active) {
    if (key in result) {
      (result as any)[key] = true;
    }
  }
  return result;
}

export default function StockChartEnhanced({ symbol }: { symbol: string }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);
  const rsiContainerRef = useRef<HTMLDivElement>(null);
  const macdContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const rsiChartRef = useRef<IChartApi | null>(null);
  const macdChartRef = useRef<IChartApi | null>(null);

  const [activeRange, setActiveRange] = useState<ChartRange>("1y");
  const [activeInterval, setActiveInterval] = useState<ChartInterval>("1d");
  const [chartType, setChartType] = useState<ChartType>("area");
  const [priceScale, setPriceScale] = useState<PriceScale>("normal");
  const [indicators, setIndicators] = useState<IndicatorSettings>(defaultIndicators);
  const [showIndicatorMenu, setShowIndicatorMenu] = useState(false);
  const [showIntervalMenu, setShowIntervalMenu] = useState(false);
  const [showCompareMenu, setShowCompareMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [compareData, setCompareData] = useState<Record<string, ChartDataPoint[]>>({});
  const [compareTickers, setCompareTickers] = useState<string[]>([]);
  const [compareInput, setCompareInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasHydratedUrlState, setHasHydratedUrlState] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [savedLayout, setSavedLayout] = useState<SavedChartLayout | null>(null);
  const [layoutNotice, setLayoutNotice] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chartHeight, setChartHeight] = useState(480);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Hydrate from URL and localStorage
  useEffect(() => {
    setHasHydratedUrlState(false);
    setLayoutNotice(null);

    const params = new URLSearchParams(window.location.search);
    const range = params.get("range") as ChartRange | null;
    const interval = params.get("interval") as ChartInterval | null;
    const type = params.get("type");
    const scale = params.get("scale") as PriceScale | null;
    const indicatorsParam = params.get("indicators");
    const compare = params.get("compare");
    const height = params.get("height");
    const startDate = params.get("startDate");
    const endDate = params.get("endDate");
    
    const saved = readSavedLayout(symbol);
    const hasUrlLayout = Boolean(
      range || interval || type || scale || indicatorsParam || compare || height || startDate || endDate
    );

    const validRanges = RANGES.map((r) => r.value);
    if (range && validRanges.includes(range)) {
      setActiveRange(range);
      setActiveInterval(interval || getDefaultIntervalForRange(range));
    } else if (!hasUrlLayout && saved) {
      setActiveRange(saved.range);
      setActiveInterval(saved.interval || getDefaultIntervalForRange(saved.range));
    } else {
      setActiveRange("1y");
      setActiveInterval("1d");
    }

    if (type === "area" || type === "candle") {
      setChartType(type);
    } else if (!hasUrlLayout && saved) {
      setChartType(saved.type);
    }

    if (scale === "normal" || scale === "logarithmic" || scale === "percentage") {
      setPriceScale(scale);
    } else if (!hasUrlLayout && saved) {
      setPriceScale(saved.priceScale || "normal");
    }

    if (indicatorsParam) {
      setIndicators(deserializeIndicators(indicatorsParam));
    } else if (!hasUrlLayout && saved) {
      setIndicators(saved.indicators);
    }

    if (compare) {
      const tickers = compare.split(",").filter(Boolean).slice(0, 3);
      setCompareTickers(tickers);
    } else if (!hasUrlLayout && saved) {
      setCompareTickers(saved.compareTickers || []);
    }

    if (height) {
      const h = parseInt(height, 10);
      if (h >= 300 && h <= 1200) {
        setChartHeight(h);
      }
    } else if (!hasUrlLayout && saved) {
      setChartHeight(saved.chartHeight || 480);
    }

    if (startDate) {
      setCustomStartDate(startDate);
    } else if (!hasUrlLayout && saved) {
      setCustomStartDate(saved.customStartDate || "");
    }

    if (endDate) {
      setCustomEndDate(endDate);
    } else if (!hasUrlLayout && saved) {
      setCustomEndDate(saved.customEndDate || "");
    }

    setSavedLayout(saved);
    setHasHydratedUrlState(true);
  }, [symbol]);

  // Sync to URL
  useEffect(() => {
    if (!hasHydratedUrlState) return;
    const params = new URLSearchParams(window.location.search);
    params.set("range", activeRange);
    params.set("interval", activeInterval);
    params.set("type", chartType);
    params.set("scale", priceScale);
    params.set("height", chartHeight.toString());
    
    const indicatorStr = serializeIndicators(indicators);
    if (indicatorStr) {
      params.set("indicators", indicatorStr);
    } else {
      params.delete("indicators");
    }

    if (compareTickers.length > 0) {
      params.set("compare", compareTickers.join(","));
    } else {
      params.delete("compare");
    }

    if (customStartDate) {
      params.set("startDate", customStartDate);
    } else {
      params.delete("startDate");
    }

    if (customEndDate) {
      params.set("endDate", customEndDate);
    } else {
      params.delete("endDate");
    }

    const nextUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", nextUrl);
  }, [
    activeRange,
    activeInterval,
    chartType,
    priceScale,
    indicators,
    compareTickers,
    chartHeight,
    customStartDate,
    customEndDate,
    hasHydratedUrlState,
  ]);

  // Fetch main symbol data
  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const options: any = { range: activeRange, interval: activeInterval };
        if (customStartDate) options.startDate = new Date(customStartDate);
        if (customEndDate) options.endDate = new Date(customEndDate);

        const result = await defaultChartDataProvider.fetchChartData(symbol, options);
        if (!cancelled) setChartData(result.data || []);
      } catch {
        if (!cancelled) {
          setChartData([]);
          setError("Chart data is temporarily unavailable.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [symbol, activeRange, activeInterval, customStartDate, customEndDate, retryCount]);

  // Fetch comparison data
  useEffect(() => {
    if (compareTickers.length === 0) {
      setCompareData({});
      return;
    }

    let cancelled = false;
    const fetchCompareData = async () => {
      const newData: Record<string, ChartDataPoint[]> = {};
      for (const ticker of compareTickers) {
        try {
          const options: any = { range: activeRange, interval: activeInterval };
          if (customStartDate) options.startDate = new Date(customStartDate);
          if (customEndDate) options.endDate = new Date(customEndDate);

          const result = await defaultChartDataProvider.fetchChartData(ticker, options);
          newData[ticker] = result.data || [];
        } catch {
          newData[ticker] = [];
        }
      }
      if (!cancelled) setCompareData(newData);
    };

    fetchCompareData();
    return () => {
      cancelled = true;
    };
  }, [compareTickers, activeRange, activeInterval, customStartDate, customEndDate]);

  // Automatically switch to percentage scale when comparing
  useEffect(() => {
    if (compareTickers.length > 0 && priceScale === "normal") {
      setPriceScale("percentage");
    } else if (compareTickers.length === 0 && priceScale === "percentage") {
      setPriceScale("normal");
    }
  }, [compareTickers.length]);

  // Render chart with indicators
  useEffect(() => {
    if (!chartContainerRef.current) return;

    if (chartData.length === 0) {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
      if (rsiChartRef.current) {
        rsiChartRef.current.remove();
        rsiChartRef.current = null;
      }
      if (macdChartRef.current) {
        macdChartRef.current.remove();
        macdChartRef.current = null;
      }
      return;
    }

    // Remove existing charts
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }
    if (rsiChartRef.current) {
      rsiChartRef.current.remove();
      rsiChartRef.current = null;
    }
    if (macdChartRef.current) {
      macdChartRef.current.remove();
      macdChartRef.current = null;
    }

    const container = chartContainerRef.current;
    const showRSI = indicators.rsi;
    const showMACD = indicators.macd;
    const mainHeight = chartHeight - (showRSI ? 140 : 0) - (showMACD ? 140 : 0);

    const priceScaleMode =
      priceScale === "logarithmic"
        ? PriceScaleMode.Logarithmic
        : priceScale === "percentage"
        ? PriceScaleMode.Percentage
        : PriceScaleMode.Normal;

    const chart = createChart(container, {
      width: container.clientWidth,
      height: mainHeight,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#52525b",
        fontSize: 11,
        fontFamily: "Inter, system-ui, sans-serif",
      },
      grid: {
        vertLines: { color: "#27272a25" },
        horzLines: { color: "#27272a25" },
      },
      crosshair: {
        vertLine: {
          color: "#71717a60",
          width: 1,
          style: 3,
          labelBackgroundColor: "#27272a",
        },
        horzLine: {
          color: "#71717a60",
          width: 1,
          style: 3,
          labelBackgroundColor: "#27272a",
        },
      },
      rightPriceScale: {
        borderColor: "#27272a50",
        scaleMargins: { top: 0.06, bottom: 0.18 },
        mode: priceScaleMode,
      },
      timeScale: {
        borderColor: "#27272a50",
        timeVisible: activeInterval === "1m" || activeInterval === "5m" || activeInterval === "15m" || activeInterval === "1h",
        rightOffset: 5,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        mouseWheel: true,
        pinch: true,
        axisPressedMouseMove: true,
      },
    });

    chartRef.current = chart;

    const isPositive =
      chartData.length > 1 &&
      chartData[chartData.length - 1].close >= chartData[0].open;
    const lineColor = isPositive ? "#22c55e" : "#ef4444";

    // If percentage mode and comparing, normalize all data
    if (priceScale === "percentage") {
      const baseValue = chartData[0]?.close || 100;
      const normalizedMain = normalizeToPercentChange(
        chartData.map((d) => ({ time: d.time, value: d.close })),
        baseValue
      );

      const mainSeries = chart.addLineSeries({
        color: "#3b82f6",
        lineWidth: 2,
        title: symbol,
        priceLineVisible: false,
      });
      mainSeries.setData(normalizedMain.map((d) => ({ time: d.time as any, value: d.value })));

      // Add comparison series
      const colors = ["#f59e0b", "#8b5cf6", "#ec4899"];
      compareTickers.forEach((ticker, idx) => {
        const data = compareData[ticker];
        if (data && data.length > 0) {
          const tickerBaseValue = data[0]?.close || 100;
          const normalized = normalizeToPercentChange(
            data.map((d) => ({ time: d.time, value: d.close })),
            tickerBaseValue
          );

          const series = chart.addLineSeries({
            color: colors[idx % colors.length],
            lineWidth: 2,
            title: ticker,
            priceLineVisible: false,
          });
          series.setData(normalized.map((d) => ({ time: d.time as any, value: d.value })));
        }
      });
    } else {
      // Normal or log mode - show main series
      if (chartType === "area") {
        const series = chart.addAreaSeries({
          lineColor,
          topColor: `${lineColor}18`,
          bottomColor: `${lineColor}02`,
          lineWidth: 2,
          crosshairMarkerRadius: 4,
          crosshairMarkerBorderColor: lineColor,
          crosshairMarkerBackgroundColor: "#fff",
          priceLineVisible: false,
        });
        series.setData(
          chartData.map((d) => ({
            time: d.time as any,
            value: d.close,
          }))
        );
      } else {
        const series = chart.addCandlestickSeries({
          upColor: "#22c55e",
          downColor: "#ef4444",
          borderDownColor: "#ef4444",
          borderUpColor: "#22c55e",
          wickDownColor: "#ef444480",
          wickUpColor: "#22c55e80",
        });
        series.setData(
          chartData.map((d) => ({
            time: d.time as any,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
          }))
        );
      }
    }

    // Add indicators (only in non-percentage mode)
    if (priceScale !== "percentage") {
      const ohlcData: OHLCData[] = chartData.map((d) => ({
        time: d.time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
        volume: d.volume,
      }));

      if (indicators.sma20) {
        const sma20Data = calculateSMA(ohlcData, 20);
        const sma20Series = chart.addLineSeries({
          color: "#3b82f6",
          lineWidth: 2,
          title: "SMA 20",
          priceLineVisible: false,
        });
        sma20Series.setData(sma20Data.map((d) => ({ time: d.time as any, value: d.value })));
      }

      if (indicators.sma50) {
        const sma50Data = calculateSMA(ohlcData, 50);
        const sma50Series = chart.addLineSeries({
          color: "#f59e0b",
          lineWidth: 2,
          title: "SMA 50",
          priceLineVisible: false,
        });
        sma50Series.setData(sma50Data.map((d) => ({ time: d.time as any, value: d.value })));
      }

      if (indicators.sma200) {
        const sma200Data = calculateSMA(ohlcData, 200);
        const sma200Series = chart.addLineSeries({
          color: "#ef4444",
          lineWidth: 2,
          title: "SMA 200",
          priceLineVisible: false,
        });
        sma200Series.setData(sma200Data.map((d) => ({ time: d.time as any, value: d.value })));
      }

      if (indicators.ema) {
        const ema20Data = calculateEMA(ohlcData, 20);
        const ema20Series = chart.addLineSeries({
          color: "#8b5cf6",
          lineWidth: 2,
          lineStyle: LineStyle.Dashed,
          title: "EMA 20",
          priceLineVisible: false,
        });
        ema20Series.setData(ema20Data.map((d) => ({ time: d.time as any, value: d.value })));
      }

      if (indicators.bb) {
        const bbData = calculateBollingerBands(ohlcData, 20, 2);
        const bbUpper = chart.addLineSeries({
          color: "#6366f1",
          lineWidth: 1,
          lineStyle: LineStyle.Dotted,
          title: "BB Upper",
          priceLineVisible: false,
        });
        bbUpper.setData(bbData.map((d) => ({ time: d.time as any, value: d.upper })));

        const bbMiddle = chart.addLineSeries({
          color: "#6366f1",
          lineWidth: 1,
          title: "BB Middle",
          priceLineVisible: false,
        });
        bbMiddle.setData(bbData.map((d) => ({ time: d.time as any, value: d.middle })));

        const bbLower = chart.addLineSeries({
          color: "#6366f1",
          lineWidth: 1,
          lineStyle: LineStyle.Dotted,
          title: "BB Lower",
          priceLineVisible: false,
        });
        bbLower.setData(bbData.map((d) => ({ time: d.time as any, value: d.lower })));
      }
    }

    // Volume bars (not in percentage mode)
    if (priceScale !== "percentage") {
      const volumeSeries = chart.addHistogramSeries({
        priceFormat: { type: "volume" },
        priceScaleId: "",
      });
      volumeSeries.priceScale().applyOptions({
        scaleMargins: { top: 0.85, bottom: 0 },
      });
      volumeSeries.setData(
        chartData.map((d) => ({
          time: d.time as any,
          value: d.volume,
          color: d.close >= d.open ? "#22c55e15" : "#ef444415",
        }))
      );
    }

    chart.timeScale().fitContent();

    // RSI Chart
    if (showRSI && rsiContainerRef.current && priceScale !== "percentage") {
      const rsiChart = createChart(rsiContainerRef.current, {
        width: rsiContainerRef.current.clientWidth,
        height: 120,
        layout: {
          background: { type: ColorType.Solid, color: "transparent" },
          textColor: "#52525b",
          fontSize: 11,
          fontFamily: "Inter, system-ui, sans-serif",
        },
        grid: {
          vertLines: { color: "#27272a25" },
          horzLines: { color: "#27272a25" },
        },
        rightPriceScale: {
          borderColor: "#27272a50",
        },
        timeScale: {
          borderColor: "#27272a50",
          visible: false,
        },
        handleScroll: false,
        handleScale: false,
      });
      rsiChartRef.current = rsiChart;

      const ohlcData: OHLCData[] = chartData.map((d) => ({
        time: d.time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
        volume: d.volume,
      }));

      const rsiData = calculateRSI(ohlcData, 14);
      const rsiSeries = rsiChart.addLineSeries({
        color: "#a855f7",
        lineWidth: 2,
        priceLineVisible: false,
      });
      rsiSeries.setData(rsiData.map((d) => ({ time: d.time as any, value: d.value })));

      const rsi70 = rsiChart.addLineSeries({
        color: "#ef444440",
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        priceLineVisible: false,
      });
      rsi70.setData(rsiData.map((d) => ({ time: d.time as any, value: 70 })));

      const rsi30 = rsiChart.addLineSeries({
        color: "#22c55e40",
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        priceLineVisible: false,
      });
      rsi30.setData(rsiData.map((d) => ({ time: d.time as any, value: 30 })));

      rsiChart.timeScale().fitContent();

      chart.timeScale().subscribeVisibleLogicalRangeChange((timeRange) => {
        if (timeRange) {
          rsiChart.timeScale().setVisibleLogicalRange(timeRange);
        }
      });
    }

    // MACD Chart
    if (showMACD && macdContainerRef.current && priceScale !== "percentage") {
      const macdChart = createChart(macdContainerRef.current, {
        width: macdContainerRef.current.clientWidth,
        height: 120,
        layout: {
          background: { type: ColorType.Solid, color: "transparent" },
          textColor: "#52525b",
          fontSize: 11,
          fontFamily: "Inter, system-ui, sans-serif",
        },
        grid: {
          vertLines: { color: "#27272a25" },
          horzLines: { color: "#27272a25" },
        },
        rightPriceScale: {
          borderColor: "#27272a50",
        },
        timeScale: {
          borderColor: "#27272a50",
          visible: false,
        },
        handleScroll: false,
        handleScale: false,
      });
      macdChartRef.current = macdChart;

      const ohlcData: OHLCData[] = chartData.map((d) => ({
        time: d.time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
        volume: d.volume,
      }));

      const macdData = calculateMACD(ohlcData, 12, 26, 9);

      const macdLine = macdChart.addLineSeries({
        color: "#3b82f6",
        lineWidth: 2,
        priceLineVisible: false,
      });
      macdLine.setData(macdData.map((d) => ({ time: d.time as any, value: d.macd })));

      const signalLine = macdChart.addLineSeries({
        color: "#f59e0b",
        lineWidth: 2,
        priceLineVisible: false,
      });
      signalLine.setData(macdData.map((d) => ({ time: d.time as any, value: d.signal })));

      const histogram = macdChart.addHistogramSeries({
        color: "#22c55e",
        priceFormat: { type: "price", precision: 4, minMove: 0.0001 },
      });
      histogram.setData(
        macdData.map((d) => ({
          time: d.time as any,
          value: d.histogram,
          color: d.histogram >= 0 ? "#22c55e80" : "#ef444480",
        }))
      );

      macdChart.timeScale().fitContent();

      chart.timeScale().subscribeVisibleLogicalRangeChange((timeRange) => {
        if (timeRange) {
          macdChart.timeScale().setVisibleLogicalRange(timeRange);
        }
      });
    }

    // Double-click to reset zoom
    const handleDoubleClick = () => {
      chart.timeScale().fitContent();
      if (rsiChartRef.current) rsiChartRef.current.timeScale().fitContent();
      if (macdChartRef.current) macdChartRef.current.timeScale().fitContent();
    };
    container.addEventListener("dblclick", handleDoubleClick);

    // Resize
    const handleResize = () => {
      chart.applyOptions({ width: container.clientWidth });
      if (rsiChartRef.current && rsiContainerRef.current) {
        rsiChartRef.current.applyOptions({ width: rsiContainerRef.current.clientWidth });
      }
      if (macdChartRef.current && macdContainerRef.current) {
        macdChartRef.current.applyOptions({ width: macdContainerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("dblclick", handleDoubleClick);
      window.removeEventListener("resize", handleResize);
      chart.remove();
      chartRef.current = null;
      if (rsiChartRef.current) {
        rsiChartRef.current.remove();
        rsiChartRef.current = null;
      }
      if (macdChartRef.current) {
        macdChartRef.current.remove();
        macdChartRef.current = null;
      }
    };
  }, [chartData, compareData, compareTickers, chartType, activeRange, activeInterval, indicators, priceScale, chartHeight]);

  // Handle chart resize
  useEffect(() => {
    const resizer = resizerRef.current;
    if (!resizer) return;

    let startY: number;
    let startHeight: number;

    const handleMouseDown = (e: MouseEvent) => {
      startY = e.clientY;
      startHeight = chartHeight;
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientY - startY;
      const newHeight = Math.max(300, Math.min(1200, startHeight + delta));
      setChartHeight(newHeight);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    resizer.addEventListener("mousedown", handleMouseDown);
    return () => {
      resizer.removeEventListener("mousedown", handleMouseDown);
    };
  }, [chartHeight]);

  const download = useCallback(
    (format: "csv" | "json") => {
      if (chartData.length === 0) return;

      const formatTime = (t: string | number) =>
        typeof t === "number" ? new Date(t * 1000).toISOString() : t;

      let blob: Blob;
      let ext: string;

      if (format === "csv") {
        const header = "Date,Open,High,Low,Close,Volume";
        const rows = chartData.map(
          (d) =>
            `${formatTime(d.time)},${d.open},${d.high},${d.low},${d.close},${d.volume}`
        );
        blob = new Blob([header + "\n" + rows.join("\n")], {
          type: "text/csv",
        });
        ext = "csv";
      } else {
        const data = chartData.map((d) => ({
          date: formatTime(d.time),
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
          volume: d.volume,
        }));
        blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        ext = "json";
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${symbol}_${activeRange}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
      trackEvent("chart_data_download", {
        symbol,
        range: activeRange,
        format,
      });
    },
    [chartData, symbol, activeRange]
  );

  const latestPoint = chartData[chartData.length - 1];
  const activeLayoutIsSaved =
    savedLayout?.range === activeRange &&
    savedLayout.interval === activeInterval &&
    savedLayout.type === chartType &&
    savedLayout.priceScale === priceScale &&
    savedLayout.chartHeight === chartHeight &&
    JSON.stringify(savedLayout.indicators) === JSON.stringify(indicators) &&
    JSON.stringify(savedLayout.compareTickers) === JSON.stringify(compareTickers);

  const saveLayout = () => {
    const nextLayout: SavedChartLayout = {
      range: activeRange,
      interval: activeInterval,
      type: chartType,
      priceScale,
      indicators: { ...indicators },
      compareTickers: [...compareTickers],
      chartHeight,
      customStartDate,
      customEndDate,
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(chartLayoutKey(symbol), JSON.stringify(nextLayout));
    setSavedLayout(nextLayout);
    setLayoutNotice("Saved locally. Account sync is coming later.");
    trackEvent("chart_layout_save", {
      symbol,
      range: activeRange,
      interval: activeInterval,
      chart_type: chartType,
      indicators: serializeIndicators(indicators),
    });
  };

  const clearLayout = () => {
    window.localStorage.removeItem(chartLayoutKey(symbol));
    setSavedLayout(null);
    setLayoutNotice("Saved layout cleared.");
    trackEvent("chart_layout_clear", { symbol });
  };

  const toggleIndicator = (key: keyof IndicatorSettings) => {
    setIndicators((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    trackEvent("chart_indicator_toggle", {
      symbol,
      indicator: key,
      enabled: !indicators[key],
    });
  };

  const handleAddCompareTicker = () => {
    const ticker = compareInput.trim().toUpperCase();
    if (ticker && !compareTickers.includes(ticker) && compareTickers.length < 3) {
      setCompareTickers([...compareTickers, ticker]);
      setCompareInput("");
      trackEvent("chart_compare_add", { symbol, compare_ticker: ticker });
    }
  };

  const handleRemoveCompareTicker = (ticker: string) => {
    setCompareTickers(compareTickers.filter((t) => t !== ticker));
    trackEvent("chart_compare_remove", { symbol, compare_ticker: ticker });
  };

  const handleRangeChange = (range: ChartRange) => {
    setActiveRange(range);
    const newInterval = getDefaultIntervalForRange(range);
    setActiveInterval(newInterval);
    setCustomStartDate("");
    setCustomEndDate("");
    trackEvent("chart_range_change", { symbol, range });
  };

  const handleIntervalChange = (interval: ChartInterval) => {
    setActiveInterval(interval);
    trackEvent("chart_interval_change", { symbol, interval });
  };

  const handleApplyCustomDates = () => {
    if (customStartDate && customEndDate) {
      setShowDatePicker(false);
      trackEvent("chart_custom_dates", { symbol, start: customStartDate, end: customEndDate });
    }
  };

  const handleFullscreenToggle = () => {
    const elem = chartContainerRef.current?.parentElement;
    if (!elem) return;

    if (!isFullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const validIntervals = getValidIntervalsForRange(activeRange);

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/40 rounded-2xl overflow-hidden">
      <div className="flex flex-col gap-3 px-4 pt-4 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          {RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => handleRangeChange(range.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeRange === range.value
                  ? "bg-blue-500/15 text-blue-400"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
              }`}
            >
              {range.label}
            </button>
          ))}
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              customStartDate && customEndDate
                ? "bg-blue-500/15 text-blue-400"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
            }`}
          >
            Custom
          </button>
        </div>

        {showDatePicker && (
          <div className="flex flex-wrap items-center gap-2 p-3 bg-zinc-800/30 rounded-lg">
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="px-3 py-1.5 text-xs bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300"
            />
            <span className="text-xs text-zinc-500">to</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="px-3 py-1.5 text-xs bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300"
            />
            <button
              onClick={handleApplyCustomDates}
              disabled={!customStartDate || !customEndDate}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowIntervalMenu(!showIntervalMenu)}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold bg-zinc-800/60 text-zinc-400 hover:text-white"
            >
              {INTERVALS.find((i) => i.value === activeInterval)?.label || "Interval"}
            </button>
            {showIntervalMenu && (
              <div className="absolute left-0 top-full mt-2 w-32 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-10">
                <div className="p-1">
                  {INTERVALS.map((interval) => {
                    const isValid = validIntervals.includes(interval.value);
                    return (
                      <button
                        key={interval.value}
                        onClick={() => {
                          if (isValid) {
                            handleIntervalChange(interval.value);
                            setShowIntervalMenu(false);
                          }
                        }}
                        disabled={!isValid}
                        className={`w-full px-3 py-1.5 text-xs text-left rounded-md transition-colors ${
                          activeInterval === interval.value
                            ? "bg-blue-500/15 text-blue-400"
                            : isValid
                            ? "text-zinc-300 hover:bg-zinc-700/50"
                            : "text-zinc-600 cursor-not-allowed"
                        }`}
                      >
                        {interval.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-0.5 bg-zinc-800/30 rounded-lg p-0.5">
            <button
              onClick={() => setChartType("area")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                chartType === "area"
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType("candle")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                chartType === "candle"
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Candle
            </button>
          </div>

          <div className="flex items-center gap-0.5 bg-zinc-800/30 rounded-lg p-0.5">
            <button
              onClick={() => setPriceScale("normal")}
              disabled={compareTickers.length > 0}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                priceScale === "normal"
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-500 hover:text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => setPriceScale("logarithmic")}
              disabled={compareTickers.length > 0}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                priceScale === "logarithmic"
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-500 hover:text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              Log
            </button>
            <button
              onClick={() => setPriceScale("percentage")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                priceScale === "percentage"
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              %
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowIndicatorMenu(!showIndicatorMenu)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                Object.values(indicators).some((v) => v)
                  ? "bg-blue-500/15 text-blue-300"
                  : "bg-zinc-800/60 text-zinc-400 hover:text-white"
              }`}
            >
              Indicators
            </button>
            {showIndicatorMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-10">
                <div className="p-2 space-y-1">
                  <IndicatorToggle
                    label="SMA 20"
                    checked={indicators.sma20}
                    onChange={() => toggleIndicator("sma20")}
                  />
                  <IndicatorToggle
                    label="SMA 50"
                    checked={indicators.sma50}
                    onChange={() => toggleIndicator("sma50")}
                  />
                  <IndicatorToggle
                    label="SMA 200"
                    checked={indicators.sma200}
                    onChange={() => toggleIndicator("sma200")}
                  />
                  <IndicatorToggle
                    label="EMA 20"
                    checked={indicators.ema}
                    onChange={() => toggleIndicator("ema")}
                  />
                  <IndicatorToggle
                    label="Bollinger Bands"
                    checked={indicators.bb}
                    onChange={() => toggleIndicator("bb")}
                  />
                  <div className="border-t border-zinc-700 my-1"></div>
                  <IndicatorToggle
                    label="RSI (14)"
                    checked={indicators.rsi}
                    onChange={() => toggleIndicator("rsi")}
                  />
                  <IndicatorToggle
                    label="MACD (12,26,9)"
                    checked={indicators.macd}
                    onChange={() => toggleIndicator("macd")}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowCompareMenu(!showCompareMenu)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                compareTickers.length > 0
                  ? "bg-blue-500/15 text-blue-300"
                  : "bg-zinc-800/60 text-zinc-400 hover:text-white"
              }`}
            >
              Compare {compareTickers.length > 0 && `(${compareTickers.length})`}
            </button>
            {showCompareMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-10 p-3">
                <div className="space-y-2">
                  <div className="text-xs text-zinc-400 font-semibold">Add tickers (max 3)</div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={compareInput}
                      onChange={(e) => setCompareInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddCompareTicker();
                      }}
                      placeholder="e.g. SPY"
                      maxLength={10}
                      className="flex-1 px-2 py-1 text-xs bg-zinc-900 border border-zinc-700 rounded text-zinc-300"
                    />
                    <button
                      onClick={handleAddCompareTicker}
                      disabled={compareTickers.length >= 3}
                      className="px-3 py-1 text-xs font-semibold rounded bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>
                  {compareTickers.length > 0 && (
                    <div className="space-y-1 pt-2 border-t border-zinc-700">
                      {compareTickers.map((ticker) => (
                        <div
                          key={ticker}
                          className="flex items-center justify-between px-2 py-1 bg-zinc-900 rounded text-xs"
                        >
                          <span className="text-zinc-300 font-medium">{ticker}</span>
                          <button
                            onClick={() => handleRemoveCompareTicker(ticker)}
                            className="text-zinc-500 hover:text-red-400"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleFullscreenToggle}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold bg-zinc-800/60 text-zinc-400 hover:text-white"
          >
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>

          <button
            onClick={saveLayout}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeLayoutIsSaved
                ? "bg-blue-500/15 text-blue-300"
                : "bg-zinc-800/60 text-zinc-400 hover:text-white"
            }`}
          >
            {activeLayoutIsSaved ? "Layout Saved" : "Save Layout"}
          </button>
        </div>
      </div>

      {(savedLayout || layoutNotice) && (
        <div className="flex flex-col gap-2 border-t border-zinc-800/30 px-4 py-2.5 text-[11px] text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            {layoutNotice ||
              `Saved layout: ${savedLayout?.range.toUpperCase()} ${savedLayout?.interval.toUpperCase()} ${
                savedLayout?.type === "candle" ? "Candle" : "Line"
              }. Account sync is coming later.`}
          </span>
          {savedLayout && (
            <button
              onClick={clearLayout}
              className="self-start text-zinc-500 transition-colors hover:text-zinc-300 sm:self-auto"
            >
              Clear saved layout
            </button>
          )}
        </div>
      )}

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#09090b]/60 z-10">
            <div className="w-6 h-6 border-2 border-zinc-700 border-t-blue-400 rounded-full animate-spin" />
          </div>
        )}
        {!isLoading && (error || chartData.length === 0) && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#09090b]/80 z-10 px-6 text-center">
            <div>
              <div className="text-sm font-semibold text-white">
                {error ? "Chart data unavailable" : "No chart data found"}
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                {error ||
                  "The data source did not return usable OHLC data for this range."}
              </p>
              <button
                onClick={() => setRetryCount((count) => count + 1)}
                className="mt-4 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        <div ref={chartContainerRef} className="w-full" style={{ height: chartHeight - (indicators.rsi ? 140 : 0) - (indicators.macd ? 140 : 0) }} />
        {indicators.rsi && priceScale !== "percentage" && (
          <div className="border-t border-zinc-800/30">
            <div className="px-4 py-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
              RSI (14)
            </div>
            <div ref={rsiContainerRef} className="w-full" style={{ height: 120 }} />
          </div>
        )}
        {indicators.macd && priceScale !== "percentage" && (
          <div className="border-t border-zinc-800/30">
            <div className="px-4 py-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
              MACD (12, 26, 9)
            </div>
            <div ref={macdContainerRef} className="w-full" style={{ height: 120 }} />
          </div>
        )}
        <div
          ref={resizerRef}
          className="h-2 cursor-ns-resize bg-zinc-800/20 hover:bg-zinc-700/40 transition-colors"
        />
      </div>

      {chartData.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-2 border-t border-zinc-800/30 px-4 py-3 text-xs sm:grid-cols-5">
            <ChartStat label="Open" value={formatCurrency(latestPoint.open)} />
            <ChartStat label="High" value={formatCurrency(latestPoint.high)} />
            <ChartStat label="Low" value={formatCurrency(latestPoint.low)} />
            <ChartStat label="Close" value={formatCurrency(latestPoint.close)} />
            <ChartStat label="Volume" value={formatNumber(latestPoint.volume)} />
          </div>
          <div className="flex items-center gap-3 px-4 py-2.5 border-t border-zinc-800/30">
            <span className="text-[11px] text-zinc-600">Export</span>
            <button
              onClick={() => download("csv")}
              className="text-[11px] text-zinc-500 hover:text-blue-400 transition-colors"
            >
              CSV
            </button>
            <span className="text-zinc-800">·</span>
            <button
              onClick={() => download("json")}
              className="text-[11px] text-zinc-500 hover:text-blue-400 transition-colors"
            >
              JSON
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function ChartStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
        {label}
      </div>
      <div className="mt-1 font-medium tabular-nums text-zinc-300">{value}</div>
    </div>
  );
}

function IndicatorToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-zinc-700/50 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-zinc-600 bg-zinc-700 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
      />
      <span className="text-sm text-zinc-300">{label}</span>
    </label>
  );
}
