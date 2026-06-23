# Analytics Review Loop

Use this as the lightweight operating loop before choosing the next content, performance, or premium-conversion sprint.

## Events

Google Analytics is optional and only loads when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is configured.

Tracked product events:

- `stock_page_view` — stock detail page viewed.
- `chart_range_change` — user changed chart range.
- `chart_type_change` — user switched line/candlestick mode.
- `chart_data_download` — user downloaded chart data.
- `chart_layout_save` — user saved a local chart layout.
- `chart_layout_clear` — user cleared a local chart layout.
- `premium_interest_toggle` — user toggled a premium interest item.
- `search_result_click` — user selected a search result.

Tracked performance events:

- `FCP`
- `LCP`
- `CLS`
- `FID`
- `INP`
- `TTFB`

Web Vitals are sent with `event_category=Web Vitals`, the metric id as `event_label`, a threshold-based `metric_rating`, and an integer `value`. CLS values are multiplied by 1000 before sending so GA can aggregate them as whole numbers.

## Weekly Review

1. Check top landing pages and organic search landing pages.
2. Check engagement on `/stock/[symbol]`, `/tools`, `/indicators`, and `/premium`.
3. Check chart interaction events: range changes, chart-type switches, CSV downloads, saved layouts.
4. Check premium interest toggles and which requested workflows are getting signal.
5. Check Web Vitals by page path, especially homepage, stock pages, tools, and indicator articles.
6. Choose the next sprint based on observed bottlenecks:
   - Poor Web Vitals: performance sprint.
   - Strong article traffic: expand that content cluster.
   - Tool engagement: add the next calculator or improve tool UX.
   - Premium toggles: validate capture or waitlist flow.
   - Data errors or low stock-page engagement: improve reliability and empty states.

## Current Decision Rule

Prefer performance and reliability work when they improve every page. Prefer content/tool expansion when analytics show search demand or repeat-use behavior. Avoid adding auth, payments, paid APIs, or mass-generated ticker pages until there is stronger signal.
