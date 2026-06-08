import type { MetadataRoute } from "next";
import {
  featuredHubSlugs,
  marketHubs,
  siteUrl,
  stockPageSymbols,
} from "@/lib/markets";
import { educationArticles } from "@/lib/education";
import { comparisons } from "@/lib/comparisons";
import { assetToSlug } from "@/lib/market-pages";
import { seoReviewedAt } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "data-disclaimer",
    "compare",
    "market-movers",
    "premium",
    "privacy",
    "terms",
    ...featuredHubSlugs.map((slug) => slug),
  ].map((path) => ({
      url: `${siteUrl}/${path}`,
      lastModified: seoReviewedAt,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    }));

  const stockRoutes = stockPageSymbols.map((symbol) => ({
    url: `${siteUrl}/stock/${encodeURIComponent(symbol)}`,
    changeFrequency: "hourly" as const,
    priority: 0.9,
  }));

  const curatedRoutes = marketHubs.flatMap((hub) =>
    hub.assets.slice(0, 6).map((asset) => ({
      url: `${siteUrl}/${hub.slug}/${assetToSlug(asset)}`,
      lastModified: seoReviewedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  const educationRoutes = educationArticles.map((article) => ({
    url: `${siteUrl}/learn/${article.slug}`,
    lastModified: seoReviewedAt,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  const comparisonRoutes = comparisons.map((comparison) => ({
    url: `${siteUrl}/compare/${comparison.slug}`,
    lastModified: seoReviewedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...stockRoutes,
    ...curatedRoutes,
    ...educationRoutes,
    ...comparisonRoutes,
  ];
}
