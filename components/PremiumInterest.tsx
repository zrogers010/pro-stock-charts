"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type PremiumInterestId =
  | "saved_layout_sync"
  | "cloud_watchlists"
  | "price_alerts"
  | "multi_chart_dashboards";

type PremiumOption = {
  id: PremiumInterestId;
  title: string;
  description: string;
};

const storageKey = "psc_premium_interest";

const premiumOptions: PremiumOption[] = [
  {
    id: "saved_layout_sync",
    title: "Cloud saved chart layouts",
    description:
      "Sync preferred ranges, chart types, and layouts across devices.",
  },
  {
    id: "cloud_watchlists",
    title: "Cloud watchlists",
    description:
      "Keep watchlists available across browsers without rebuilding them.",
  },
  {
    id: "price_alerts",
    title: "Price and market alerts",
    description:
      "Get notified when watched symbols reach levels you care about.",
  },
  {
    id: "multi_chart_dashboards",
    title: "Multi-chart dashboards",
    description:
      "Save dashboards for ETFs, indices, crypto, sectors, and active trades.",
  },
];

function readInterest() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
    return Array.isArray(parsed)
      ? parsed.filter((item): item is PremiumInterestId =>
          premiumOptions.some((option) => option.id === item)
        )
      : [];
  } catch {
    return [];
  }
}

export default function PremiumInterest() {
  const [selected, setSelected] = useState<PremiumInterestId[]>([]);

  useEffect(() => {
    setSelected(readInterest());
  }, []);

  const toggle = (id: PremiumInterestId) => {
    const isSelected = selected.includes(id);
    const nextSelected = isSelected
      ? selected.filter((item) => item !== id)
      : [...selected, id];
    setSelected(nextSelected);
    window.localStorage.setItem(storageKey, JSON.stringify(nextSelected));
    trackEvent("premium_interest_toggle", {
      feature: id,
      interested: !isSelected,
    });
  };

  return (
    <section className="rounded-3xl border border-zinc-800/50 bg-zinc-900/40 p-6 sm:p-8">
      <div className="mb-6 max-w-3xl">
        <h2 className="mb-3 text-2xl font-semibold tracking-tight text-white">
          What would be worth upgrading for?
        </h2>
        <p className="text-sm leading-relaxed text-zinc-500">
          Pick the workflows you would want first. Choices are saved only in
          this browser and, if analytics are enabled, counted as anonymous
          product-interest events.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {premiumOptions.map((option) => {
          const isSelected = selected.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => toggle(option.id)}
              className={`rounded-2xl border p-5 text-left transition-all ${
                isSelected
                  ? "border-blue-400/50 bg-blue-500/10"
                  : "border-zinc-800/50 bg-zinc-950/30 hover:border-zinc-700/70 hover:bg-zinc-800/40"
              }`}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="font-semibold text-white">{option.title}</div>
                <span
                  className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                    isSelected
                      ? "bg-blue-400/15 text-blue-300"
                      : "bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {isSelected ? "Interested" : "Select"}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-zinc-500">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-xs leading-relaxed text-zinc-600">
        No email, account, payment, or user database is required for this
        signal. It is a lightweight way to learn which premium workflows are
        worth building next.
      </p>
    </section>
  );
}
