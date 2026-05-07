import { NextRequest, NextResponse } from "next/server";
import { fetchStockSnapshot } from "@/lib/stock-data";

export async function GET(
  _request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const symbol = params.symbol.toUpperCase();
    const snapshot = await fetchStockSnapshot(symbol);
    if (!snapshot) {
      return NextResponse.json(
        { error: "Failed to fetch quote data" },
        { status: 500 }
      );
    }

    return NextResponse.json(snapshot);
  } catch (error) {
    console.error("Quote error:", error);
    return NextResponse.json(
      { error: "Failed to fetch quote data" },
      { status: 500 }
    );
  }
}
