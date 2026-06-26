import { NextRequest, NextResponse } from "next/server";
import { marketDataCacheHeaders, noStoreHeaders } from "@/lib/api-cache";
import { isValidMarketSymbol, normalizeSymbol } from "@/lib/symbols";
import { fetchStockSnapshot } from "@/lib/stock-data";

export async function GET(
  _request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const symbol = normalizeSymbol(params.symbol);
    if (!isValidMarketSymbol(symbol)) {
      return NextResponse.json(
        { error: "Invalid market symbol" },
        { status: 400, headers: noStoreHeaders }
      );
    }

    const snapshot = await fetchStockSnapshot(symbol);
    if (!snapshot) {
      return NextResponse.json(
        { error: "Failed to fetch quote data" },
        { status: 502, headers: noStoreHeaders }
      );
    }

    return NextResponse.json(snapshot, { headers: marketDataCacheHeaders });
  } catch (error) {
    console.error("Quote error:", error);
    return NextResponse.json(
      { error: "Failed to fetch quote data" },
      { status: 502, headers: noStoreHeaders }
    );
  }
}
