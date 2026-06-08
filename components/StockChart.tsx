"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createChart, ColorType, IChartApi } from "lightweight-charts";
import { trackEvent } from "@/lib/analytics";
import { formatCurrency, formatNumber } from "@/lib/format";

interface ChartDataPoint {
  time: string | number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const timeRanges = [
  { label: "1D", value: "1d" },
  { label: "5D", value: "5d" },
  { label: "1M", value: "1mo" },
  { label: "3M", value: "3mo" },
  { label: "6M", value: "6mo" },
  { label: "1Y", value: "1y" },
  { label: "5Y", value: "5y" },
];

type ChartType = "area" | "candle";
type SavedChartLayout = {
  range: string;
  type: ChartType;
  savedAt: string;
};

const validRangeValues = new Set(timeRanges.map((range) => range.value));

function chartLayoutKey(symbol: string) {
  return `psc_chart_layout_${symbol.toUpperCase()}`;
}

function readSavedLayout(symbol: string): SavedChartLayout | null {
  try {
    const stored = window.localStorage.getItem(chartLayoutKey(symbol));
    if (!stored) return null;
    const parsed = JSON.parse(stored) as SavedChartLayout;
    if (!validRangeValues.has(parsed.range)) return null;
    if (parsed.type !== "area" && parsed.type !== "candle") return null;
    return parsed;
  } catch {
    return null;
  }
}

export default function StockChart({ symbol }: { symbol: string }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [activeRange, setActiveRange] = useState("1y");
  const [chartType, setChartType] = useState<ChartType>("area");
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasHydratedUrlState, setHasHydratedUrlState] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [savedLayout, setSavedLayout] = useState<SavedChartLayout | null>(null);
  const [layoutNotice, setLayoutNotice] = useState<string | null>(null);

  useEffect(() => {
    setHasHydratedUrlState(false);
    setLayoutNotice(null);

    const params = new URLSearchParams(window.location.search);
    const range = params.get("range");
    const type = params.get("type");
    const saved = readSavedLayout(symbol);
    const hasUrlLayout =
      Boolean(range && validRangeValues.has(range)) ||
      type === "area" ||
      type === "candle";

    if (range && validRangeValues.has(range)) {
      setActiveRange(range);
    } else if (!hasUrlLayout && saved) {
      setActiveRange(saved.range);
    } else {
      setActiveRange("1y");
    }

    if (type === "area" || type === "candle") {
      setChartType(type);
    } else if (!hasUrlLayout && saved) {
      setChartType(saved.type);
    } else {
      setChartType("area");
    }

    setSavedLayout(saved);
    setHasHydratedUrlState(true);
  }, [symbol]);

  useEffect(() => {
    if (!hasHydratedUrlState) return;
    const params = new URLSearchParams(window.location.search);
    params.set("range", activeRange);
    params.set("type", chartType);
    const nextUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", nextUrl);
  }, [activeRange, chartType, hasHydratedUrlState]);

  // Fetch data
  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/chart/${symbol}?range=${activeRange}`);
        if (!res.ok) throw new Error("Chart request failed");
        const json = await res.json();
        if (!cancelled) setChartData(json.data || []);
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
  }, [symbol, activeRange, retryCount]);

  // Render chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    if (chartData.length === 0) {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
      return;
    }

    // Remove existing chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const container = chartContainerRef.current;
    const chart = createChart(container, {
      width: container.clientWidth,
      height: 480,
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
      },
      timeScale: {
        borderColor: "#27272a50",
        timeVisible: activeRange === "1d" || activeRange === "5d",
        rightOffset: 5,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      handleScroll: {
        mouseWheel: false,
        pressedMouseMove: true,
        horzTouchDrag: false,
        vertTouchDrag: false,
      },
      handleScale: {
        mouseWheel: true,
        pinch: true,
        axisPressedMouseMove: true,
      },
    });

    chartRef.current = chart;

    // Determine direction for color
    const isPositive =
      chartData.length > 1 &&
      chartData[chartData.length - 1].close >= chartData[0].open;
    const lineColor = isPositive ? "#22c55e" : "#ef4444";

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

    // Volume bars
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

    chart.timeScale().fitContent();

    // Double-click to reset zoom
    const handleDoubleClick = () => {
      chart.timeScale().fitContent();
    };
    container.addEventListener("dblclick", handleDoubleClick);

    // Resize
    const handleResize = () => {
      chart.applyOptions({ width: container.clientWidth });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("dblclick", handleDoubleClick);
      window.removeEventListener("resize", handleResize);
      chart.remove();
      chartRef.current = null;
    };
  }, [chartData, chartType, activeRange]);

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
    savedLayout?.range === activeRange && savedLayout.type === chartType;

  const saveLayout = () => {
    const nextLayout: SavedChartLayout = {
      range: activeRange,
      type: chartType,
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(chartLayoutKey(symbol), JSON.stringify(nextLayout));
    setSavedLayout(nextLayout);
    setLayoutNotice("Saved locally. Account sync is coming later.");
    trackEvent("chart_layout_save", {
      symbol,
      range: activeRange,
      chart_type: chartType,
    });
  };

  const clearLayout = () => {
    window.localStorage.removeItem(chartLayoutKey(symbol));
    setSavedLayout(null);
    setLayoutNotice("Saved layout cleared.");
    trackEvent("chart_layout_clear", { symbol });
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/40 rounded-2xl overflow-hidden">
      <div className="flex flex-col gap-3 px-4 pt-4 pb-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-0.5">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => {
                setActiveRange(range.value);
                trackEvent("chart_range_change", {
                  symbol,
                  range: range.value,
                });
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeRange === range.value
                  ? "bg-blue-500/15 text-blue-400"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-0.5 bg-zinc-800/30 rounded-lg p-0.5">
            <button
              onClick={() => {
                setChartType("area");
                trackEvent("chart_type_change", {
                  symbol,
                  chart_type: "area",
                });
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                chartType === "area"
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Line
            </button>
            <button
              onClick={() => {
                setChartType("candle");
                trackEvent("chart_type_change", {
                  symbol,
                  chart_type: "candle",
                });
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                chartType === "candle"
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Candle
            </button>
          </div>
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
              `Saved layout: ${savedLayout?.range.toUpperCase()} ${
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
        <div ref={chartContainerRef} className="w-full" style={{ height: 480 }} />
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
