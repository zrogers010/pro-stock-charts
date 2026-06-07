import type { MetadataRoute } from "next";
import {
  featuredHubSlugs,
  marketHubs,
  siteUrl,
  stockPageSymbols,
} from "@/lib/markets";
import { educationArticles } from "@/lib/education";
import { assetToSlug } from "@/lib/market-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = ["", "data-disclaimer", ...featuredHubSlugs.map((slug) => slug)].map(
    (path) => ({
      url: `${siteUrl}/${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })
  );

  const stockRoutes = stockPageSymbols.map((symbol) => ({
    url: `${siteUrl}/stock/${encodeURIComponent(symbol)}`,
    lastModified: now,
    changeFrequency: "hourly" as const,
    priority: 0.9,
  }));

  const curatedRoutes = marketHubs.flatMap((hub) =>
    hub.assets.slice(0, 6).map((asset) => ({
      url: `${siteUrl}/${hub.slug}/${assetToSlug(asset)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  const educationRoutes = educationArticles.map((article) => ({
    url: `${siteUrl}/learn/${article.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [...staticRoutes, ...stockRoutes, ...curatedRoutes, ...educationRoutes];
}
