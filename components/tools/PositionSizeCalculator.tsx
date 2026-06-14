"use client";

import { useMemo, useState } from "react";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 4,
});

function parseInput(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number) {
  if (!Number.isFinite(value)) return "$0.00";
  return currencyFormatter.format(value);
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "0";
  return numberFormatter.format(value);
}

export default function PositionSizeCalculator() {
  const [accountSize, setAccountSize] = useState("10000");
  const [riskPercent, setRiskPercent] = useState("1");
  const [entryPrice, setEntryPrice] = useState("100");
  const [stopPrice, setStopPrice] = useState("95");

  const result = useMemo(() => {
    const account = parseInput(accountSize);
    const risk = parseInput(riskPercent);
    const entry = parseInput(entryPrice);
    const stop = parseInput(stopPrice);
    const riskBudget = account * (risk / 100);
    const riskPerShare = Math.abs(entry - stop);
    const units = riskPerShare > 0 ? Math.floor(riskBudget / riskPerShare) : 0;
    const positionValue = units * entry;
    const portfolioPercent = account > 0 ? (positionValue / account) * 100 : 0;
    const stopLossValue = units * riskPerShare;

    return {
      account,
      entry,
      portfolioPercent,
      positionValue,
      riskBudget,
      riskPerShare,
      stopLossValue,
      units,
    };
  }, [accountSize, entryPrice, riskPercent, stopPrice]);

  const hasValidInputs =
    result.account > 0 &&
    result.entry > 0 &&
    result.riskBudget > 0 &&
    result.riskPerShare > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5 sm:p-6">
        <h2 className="mb-5 text-xl font-semibold tracking-tight text-white">
          Trade Inputs
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-300">
              Account size
            </span>
            <input
              inputMode="decimal"
              type="text"
              value={accountSize}
              onChange={(event) => setAccountSize(event.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-blue-500"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-300">
              Risk per trade (%)
            </span>
            <input
              inputMode="decimal"
              type="text"
              value={riskPercent}
              onChange={(event) => setRiskPercent(event.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-blue-500"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-300">
              Entry price
            </span>
            <input
              inputMode="decimal"
              type="text"
              value={entryPrice}
              onChange={(event) => setEntryPrice(event.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-blue-500"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-300">
              Stop price
            </span>
            <input
              inputMode="decimal"
              type="text"
              value={stopPrice}
              onChange={(event) => setStopPrice(event.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-blue-500"
            />
          </label>
        </div>

        <div className="mt-5 rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-4 text-sm leading-relaxed text-zinc-500">
          The calculator uses the absolute distance between entry and stop, so
          it works for long or short planning. It does not account for slippage,
          commissions, taxes, borrow fees, liquidity, or trading restrictions.
        </div>
      </section>

      <aside className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5 sm:p-6">
        <h2 className="mb-5 text-xl font-semibold tracking-tight text-white">
          Estimated Position
        </h2>
        <div className="space-y-4">
          <ResultRow
            label="Risk budget"
            value={formatCurrency(result.riskBudget)}
          />
          <ResultRow
            label="Risk per share/unit"
            value={formatCurrency(result.riskPerShare)}
          />
          <ResultRow
            label="Shares or units"
            value={hasValidInputs ? formatNumber(result.units) : "0"}
            strong
          />
          <ResultRow
            label="Position value"
            value={formatCurrency(result.positionValue)}
          />
          <ResultRow
            label="Estimated stop loss"
            value={formatCurrency(result.stopLossValue)}
          />
          <ResultRow
            label="Portfolio allocation"
            value={`${formatNumber(result.portfolioPercent)}%`}
          />
        </div>

        {!hasValidInputs && (
          <p className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm leading-relaxed text-amber-100">
            Enter a positive account size, risk amount, entry price, and a stop
            price different from entry.
          </p>
        )}
      </aside>
    </div>
  );
}

function ResultRow({
  label,
  strong = false,
  value,
}: {
  label: string;
  strong?: boolean;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-zinc-800/60 pb-3 last:border-0 last:pb-0">
      <div className="text-sm text-zinc-500">{label}</div>
      <div
        className={
          strong
            ? "text-right text-2xl font-semibold tabular-nums text-white"
            : "text-right text-sm font-medium tabular-nums text-zinc-200"
        }
      >
        {value}
      </div>
    </div>
  );
}
