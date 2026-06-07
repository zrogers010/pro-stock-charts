# ProStockCharts Growth Strategy

Audit date: 2026-06-06 PDT

## Positioning

ProStockCharts should not try to out-feature TradingView, Koyfin, StockCharts, Finviz, or Yahoo Finance immediately. The practical wedge is:

- Fast public chart pages.
- Clean professional UX.
- Useful free market data.
- High-trust ticker and education pages.
- Carefully scoped SEO templates.
- Premium workflows later for users who repeatedly research markets.

The product promise should be:

> Fast, free, professional market charts for research and education.

Avoid:

- "Real-time" unless data rights and exchange delays are explicitly handled.
- "Best stock to buy" or prediction language.
- Recommendation wording that sounds personalized.
- Thin AI-style SEO pages.

## Target Search Intent

### Strong early intent

- "[ticker] stock chart"
- "[ticker] candlestick chart"
- "[ticker] price history"
- "[ticker] stock volume"
- "[ticker] technical analysis"
- "free stock charts"
- "best free stock charts"
- "how to read candlestick charts"

### Later intent

- "[ticker] rsi"
- "[ticker] macd"
- "[ticker] vs [ticker]"
- "position size calculator"
- "risk reward calculator"
- "top gainers today"
- "most active stocks"
- "sector performance"

## Page Strategy

### Build now

1. Dynamic security page
   - Current route: `/stock/[symbol]`
   - Recommended future route family: `/stocks/[symbol]`, `/etfs/[symbol]`, `/crypto/[symbol]`, `/indices/[symbol]`
   - Must include quote, timestamp, chart, volume, key stats, summary, source disclosure, related links, and disclaimer.

2. Market hub pages
   - `/stocks`, `/etfs`, `/crypto`, `/commodities`, `/futures`, `/indices`
   - Current pages are useful but should eventually show live tables, not only static cards.

3. Learn pages
   - Good for evergreen trust.
   - Current pages are short but reasonable as a starting set.
   - Expand only with genuinely helpful visuals/examples and internal links to real chart pages.

### Build soon, after stock page quality is high

1. Indicator explainers
   - `/indicators/rsi`
   - `/indicators/macd`
   - `/indicators/bollinger-bands`
   - Include examples, formulas, pitfalls, and links to ticker pages.

2. Ticker indicator pages
   - `/stocks/AAPL/rsi`
   - `/stocks/AAPL/macd`
   - Only after the main ticker template has indicators and data definitions.

3. Comparison pages
   - `/compare/AAPL-vs-MSFT`
   - Start with a few curated comparisons, not generated thousands.

4. Tools
   - `/tools/position-size-calculator`
   - `/tools/risk-reward-calculator`
   - These can earn links and repeat usage without expensive data.

### Do not scale yet

- Thousands of ticker pages.
- Daily market commentary.
- AI-generated stock analysis pages.
- "Best stock" ranking pages.
- Paid dashboards or payments.
- Personalized advice language.

## Programmatic SEO Guardrails

Every indexable page should have:

- A clear user intent.
- A useful chart, table, calculator, or explanation.
- Unique title and meta description.
- Canonical URL.
- Internal links to related pages.
- Source/date disclosure where data is shown.
- Disclaimer language.
- Fast load time.
- No fabricated insight.

Do not publish a page type if its template would be thin when data is missing.

## Trust Strategy

Trust is a growth feature in finance.

Add:

- Visible data source/timestamp on quote pages.
- "Not investment advice" disclaimer.
- Explanation that quotes may be delayed depending on source/exchange.
- Dedicated data disclaimer page.
- Privacy page if analytics remain enabled.
- Careful labels for analyst fields, such as "Analyst consensus data from source" instead of "Recommendation".
- Clear error states when source data is unavailable.

Avoid:

- "Live" or "real-time" claims unless verified.
- "Buy", "sell", or "winner" language outside clearly labeled third-party analyst fields.
- AI certainty.

## Retention and Conversion Path

### Current retention assets

- Local watchlist.
- Recently viewed symbols.
- Exports.
- Search.

### Next soft conversion hooks

- "Save chart layout" disabled/coming-soon prompt.
- "Create account to sync watchlist" waitlist.
- "Alerts coming soon" waitlist.
- Email capture after a useful action, not before value is shown.

### Premium later

- Cloud watchlists.
- Saved layouts.
- Alerts.
- Multi-chart dashboards.
- Advanced indicators.
- Deeper exports/history.
- Premium screeners.
- Personalized market briefs.

## Measurement

Track these events first:

- Search submit.
- Symbol page view.
- Chart range change.
- Chart type change.
- Data export.
- Watchlist add/remove.
- News click.
- Related chart click.
- Waitlist/signup interest when added.

Add simple content metrics:

- Organic landing page.
- Page type.
- Symbol/category.
- CTA impressions and clicks.

## Competitive Angle

Compared with TradingView:

- Simpler, faster, lower-friction public reference pages.

Compared with Yahoo Finance:

- Cleaner chart-first UX and better educational/internal linking.

Compared with Finviz:

- More modern chart page and learning path.

Compared with StockCharts:

- Better free UX and faster entry point.

Compared with Koyfin:

- Public SEO pages and no account wall for core value.

## Recommended Growth Sequence

1. Make one stock page excellent.
2. Add trust/legal/data disclosures.
3. Tighten technical SEO and route strategy.
4. Add a few high-quality educational/indicator/tool pages.
5. Add market hub tables.
6. Add soft waitlist/conversion.
7. Only then expand page count.
