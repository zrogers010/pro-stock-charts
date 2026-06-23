export type IndicatorArticle = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  readTime: string;
  formula: string;
  bestFor: string[];
  sections: Array<{
    heading: string;
    body: string;
  }>;
  pitfalls: string[];
};

export const indicatorArticles: IndicatorArticle[] = [
  {
    slug: "rsi",
    title: "Relative Strength Index (RSI) Explained",
    shortTitle: "RSI",
    description:
      "Learn what the Relative Strength Index measures, how traders read overbought and oversold levels, and where RSI signals can fail.",
    readTime: "5 min read",
    formula: "RSI = 100 - (100 / (1 + average gain / average loss))",
    bestFor: [
      "Spotting stretched short-term moves",
      "Comparing momentum across recent swings",
      "Finding divergence to research further",
    ],
    sections: [
      {
        heading: "What RSI measures",
        body:
          "The Relative Strength Index is a momentum oscillator that compares recent average gains with recent average losses. It is usually plotted from 0 to 100 below a price chart, with many traders watching the 30 and 70 zones as rough reference levels.",
      },
      {
        heading: "How traders read it",
        body:
          "A high RSI can show strong upside momentum or a stretched rally. A low RSI can show strong downside momentum or a stretched selloff. The useful question is not whether RSI crosses one level, but whether the signal fits the trend, volume, and broader market context.",
      },
      {
        heading: "Why divergence matters",
        body:
          "Divergence happens when price makes a new high or low while RSI does not confirm it. This can flag fading momentum, but it is only a research clue. Trends can continue for a long time after divergence appears.",
      },
    ],
    pitfalls: [
      "Treating overbought as an automatic sell signal",
      "Ignoring the larger trend",
      "Using RSI without checking price structure or volume",
    ],
  },
  {
    slug: "macd",
    title: "MACD Indicator Explained",
    shortTitle: "MACD",
    description:
      "Understand how MACD uses moving averages to show trend momentum, signal-line crosses, and histogram changes.",
    readTime: "5 min read",
    formula: "MACD line = 12-period EMA - 26-period EMA",
    bestFor: [
      "Tracking trend momentum",
      "Watching signal-line crosses",
      "Seeing momentum expand or fade with the histogram",
    ],
    sections: [
      {
        heading: "What MACD measures",
        body:
          "MACD compares two exponential moving averages to estimate trend momentum. The default MACD line subtracts the 26-period EMA from the 12-period EMA, then adds a 9-period signal line and a histogram showing the gap between them.",
      },
      {
        heading: "How traders read it",
        body:
          "A MACD line above the signal line can point to improving momentum, while a move below the signal line can point to weakening momentum. Crosses near the zero line often carry different context than crosses after a large extended move.",
      },
      {
        heading: "Why the histogram helps",
        body:
          "The histogram makes momentum changes easier to scan. Expanding bars show the MACD line pulling away from the signal line, while shrinking bars show the gap narrowing.",
      },
    ],
    pitfalls: [
      "Reacting to every cross in a choppy market",
      "Forgetting MACD is based on lagging averages",
      "Using default settings without considering timeframe",
    ],
  },
  {
    slug: "bollinger-bands",
    title: "Bollinger Bands Explained",
    shortTitle: "Bollinger Bands",
    description:
      "Learn how Bollinger Bands use a moving average and standard deviation to frame volatility, trend pressure, and range expansion.",
    readTime: "5 min read",
    formula:
      "Middle band = moving average; upper/lower bands = moving average +/- standard deviations",
    bestFor: [
      "Scanning volatility expansion and contraction",
      "Comparing price against a moving average envelope",
      "Researching breakouts from tight ranges",
    ],
    sections: [
      {
        heading: "What Bollinger Bands show",
        body:
          "Bollinger Bands place an upper and lower volatility band around a moving average. The bands widen when volatility increases and narrow when volatility decreases, making them useful for seeing when a market is quiet or active.",
      },
      {
        heading: "How traders read them",
        body:
          "Price near the upper band can show strength, while price near the lower band can show weakness. A close outside a band is not automatically a reversal signal; in strong trends, price can ride a band for several periods.",
      },
      {
        heading: "Why squeezes get attention",
        body:
          "A squeeze happens when the bands become unusually tight. It can signal that volatility has compressed, which often leads traders to watch for a later breakout or breakdown.",
      },
    ],
    pitfalls: [
      "Assuming every band touch means price must reverse",
      "Ignoring whether volatility is expanding or contracting",
      "Using bands without support, resistance, or volume context",
    ],
  },
  {
    slug: "moving-averages",
    title: "Moving Averages Explained",
    shortTitle: "Moving Averages",
    description:
      "Learn how simple and exponential moving averages smooth price action, frame trend direction, and help traders compare short-term and long-term momentum.",
    readTime: "6 min read",
    formula:
      "SMA = sum of closing prices / number of periods; EMA weights recent prices more heavily",
    bestFor: [
      "Smoothing noisy price action",
      "Comparing short-term and long-term trend direction",
      "Finding dynamic areas to research for support or resistance",
    ],
    sections: [
      {
        heading: "What moving averages measure",
        body:
          "A moving average smooths a series of prices into one trend line. A simple moving average gives each period the same weight, while an exponential moving average reacts faster by giving recent prices more influence.",
      },
      {
        heading: "How traders read them",
        body:
          "Price above a rising average can point to constructive trend pressure, while price below a falling average can point to weakness. Crosses between shorter and longer averages can flag momentum changes, but they often lag after sharp moves.",
      },
      {
        heading: "Why timeframe matters",
        body:
          "A 20-day average, 50-day average, and 200-day average answer different questions. Shorter averages react quickly but whipsaw more often; longer averages respond slowly but can help frame the primary trend.",
      },
    ],
    pitfalls: [
      "Treating every moving-average cross as a trade signal",
      "Using the same length across every market and timeframe",
      "Ignoring volume, volatility, and broader market context",
    ],
  },
  {
    slug: "volume-indicators",
    title: "Volume Indicators Explained",
    shortTitle: "Volume Indicators",
    description:
      "Understand how volume indicators help confirm price moves, spot unusual participation, and add context to breakouts or reversals.",
    readTime: "6 min read",
    formula:
      "Volume indicators compare current traded shares or contracts against prior activity, averages, or price direction",
    bestFor: [
      "Confirming whether price moves have participation",
      "Finding unusual activity during breakouts or breakdowns",
      "Comparing liquidity before relying on a chart pattern",
    ],
    sections: [
      {
        heading: "What volume indicators measure",
        body:
          "Volume indicators study participation. They can show whether a price move happened with expanding activity, normal activity, or weak participation that deserves more caution.",
      },
      {
        heading: "How traders read them",
        body:
          "Rising price with above-average volume can suggest stronger demand, while falling price with heavy volume can show aggressive selling. Low-volume moves can still matter, but they are easier to question without confirmation.",
      },
      {
        heading: "Why context matters",
        body:
          "Volume should be compared with the instrument's normal liquidity, market session, news cycle, and broader trend. A volume spike near earnings, ETF rebalance dates, or major macro news may carry a different meaning than ordinary trading.",
      },
    ],
    pitfalls: [
      "Comparing raw volume across unrelated symbols",
      "Ignoring scheduled news or earnings catalysts",
      "Assuming high volume always means bullish demand",
    ],
  },
  {
    slug: "support-and-resistance",
    title: "Support and Resistance Explained",
    shortTitle: "Support and Resistance",
    description:
      "Learn how traders use prior highs, lows, ranges, and moving averages to frame support, resistance, breakout, and breakdown research.",
    readTime: "6 min read",
    formula:
      "Support and resistance are chart zones, not fixed formulas; they are often based on prior highs, lows, ranges, and trendlines",
    bestFor: [
      "Framing key chart levels before planning a trade",
      "Comparing breakout and breakdown areas",
      "Setting research context for risk and reward calculators",
    ],
    sections: [
      {
        heading: "What support and resistance show",
        body:
          "Support is an area where buyers have previously absorbed selling pressure, while resistance is an area where sellers have previously limited advances. These areas are better treated as zones than exact prices.",
      },
      {
        heading: "How traders read them",
        body:
          "A breakout above resistance can show demand improving, while a breakdown below support can show supply taking control. Retests can help traders study whether the old level is still respected or has changed roles.",
      },
      {
        heading: "Why levels fail",
        body:
          "Markets often overshoot visible levels, especially around news or broad volatility. False breakouts and failed breakdowns are common, so support and resistance should be checked against volume, trend, timeframe, and risk.",
      },
    ],
    pitfalls: [
      "Drawing levels too precisely instead of using zones",
      "Ignoring the higher-timeframe trend",
      "Assuming a breakout is reliable without volume or follow-through",
    ],
  },
];

export function getIndicatorArticle(slug: string) {
  return indicatorArticles.find((article) => article.slug === slug);
}
