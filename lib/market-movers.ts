import yahooFinance from "@/lib/yahoo";

export type MarketMoverListId = "day_gainers" | "day_losers" | "most_actives";

export type MarketMover = {
  symbol: string;
  name: string;
  exchange?: string;
  price?: number;
  change?: number;
  changePercent?: number;
  volume?: number;
  marketCap?: number;
  source?: string;
  delayedBy?: number;
};

export type MarketMoverList = {
  id: MarketMoverListId;
  title: string;
  description: string;
  movers: MarketMover[];
};

const moverConfigs: Array<Omit<MarketMoverList, "movers">> = [
  {
    id: "day_gainers",
    title: "Top Gainers",
    description: "US stocks with the largest positive intraday percentage moves.",
  },
  {
    id: "day_losers",
    title: "Top Losers",
    description: "US stocks with the largest negative intraday percentage moves.",
  },
  {
    id: "most_actives",
    title: "Most Active",
    description: "US stocks with unusually high trading volume today.",
  },
];

type YahooScreenerQuote = {
  symbol?: string;
  shortName?: string;
  longName?: string;
  displayName?: string;
  exchange?: string;
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketVolume?: number;
  marketCap?: number;
  quoteSourceName?: string;
  exchangeDataDelayedBy?: number;
};

type YahooScreenerResult = {
  quotes?: YahooScreenerQuote[];
};

function normalizeMover(quote: YahooScreenerQuote): MarketMover | null {
  if (!quote.symbol) return null;

  return {
    symbol: quote.symbol,
    name:
      quote.shortName ||
      quote.longName ||
      quote.displayName ||
      quote.symbol,
    exchange: quote.exchange,
    price: quote.regularMarketPrice,
    change: quote.regularMarketChange,
    changePercent: quote.regularMarketChangePercent,
    volume: quote.regularMarketVolume,
    marketCap: quote.marketCap,
    source: quote.quoteSourceName,
    delayedBy: quote.exchangeDataDelayedBy,
  };
}

async function fetchMoverList(
  config: Omit<MarketMoverList, "movers">
): Promise<MarketMoverList> {
  try {
    const result = (await yahooFinance.screener(
      { scrIds: config.id, count: 8 },
      undefined,
      { validateResult: false }
    )) as YahooScreenerResult;

    return {
      ...config,
      movers: (result.quotes || [])
        .map(normalizeMover)
        .filter((mover): mover is MarketMover => Boolean(mover)),
    };
  } catch (error) {
    console.error(`Market movers error for ${config.id}:`, error);
    return { ...config, movers: [] };
  }
}

export async function fetchMarketMovers(): Promise<MarketMoverList[]> {
  return Promise.all(moverConfigs.map(fetchMoverList));
}
