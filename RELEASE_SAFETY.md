# Release Safety

This project uses a small release-safety layer to catch obvious production
rendering regressions before a PR is merged.

## Current Deployment Path

- Live site: `https://prostockcharts.com`
- Observed runtime: self-hosted Next.js behind `nginx/1.28.1`
- Production build command in the Dockerfile: `npm run build`
- Runtime shape: Next standalone output served by `node server.js`
- GitHub Actions: one active `Build` workflow runs on pull requests and pushes
  to `main`
- GitHub Deployments API: no deployment records or environments are currently
  registered for this repo
- GitHub Pages: disabled for this repo
- Preview deployments: not visible from repository metadata; confirm in the
  hosting provider dashboard before relying on previews
- Automatic deploys after merge: likely handled outside GitHub Deployments,
  because live production updated after merges but no GitHub deployment records
  are present
- Branch protection: repository settings were not accessible to the GitHub App;
  confirm manually in GitHub settings

## Last Production Break

The homepage rendered like browser-default white/black content after a deploy.
The hotfix identified two release risks:

- The homepage was served with a one-year shared cache, which can leave stale
  HTML pointing at old static assets after deployment.
- The generated global CSS had a Google Fonts `@import` after Tailwind output,
  which is invalid CSS ordering.

The hotfix moved the import to the top of the CSS file, added critical shell
styles, and changed the homepage to revalidate every 300 seconds.

## Checks Added

`npm run smoke:prod` runs against a production build. By default it creates a
temporary Docker-like standalone runtime from `.next/standalone` and
`.next/static`, starts `node server.js`, and verifies:

- `/` returns HTML, includes the homepage headline, includes a Next CSS asset,
  includes critical shell styles, and uses `s-maxage=300`
- `/stock/AAPL` returns HTML and includes `AAPL`
- `/stock/BTC-USD` returns HTML and includes `BTC-USD`
- `/data-disclaimer` returns HTML and includes `Data Disclaimer`
- linked homepage CSS assets return `200`, use `text/css`, and look like
  Tailwind output
- obvious raw script markers are not present in visible homepage text

To run against an already-running server, set `SMOKE_BASE_URL`:

```bash
SMOKE_BASE_URL=http://localhost:3000 npm run smoke:prod
```

## Local Release Check

Run this before merging production-facing PRs:

```bash
npm ci
npm run seo:check
npm run build
npm run smoke:prod
```

## GitHub Actions

The `Build` workflow now validates pull requests and pushes to `main` with:

```bash
npm ci
npm run seo:check
npm run build
npm run smoke:prod
```

## Recommended Branch Protection

Enable branch protection for `main` in GitHub repository settings:

- Require a pull request before merging
- Require at least 1 approval
- Require status checks to pass before merging
- Require the `Build` status check
- Require branches to be up to date before merging
- Dismiss stale approvals when new commits are pushed
- Restrict direct pushes to `main`
- Do not allow force pushes
- Do not allow deletions

Keep admin bypass limited. The goal is to make the PR build and production
smoke checks a required gate before code reaches `main`.

## Preview Deployment Recommendation

If the current host supports preview deployments, enable previews for pull
requests and run:

```bash
SMOKE_BASE_URL=<preview-url> npm run smoke:prod
```

No hosting migration is required for this milestone. If the current host does
not support previews, keep the GitHub Actions production-build smoke tests as
the merge gate and manually inspect production after hotfix deploys.

## Remaining Gaps

- These smoke checks are HTTP/content checks, not full browser visual regression
  tests.
- They do not verify interactive chart behavior after hydration.
- GitHub branch protection and host preview settings must be enabled manually by
  a repository/admin owner.
