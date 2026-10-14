/**
 * Technical Indicators Calculation Module
 * Pure functions for computing technical indicators from OHLC data
 */

export interface OHLCData {
  time: string | number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface SMAResult {
  time: string | number;
  value: number;
}

export interface EMAResult {
  time: string | number;
  value: number;
}

export interface BollingerBandsResult {
  time: string | number;
  upper: number;
  middle: number;
  lower: number;
}

export interface RSIResult {
  time: string | number;
  value: number;
}

export interface MACDResult {
  time: string | number;
  macd: number;
  signal: number;
  histogram: number;
}

/**
 * Calculate Simple Moving Average (SMA)
 */
export function calculateSMA(data: OHLCData[], period: number): SMAResult[] {
  if (data.length < period) return [];

  const result: SMAResult[] = [];

  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    const avg = sum / period;
    result.push({
      time: data[i].time,
      value: avg,
    });
  }

  return result;
}

/**
 * Calculate Exponential Moving Average (EMA)
 */
export function calculateEMA(data: OHLCData[], period: number): EMAResult[] {
  if (data.length < period) return [];

  const result: EMAResult[] = [];
  const multiplier = 2 / (period + 1);

  // Start with SMA for the first value
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i].close;
  }
  let ema = sum / period;
  result.push({
    time: data[period - 1].time,
    value: ema,
  });

  // Calculate EMA for remaining values
  for (let i = period; i < data.length; i++) {
    ema = (data[i].close - ema) * multiplier + ema;
    result.push({
      time: data[i].time,
      value: ema,
    });
  }

  return result;
}

/**
 * Calculate Bollinger Bands (20,2)
 */
export function calculateBollingerBands(
  data: OHLCData[],
  period: number = 20,
  stdDev: number = 2
): BollingerBandsResult[] {
  if (data.length < period) return [];

  const result: BollingerBandsResult[] = [];

  for (let i = period - 1; i < data.length; i++) {
    // Calculate SMA (middle band)
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    const sma = sum / period;

    // Calculate standard deviation
    let variance = 0;
    for (let j = 0; j < period; j++) {
      const diff = data[i - j].close - sma;
      variance += diff * diff;
    }
    const sd = Math.sqrt(variance / period);

    result.push({
      time: data[i].time,
      upper: sma + stdDev * sd,
      middle: sma,
      lower: sma - stdDev * sd,
    });
  }

  return result;
}

/**
 * Calculate Relative Strength Index (RSI)
 */
export function calculateRSI(data: OHLCData[], period: number = 14): RSIResult[] {
  if (data.length < period + 1) return [];

  const result: RSIResult[] = [];
  const gains: number[] = [];
  const losses: number[] = [];

  // Calculate price changes
  for (let i = 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? -change : 0);
  }

  // Calculate initial average gain and loss
  let avgGain = 0;
  let avgLoss = 0;
  for (let i = 0; i < period; i++) {
    avgGain += gains[i];
    avgLoss += losses[i];
  }
  avgGain /= period;
  avgLoss /= period;

  const toRSI = (gain: number, loss: number) => {
    if (loss === 0) return gain === 0 ? 50 : 100;
    return 100 - 100 / (1 + gain / loss);
  };

  result.push({
    time: data[period].time,
    value: toRSI(avgGain, avgLoss),
  });

  // Calculate RSI for remaining values using smoothed averages
  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    result.push({
      time: data[i + 1].time,
      value: toRSI(avgGain, avgLoss),
    });
  }

  return result;
}

/**
 * Calculate MACD (Moving Average Convergence Divergence)
 */
export function calculateMACD(
  data: OHLCData[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): MACDResult[] {
  if (data.length < slowPeriod) return [];

  // Calculate fast and slow EMAs
  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);

  // Calculate MACD line (fast EMA - slow EMA)
  const macdLine: { time: string | number; value: number }[] = [];
  for (let i = 0; i < slowEMA.length; i++) {
    const fastIndex = fastEMA.findIndex((f) => f.time === slowEMA[i].time);
    if (fastIndex !== -1) {
      macdLine.push({
        time: slowEMA[i].time,
        value: fastEMA[fastIndex].value - slowEMA[i].value,
      });
    }
  }

  if (macdLine.length < signalPeriod) return [];

  // Calculate signal line (EMA of MACD line)
  const result: MACDResult[] = [];
  const multiplier = 2 / (signalPeriod + 1);

  // Start with SMA for the first signal value
  let sum = 0;
  for (let i = 0; i < signalPeriod; i++) {
    sum += macdLine[i].value;
  }
  let signal = sum / signalPeriod;

  result.push({
    time: macdLine[signalPeriod - 1].time,
    macd: macdLine[signalPeriod - 1].value,
    signal: signal,
    histogram: macdLine[signalPeriod - 1].value - signal,
  });

  // Calculate signal for remaining values
  for (let i = signalPeriod; i < macdLine.length; i++) {
    signal = (macdLine[i].value - signal) * multiplier + signal;
    result.push({
      time: macdLine[i].time,
      macd: macdLine[i].value,
      signal: signal,
      histogram: macdLine[i].value - signal,
    });
  }

  return result;
}
