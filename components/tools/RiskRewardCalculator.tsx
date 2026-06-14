"use client";

import { useMemo, useState } from "react";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
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

export default function RiskRewardCalculator() {
  const [entryPrice, setEntryPrice] = useState("100");
  const [stopPrice, setStopPrice] = useState("95");
  const [targetPrice, setTargetPrice] = useState("115");
  const [units, setUnits] = useState("100");

  const result = useMemo(() => {
    const entry = parseInput(entryPrice);
    const stop = parseInput(stopPrice);
    const target = parseInput(targetPrice);
    const quantity = parseInput(units);
    const riskPerUnit = Math.abs(entry - stop);
    const rewardPerUnit = Math.abs(target - entry);
    const ratio = riskPerUnit > 0 ? rewardPerUnit / riskPerUnit : 0;
    const potentialLoss = riskPerUnit * quantity;
    const potentialProfit = rewardPerUnit * quantity;
    const breakEvenWinRate = ratio > 0 ? 100 / (1 + ratio) : 0;

    return {
      breakEvenWinRate,
      entry,
      potentialLoss,
      potentialProfit,
      quantity,
      ratio,
      rewardPerUnit,
      riskPerUnit,
      stop,
      target,
    };
  }, [entryPrice, stopPrice, targetPrice, units]);

  const hasValidInputs =
    result.entry > 0 &&
    result.stop > 0 &&
    result.target > 0 &&
    result.quantity > 0 &&
    result.riskPerUnit > 0 &&
    result.rewardPerUnit > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5 sm:p-6">
        <h2 className="mb-5 text-xl font-semibold tracking-tight text-white">
          Scenario Inputs
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <CalculatorInput
            label="Entry price"
            value={entryPrice}
            onChange={setEntryPrice}
          />
          <CalculatorInput
            label="Stop price"
            value={stopPrice}
            onChange={setStopPrice}
          />
          <CalculatorInput
            label="Target price"
            value={targetPrice}
            onChange={setTargetPrice}
          />
          <CalculatorInput
            label="Shares or units"
            value={units}
            onChange={setUnits}
          />
        </div>

        <div className="mt-5 rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-4 text-sm leading-relaxed text-zinc-500">
          The calculator uses absolute price distance, so it can estimate long
          or short scenarios. It does not account for slippage, commissions,
          taxes, borrow fees, liquidity, partial exits, or changing stops.
        </div>
      </section>

      <aside className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5 sm:p-6">
        <h2 className="mb-5 text-xl font-semibold tracking-tight text-white">
          Scenario Result
        </h2>
        <div className="space-y-4">
          <ResultRow
            label="Risk/reward ratio"
            value={hasValidInputs ? `1:${formatNumber(result.ratio)}` : "1:0"}
            strong
          />
          <ResultRow
            label="Risk per share/unit"
            value={formatCurrency(result.riskPerUnit)}
          />
          <ResultRow
            label="Reward per share/unit"
            value={formatCurrency(result.rewardPerUnit)}
          />
          <ResultRow
            label="Potential loss"
            value={formatCurrency(result.potentialLoss)}
          />
          <ResultRow
            label="Potential profit"
            value={formatCurrency(result.potentialProfit)}
          />
          <ResultRow
            label="Break-even win rate"
            value={`${formatNumber(result.breakEvenWinRate)}%`}
          />
        </div>

        {!hasValidInputs && (
          <p className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm leading-relaxed text-amber-100">
            Enter positive prices, a target different from entry, and a stop
            different from entry.
          </p>
        )}
      </aside>
    </div>
  );
}

function CalculatorInput({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </span>
      <input
        inputMode="decimal"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-blue-500"
      />
    </label>
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
