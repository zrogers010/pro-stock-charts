export const marketDataCacheHeaders = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
};

export const searchCacheHeaders = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
};

export const noStoreHeaders = {
  "Cache-Control": "no-store",
};
