import yahooFinance from "@/lib/yahoo";

export interface QuoteData {
  symbol: string;
  shortName?: string;
  longName?: string;
  quoteType?: string;
  quoteSourceName?: string;
  regularMarketTime?: Date | string | number;
  exchangeDataDelayedBy?: number;
  sourceInterval?: number;
  marketState?: string;
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketPreviousClose?: number;
  regularMarketOpen?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketVolume?: number;
  averageDailyVolume3Month?: number;
  marketCap?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  exchange?: string;
  fullExchangeName?: string;
  circulatingSupply?: number;
  volume24Hr?: number;
  volumeAllCurrencies?: number;
}

export interface SummaryData {
  assetProfile?: {
    sector?: string;
    industry?: string;
    fullTimeEmployees?: number;
    longBusinessSummary?: string;
    website?: string;
    city?: string;
    state?: string;
    country?: string;
    companyOfficers?: Array<{ name: string; title: string }>;
  };
  summaryDetail?: {
    trailingPE?: number;
    forwardPE?: number;
    dividendYield?: number;
    dividendRate?: number;
    beta?: number;
    fiftyDayAverage?: number;
    twoHundredDayAverage?: number;
    trailingAnnualDividendYield?: number;
    payoutRatio?: number;
    exDividendDate?: string;
  };
  financialData?: {
    totalRevenue?: number;
    revenueGrowth?: number;
    grossMargins?: number;
    operatingMargins?: number;
    profitMargins?: number;
    returnOnEquity?: number;
    targetMeanPrice?: number;
    recommendationMean?: number;
    recommendationKey?: string;
    numberOfAnalystOpinions?: number;
    earningsGrowth?: number;
    currentPrice?: number;
    totalCash?: number;
    totalDebt?: number;
    freeCashflow?: number;
  };
  defaultKeyStatistics?: {
    trailingEps?: number;
    forwardEps?: number;
    pegRatio?: number;
    priceToBook?: number;
    enterpriseValue?: number;
    sharesOutstanding?: number;
    floatShares?: number;
    shortRatio?: number;
    shortPercentOfFloat?: number;
    earningsQuarterlyGrowth?: number;
  };
}

export interface StockSnapshot {
  quote: QuoteData;
  summary: SummaryData | null;
}

function getSummaryModules(quoteType: string) {
  const isCrypto = quoteType === "CRYPTOCURRENCY";
  const isFuture = quoteType === "FUTURE" || quoteType === "COMMODITY";

  if (isCrypto || isFuture) return ["summaryDetail"];

  return [
    "assetProfile",
    "summaryDetail",
    "financialData",
    "defaultKeyStatistics",
    "recommendationTrend",
  ];
}

export async function fetchStockSnapshot(
  symbol: string
): Promise<StockSnapshot | null> {
  try {
    const normalizedSymbol = symbol.toUpperCase();
    const quote = (await yahooFinance.quote(normalizedSymbol)) as QuoteData;
    const quoteType = quote.quoteType || "EQUITY";
    const summary = await yahooFinance
      .quoteSummary(normalizedSymbol, {
        modules: getSummaryModules(quoteType) as any,
      })
      .catch(() => null);

    return { quote, summary: summary as SummaryData | null };
  } catch (error) {
    console.error("Stock snapshot error:", error);
    return null;
  }
}

export function getDisplayName(quote: QuoteData | null | undefined) {
  return quote?.longName || quote?.shortName || quote?.symbol || "Stock";
}
