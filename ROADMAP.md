# ProStockCharts Roadmap

Audit date: 2026-06-06 PDT

## Current Recommendation

The first implementation milestone should be:

**Build one excellent public stock detail page template.**

Use the existing `/stock/[symbol]` route and `StockView` as the base. Do not rewrite the app. Do not add payments. Do not mass-generate pages.

## 30-Day Roadmap

### Week 1: Stock Page Trust and Product Polish

Goal: Make the core ticker page trustworthy, useful, and ready to become the foundation for SEO growth.

Tasks:

- Add visible data source, quote timestamp, and delay disclosure to the stock header.
- Add global footer with "not investment advice" and data disclaimer language.
- Add a `/data-disclaimer` page.
- Fix or clearly handle 1D chart regular-session vs post-market data.
- Add chart empty/error/retry states.
- Add chart-adjacent OHLC/latest data summary.
- Improve mobile behavior for chart controls and header search.
- Replace overly strong "live"/"real-time" claims in README and UI copy.
- Move GA ID to env config or document it clearly.
- Add a minimal CI workflow that runs install/build.

Deliverable:

- A polished `/stock/AAPL` style page that can be reused for other symbols.

### Week 2: Technical SEO Foundation

Goal: Make the site crawlable, coherent, and safe to scale.

Tasks:

- Decide route strategy:
  - Keep `/stock/[symbol]` temporarily, or
  - Add `/stocks/[symbol]` and redirects/canonicals.
- Document canonical URL rules.
- Improve sitemap priorities and avoid volatile `lastModified` values for every build where inappropriate.
- Add privacy/terms pages if analytics and public business use continue.
- Add Open Graph image strategy.
- Strengthen JSON-LD to match visible page content.
- Add internal links from learn pages to relevant ticker/chart pages.
- Audit title/meta templates for non-stock assets.

Deliverable:

- `SEO_FOUNDATION.md` plus implemented SEO basics.

### Week 3: High-Quality Page Templates

Goal: Add a small number of high-value templates without scaling thin content.

Tasks:

- Create one indicator explainer page template.
- Create one comparison page template for a curated pair such as AAPL vs MSFT.
- Create one tool page such as a risk/reward calculator or position-size calculator.
- Upgrade market hub pages from static cards toward useful tables if data calls can be cached safely.
- Add template quality checklist.

Deliverable:

- Three strong template examples, not thousands of generated pages.

### Week 4: Retention and Soft Conversion

Goal: Learn whether users want premium workflows before building payments.

Tasks:

- Add waitlist/email capture for saved layouts or alerts.
- Add "save chart layout" teaser after users interact with chart controls.
- Add analytics events for conversion interest.
- Add simple feature flag/config for upcoming premium prompts.
- Add one lightweight local watchlist improvement, such as rename/reorder/remove UX.
- Review analytics after launch and pick next page type based on behavior.

Deliverable:

- A non-invasive conversion path and measurement loop.

## First Implementation Milestone Details

### Scope

Files likely touched:

- `app/stock/[symbol]/StockView.tsx`
- `components/StockChart.tsx`
- `app/api/chart/[symbol]/route.ts`
- `lib/format.ts`
- `app/layout.tsx`
- New footer/disclaimer components/pages
- README and docs
- Optional GitHub Actions workflow

### Acceptance Criteria

- `/stock/AAPL` shows price, change, exchange, source, quote timestamp, and delay status.
- The page includes visible finance-safe disclaimer language.
- Chart has useful loading, empty, error, and retry states.
- 1D chart behavior is understandable and does not silently show misleading zero-volume tails for equities.
- Mobile layout does not squeeze chart controls or header search.
- Build passes with `npm run build`.
- Any new data normalization logic has focused tests or at minimum documented manual verification.
- No secrets or paid services are added.

### Out of Scope

- Payments.
- Auth.
- Cloud watchlists.
- Alerts.
- Advanced indicators beyond placeholders/design hooks.
- Mass ticker-page generation.
- Provider migration away from Yahoo Finance.
- Major visual redesign.

## Approval Gate

Implementation should not begin until mkrtkr approves this milestone or chooses a different first milestone.

Recommended approval prompt:

> Approve Milestone 1: polish the existing stock detail page template and trust/data foundation.
