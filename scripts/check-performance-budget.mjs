#!/usr/bin/env node
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const manifestPath = path.join(rootDir, ".next", "app-build-manifest.json");

const budgets = [
  { route: "/page", maxKb: 380 },
  { route: "/indicators/page", maxKb: 380 },
  { route: "/indicators/[slug]/page", maxKb: 380 },
  { route: "/stock/[symbol]/page", maxKb: 450 },
  { route: "/tools/page", maxKb: 380 },
  { route: "/tools/position-size-calculator/page", maxKb: 390 },
  { route: "/tools/risk-reward-calculator/page", maxKb: 390 },
];

if (!existsSync(manifestPath)) {
  console.error("Performance budget check requires a completed `next build`.");
  console.error("Missing .next/app-build-manifest.json");
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const pages = manifest.pages ?? {};
let failed = false;

for (const budget of budgets) {
  const files = pages[budget.route];
  if (!files) {
    console.error(`Missing build manifest route: ${budget.route}`);
    failed = true;
    continue;
  }

  const totalBytes = files.reduce((sum, file) => {
    const filePath = path.join(rootDir, ".next", file);
    return existsSync(filePath) ? sum + statSync(filePath).size : sum;
  }, 0);
  const totalKb = totalBytes / 1024;
  const label = `${totalKb.toFixed(1)} KiB / ${budget.maxKb} KiB`;

  if (totalKb > budget.maxKb) {
    console.error(`FAIL ${budget.route}: ${label}`);
    failed = true;
  } else {
    console.log(`PASS ${budget.route}: ${label}`);
  }
}

if (failed) process.exit(1);
