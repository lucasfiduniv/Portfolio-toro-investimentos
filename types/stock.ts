export interface Stock {
  symbol: string;
  price: number;
  openPrice: number;
  variation: number;
  variationPercent: number;
  priceHistory: number[];
  lastUpdated: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface StockQuote {
  [symbol: string]: number;
}

export type SortOrder = 'up' | 'down';