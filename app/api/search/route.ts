import { NextRequest, NextResponse } from "next/server";
import { noStoreHeaders, searchCacheHeaders } from "@/lib/api-cache";
import yahooFinance from "@/lib/yahoo";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() || "";
  if (!q) return NextResponse.json({ results: [] }, { headers: searchCacheHeaders });
  if (q.length > 40) {
    return NextResponse.json(
      { results: [], error: "Search query is too long" },
      { status: 400, headers: noStoreHeaders }
    );
  }

  try {
    const result = await yahooFinance.search(q, {
      quotesCount: 8,
      newsCount: 0,
    });

    const allowedTypes = new Set([
      "EQUITY",
      "ETF",
      "INDEX",
      "CRYPTOCURRENCY",
      "FUTURE",
      "COMMODITY",
    ]);

    const results = (result.quotes || [])
      .filter(
        (item: any) => item.symbol && allowedTypes.has(item.quoteType)
      )
      .map((item: any) => ({
        symbol: item.symbol,
        name: item.shortname || item.longname || item.symbol,
        type: item.quoteType,
        exchange: item.exchDisp || item.exchange || "",
      }));

    return NextResponse.json({ results }, { headers: searchCacheHeaders });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { results: [], error: "Search temporarily unavailable" },
      { status: 502, headers: noStoreHeaders }
    );
  }
}
