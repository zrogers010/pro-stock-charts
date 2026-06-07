# ProStockCharts Project Audit

Audit date: 2026-06-06 PDT
Repo: `zrogers010/pro-stock-charts`
Local checkout: `/Users/phxclaw/.openclaw/workspace/projects/pro-stock-charts`

## Executive Summary

ProStockCharts is already a working Next.js market charting app, not a blank prototype. It has a polished dark UI, ticker search, dynamic quote pages, interactive charts, market hub pages, a small set of educational pages, sitemap/robots, metadata, JSON-LD, Google Analytics, Docker support, and a Yahoo Finance data layer.

The best next move is not a rewrite. The first implementation milestone should be to turn the existing dynamic stock page into one excellent, trustworthy public stock detail page template. That page is already the core product surface, but it needs stronger data-source disclosure, quote timestamps, finance-safe copy, better chart/data error states, mobile polish, route/canonical decisions, and a few quality fixes before scaling SEO pages.

## 1. Current Repo State

### Stack

- Framework: Next.js 14 App Router
- Language: TypeScript with `strict: true`
- UI: React 18, Tailwind CSS 3
- Charting: `lightweight-charts`
- Market data: `yahoo-finance2`
- Package manager: npm, with `package-lock.json`
- Runtime/deploy shape: Next standalone output plus Dockerfile
- Analytics: hardcoded Google Analytics tag in `app/layout.tsx`

### Commands

- Install: `npm ci`
- Dev: `npm run dev`
- Build: `npm run build`
- Start: `npm start`

Verified:

- `npm ci` succeeds.
- `npm run build` succeeds.
- Production build generated 48 app routes.
- `npm audit --omit=dev` reports Next/PostCSS advisories.

### Current routes and features

Main public routes:

- `/`
- `/stock/[symbol]`
- `/stocks`
- `/stocks/[assetSlug]`
- `/etfs`
- `/etfs/[assetSlug]`
- `/crypto`
- `/crypto/[assetSlug]`
- `/commodities`
- `/commodities/[assetSlug]`
- `/futures`
- `/futures/[assetSlug]`
- `/indices`
- `/indices/[assetSlug]`
- `/learn/[slug]`
- `/sitemap.xml`
- `/robots.txt`
- `/manifest.webmanifest`

API routes:

- `/api/search?q=...`
- `/api/quote/[symbol]`
- `/api/chart/[symbol]?range=...`
- `/api/news/[symbol]`

Current user-facing features:

- Homepage with search and popular market links.
- Sticky header with search.
- Search suggestions from Yahoo Finance.
- Dynamic stock/security page with SSR quote/summary metadata.
- Quote header with price/change/exchange.
- Line/candlestick chart with ranges: 1D, 5D, 1M, 3M, 6M, 1Y, 5Y.
- Volume histogram.
- CSV/JSON chart export.
- Local-storage watchlist and recently viewed symbols.
- Key statistics, financial metrics, company profile, latest news, related charts.
- Curated market hubs for stocks, ETFs, crypto, commodities, futures, and indices.
- Small educational article set.

## 2. Product Quality Assessment

### What is strong

- The app already feels like a real product surface.
- The stock page has useful free value within seconds: quote, price change, key stats, chart, profile, related tickers.
- Search is fast and supports keyboard navigation.
- The chart interaction is simple and understandable.
- Local watchlist/recents create a light retention loop without requiring accounts.
- The visual direction is clean and professional enough to build from.

### What is low-quality or broken

- Finance trust copy is insufficient. There is no visible "not investment advice" disclaimer, data-source disclosure, quote delay note, or verification warning on the public pages.
- The README says "Real-time quotes", but the site should avoid that claim unless the source/licensing is explicit. The rendered quote includes source metadata such as `quoteSourceName` and `exchangeDataDelayedBy`, but the UI does not explain it.
- The 1D chart data can include many zero-volume post-market points. In a local probe for AAPL, `/api/chart/AAPL?range=1d` returned 193 points and the last points had `volume: 0`, so the chart can look like a flat after-hours tail rather than a clean regular-session view.
- The chart SSR HTML is an empty fixed-height container until client hydration and API data load. That is normal for an interactive chart, but it increases the burden on the surrounding SSR content to carry SEO and first-use value.
- The chart has no visible empty/error state if `/api/chart` fails or returns no data.
- The stock page title says "Stock Chart" even for crypto, indices, futures, and ETFs routed through `/stock/[symbol]`.
- The route strategy is split: dynamic pages live at `/stock/AAPL`, while desired SEO strategy likely wants `/stocks/AAPL` and `/etfs/SPY`. The current curated `/stocks/aapl-chart` pages are mostly doorway pages that link to `/stock/AAPL`.
- There is no privacy page, terms page, data/disclaimer page, or footer.
- Google Analytics is hardcoded and always loaded, with no env switch or privacy explanation.
- Header nav hides most market categories on desktop and all nav links on smaller screens except search/brand.
- There are no tests.
- There is no CI workflow.

## 3. SEO Assessment

### Existing SEO foundations

- Root metadata in `app/layout.tsx`.
- Per-stock dynamic titles/descriptions/canonical URLs.
- Open Graph and Twitter metadata.
- Sitemap generated by `app/sitemap.ts`.
- Robots generated by `app/robots.ts`.
- JSON-LD on homepage, stock pages, curated asset pages, and learn articles.
- Static generation for hub pages, curated pages, and learn pages.
- Internal links from homepage to market hubs, popular assets, and learn articles.
- Internal related-chart links on dynamic symbol pages.

### Missing or risky SEO foundations

- Route taxonomy needs a decision before scaling. `/stock/[symbol]` is functional, but `/stocks/[symbol]` and `/etfs/[symbol]` are more aligned with search intent and the stated strategy.
- Curated asset pages are thin because they do not embed real quote/chart/table data; they mostly describe an asset and link to the dynamic chart page.
- Sitemap includes only the small curated symbol set, which is good for caution, but it should not be expanded until the template is stronger.
- No indicator pages, comparison pages, market mover pages, or calculator pages yet.
- No explicit crawlable data timestamp/source copy on stock pages.
- No finance/compliance footer or legal pages, which hurts trust.
- JSON-LD `Dataset` is present, but the page does not expose enough source/update details to fully support that trust claim.
- The global `keywords` meta tag is generic and duplicated.
- No canonical/redirect strategy for lowercase symbols beyond `/stock/[symbol]` uppercase redirect.
- No Open Graph image assets beyond generic metadata.

## 4. Data and Charting Assessment

### Data source

The app uses `yahoo-finance2` via `lib/yahoo.ts`. No API key is required. Server-side calls fetch:

- quote data
- quote summary modules
- chart OHLCV data
- search results
- news results

### Charting

The app uses `lightweight-charts` for client-side rendering.

Implemented:

- Area and candlestick modes.
- Time ranges from 1D to 5Y.
- Volume histogram.
- CSV/JSON export.
- URL state for `range` and `type`.

Gaps:

- No moving averages, RSI, MACD, Bollinger Bands, or indicator architecture.
- No OHLC tooltip/readout.
- No visible "last updated" or source timestamp near chart.
- No chart-level retry/empty state.
- Intraday filtering needs cleanup.
- No caching/rate-limit strategy around Yahoo Finance calls beyond page `revalidate = 300` for the dynamic stock page.

## 5. Monetization Opportunities

Do not add payments yet.

High-fit future premium angles after free value is stronger:

- Cloud watchlists.
- Saved chart layouts.
- Multi-chart dashboards.
- Alerts.
- Advanced indicators.
- Exports and deeper history.
- Premium screeners.
- AI-assisted chart notes with careful educational framing.
- Email/personalized market briefs.
- Ad-free experience if ads are introduced later.

Near-term conversion should stay soft:

- Email waitlist.
- "Save chart layout" teaser.
- "Alerts coming soon" teaser.
- Lightweight account/signup prompt only after watchlist/layout value is obvious.

## 6. Technical Risks

- Dependency vulnerabilities from current Next/PostCSS tree. `npm audit --omit=dev` reports high/moderate advisories and suggests a breaking Next upgrade.
- Data provider reliability/licensing risk. Yahoo Finance is convenient, but the site needs public data-source disclosure and a future provider strategy.
- Possible request volume risk if SEO traffic grows because every dynamic stock page can call Yahoo quote/summary server-side plus chart/news APIs client-side.
- No test coverage for data normalization, chart range handling, formatting, routing, or metadata.
- No CI quality gate.
- Hardcoded production GA ID in source.
- `images.remotePatterns` allows any HTTPS hostname, increasing image optimizer exposure.
- Dockerfile may not copy `public/` if public assets are added later.
- `next start` warns that `output: "standalone"` should be served via `node .next/standalone/server.js`.

## 7. Quick Wins

1. Add a visible footer/disclaimer on all public pages:
   - "Market data provided for research and educational use."
   - "Not investment advice."
   - "Quotes may be delayed depending on source/exchange."
   - "Verify prices with your broker or data provider."
2. Add data source and timestamp to stock pages using quote fields such as `regularMarketTime`, `quoteSourceName`, and `exchangeDataDelayedBy`.
3. Fix 1D chart filtering to avoid post-market zero-volume tails for equities, or clearly separate regular/pre/post-market views.
4. Add chart empty/error state and retry.
5. Decide route strategy:
   - Short-term: keep `/stock/[symbol]`, add canonical plan.
   - Better long-term: move toward `/stocks/[symbol]`, `/etfs/[symbol]`, etc., with redirects.
6. Add basic technical SEO pages: `/disclaimer`, `/privacy`, `/terms` or at least `/data-disclaimer`.
7. Move GA ID behind an env var.
8. Add a small CI workflow running `npm ci` and `npm run build`.
9. Add focused tests for range/date normalization and formatting once chart filtering is touched.
10. Update README claims from "real-time" to "market data from Yahoo Finance; quotes may be delayed."

## 8. Recommended 30-Day Roadmap

See `ROADMAP.md` for sequencing. In short:

- Week 1: polish the dynamic stock detail page and trust layer.
- Week 2: lock technical SEO foundations and route/canonical strategy.
- Week 3: create high-quality templates for indicators/comparison/market movers without mass generation.
- Week 4: add soft conversion hooks and measurement.

## 9. First Implementation Milestone

Recommended milestone: Build one excellent public stock detail page template from the existing `/stock/[symbol]` page.

Scope:

- Add source/timestamp/delay disclosure to the quote header.
- Add global footer/disclaimer and a dedicated data disclaimer page.
- Improve chart loading, empty, error, and retry states.
- Fix or clarify 1D regular-session vs post-market behavior.
- Add a compact OHLC/latest bar near the chart.
- Add safer finance copy around analyst recommendation fields.
- Keep the existing stack and route for now, but document the route migration decision.
- Add a minimal CI/build quality gate.

Approval needed before implementation.
