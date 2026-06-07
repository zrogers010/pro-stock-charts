import { siteUrl } from "@/lib/markets";

export const seoReviewedAt = new Date("2026-06-07T00:00:00.000Z");

export const defaultOgImage = "/opengraph-image";

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
}

export function canonicalPath(path = "/") {
  if (path === "") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

