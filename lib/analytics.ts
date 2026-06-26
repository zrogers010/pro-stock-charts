import type { NextWebVitalsMetric } from "next/app";

type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      params?: AnalyticsParams
    ) => void;
  }
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, params);
}

function normalizeMetricValue(metric: NextWebVitalsMetric) {
  return Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value);
}

function getMetricRating(metric: NextWebVitalsMetric) {
  const value = metric.name === "CLS" ? metric.value : normalizeMetricValue(metric);
  const thresholds: Record<string, [number, number]> = {
    CLS: [0.1, 0.25],
    FCP: [1800, 3000],
    FID: [100, 300],
    INP: [200, 500],
    LCP: [2500, 4000],
    TTFB: [800, 1800],
  };
  const [good, poor] = thresholds[metric.name] ?? [0, 0];
  if (value <= good) return "good";
  if (value <= poor) return "needs-improvement";
  return "poor";
}

export function trackWebVital(metric: NextWebVitalsMetric) {
  const metricWithDelta = metric as NextWebVitalsMetric & { delta?: number };
  const delta =
    typeof metricWithDelta.delta === "number" ? metricWithDelta.delta : metric.value;

  trackEvent(metric.name, {
    event_category: "Web Vitals",
    event_label: metric.id,
    value: normalizeMetricValue(metric),
    metric_rating: getMetricRating(metric),
    metric_delta: Math.round(metric.name === "CLS" ? delta * 1000 : delta),
    non_interaction: true,
  });
}
