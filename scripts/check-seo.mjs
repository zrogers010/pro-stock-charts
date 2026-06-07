import { readFileSync } from "node:fs";

const checks = [
  {
    name: "root metadata has metadataBase",
    file: "app/layout.tsx",
    pattern: "metadataBase: new URL(siteUrl)",
  },
  {
    name: "root metadata declares canonical",
    file: "app/layout.tsx",
    pattern: "canonical: canonicalPath(\"/\")",
  },
  {
    name: "root metadata has robots policy",
    file: "app/layout.tsx",
    pattern: "robots:",
  },
  {
    name: "robots disallows API routes",
    file: "app/robots.ts",
    pattern: "disallow: [\"/api/\"]",
  },
  {
    name: "sitemap includes data disclaimer",
    file: "app/sitemap.ts",
    pattern: "\"data-disclaimer\"",
  },
  {
    name: "sitemap includes privacy",
    file: "app/sitemap.ts",
    pattern: "\"privacy\"",
  },
  {
    name: "sitemap includes terms",
    file: "app/sitemap.ts",
    pattern: "\"terms\"",
  },
  {
    name: "footer links privacy",
    file: "components/Footer.tsx",
    pattern: "href=\"/privacy\"",
  },
  {
    name: "footer links terms",
    file: "components/Footer.tsx",
    pattern: "href=\"/terms\"",
  },
  {
    name: "canonical policy is documented",
    file: "SEO_FOUNDATION.md",
    pattern: "The current canonical ticker route is `/stock/[SYMBOL]`.",
  },
];

let failed = false;

for (const check of checks) {
  const source = readFileSync(check.file, "utf8");
  if (!source.includes(check.pattern)) {
    console.error(`SEO check failed: ${check.name}`);
    failed = true;
  }
}

const sitemapSource = readFileSync("app/sitemap.ts", "utf8");
if (sitemapSource.includes("new Date()")) {
  console.error("SEO check failed: sitemap should not use volatile new Date()");
  failed = true;
}

if (failed) {
  process.exit(1);
}

console.log(`SEO checks passed (${checks.length + 1})`);

