import { NextRequest, NextResponse } from "next/server";
import yahooFinance from "@/lib/yahoo";

export async function GET(
  _request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const symbol = params.symbol.toUpperCase();

    const [quote, summary] = await Promise.all([
      yahooFinance.quote(symbol),
      yahooFinance
        .quoteSummary(symbol, {
          modules: [
            "assetProfile",
            "summaryDetail",
            "financialData",
            "defaultKeyStatistics",
            "recommendationTrend",
          ],
        })
        .catch(() => null),
    ]);

    return NextResponse.json({ quote, summary });
  } catch (error) {
    console.error("Quote error:", error);
    return NextResponse.json(
      { error: "Failed to fetch quote data" },
      { status: 500 }
    );
  }
}
