import { NextRequest, NextResponse } from "next/server";
import { marketDataCacheHeaders, noStoreHeaders } from "@/lib/api-cache";
import { isValidMarketSymbol, normalizeSymbol } from "@/lib/symbols";
import yahooFinance from "@/lib/yahoo";

export async function GET(
  _request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const symbol = normalizeSymbol(params.symbol);
    if (!isValidMarketSymbol(symbol)) {
      return NextResponse.json(
        { news: [], error: "Invalid market symbol" },
        { status: 400, headers: noStoreHeaders }
      );
    }

    const result = await yahooFinance.search(symbol, {
      quotesCount: 0,
      newsCount: 20,
    });

    const news = (result.news || []).map((article: any) => ({
      title: article.title,
      link: article.link,
      publisher: article.publisher,
      publishedAt: article.providerPublishTime
        ? new Date(
            typeof article.providerPublishTime === "number"
              ? article.providerPublishTime * 1000
              : article.providerPublishTime
          ).toISOString()
        : null,
      thumbnail:
        article.thumbnail?.resolutions?.[0]?.url || null,
    }));

    return NextResponse.json(
      {
        news,
        meta: {
          symbol,
          source: "Yahoo Finance",
          updatedAt: new Date().toISOString(),
        },
      },
      { headers: marketDataCacheHeaders }
    );
  } catch (error) {
    console.error("News error:", error);
    return NextResponse.json(
      { news: [], error: "News temporarily unavailable" },
      { status: 502, headers: noStoreHeaders }
    );
  }
}
