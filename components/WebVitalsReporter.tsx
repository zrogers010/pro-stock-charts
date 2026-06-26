"use client";

import { useReportWebVitals } from "next/web-vitals";
import { trackWebVital } from "@/lib/analytics";

export default function WebVitalsReporter() {
  useReportWebVitals(trackWebVital);
  return null;
}
