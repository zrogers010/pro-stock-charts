# SEO Foundation

Milestone: Technical SEO + Crawlability Foundation  
Reviewed: 2026-06-07

## Canonical Route Rules

- The current canonical ticker route is `/stock/[SYMBOL]`.
- Ticker symbols should use uppercase where possible. Lowercase ticker requests are redirected by the stock route before rendering.
- Curated hub pages keep their own canonical paths:
  - `/stocks`, `/etfs`, `/crypto`, `/commodities`, `/futures`, `/indices`
  - `/{hub}/{asset-slug}-chart`
- Do not add `/stocks/[symbol]`, `/etfs/[symbol]`, or other route families until the migration plan includes redirects, canonical updates, and sitemap changes.
- Query parameters such as `range` and `type` are chart UI state, not canonical URLs.

## Sitemap Policy

- Keep the sitemap intentionally small while the site is young.
- Include public utility/trust pages, market hubs, curated asset pages, selected ticker pages, and learn pages.
- Avoid adding thousands of generated ticker URLs until each page type has unique value, source disclosure, and internal links.
- Use stable `lastModified` values for evergreen pages so deploys do not create noisy crawl signals.
- Dynamic ticker pages can use `hourly` change frequency because quote/chart data changes frequently.

## Robots Policy

- Allow public pages and crawlable assets.
- Disallow API routes because API JSON responses are not landing pages.
- Do not block query parameters globally; canonical metadata handles chart UI query variants.

## Metadata Policy

- Every indexable page type should have a title, meta description, canonical URL, and Open Graph/Twitter metadata.
- Market-data pages must keep visible data-source and not-investment-advice disclosures.
- JSON-LD should describe visible page content only. Avoid fabricated ratings, recommendations, reviews, or performance claims.
- Keep analytics optional and documented. If analytics is enabled, privacy and terms pages should stay linked globally.

## Current Follow-Ups

- Add richer page-specific Open Graph images later if social previews become important.
- Add a route migration plan before moving from `/stock/[symbol]` to asset-specific route families.
- Add real automated browser/metadata tests when the app has a test runner.

