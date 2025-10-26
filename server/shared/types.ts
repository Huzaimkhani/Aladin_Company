// TypeScript interfaces for frontend-backend consistency

export interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  price_chg: number;
  volume_24h: number;
  market_cap: number;
  market_cap_rank?: number;
}

export interface StockData {
  symbol: string;
  price: number;
  change: number;
  change_percent: string;
  volume: number;
  high?: number;
  low?: number;
  open?: number;
}

export interface AIResponse {
  response: string;
  sources: Array<{
    title: string;
    url: string;
  }>;
  response_time: number;
  timestamp: string;
}

export interface ChartData {
  prices: number[][];  // [[timestamp, price], ...]
  market_caps: number[][];
  total_volumes: number[][];
  symbol: string;
  days: number;
}

export interface MarketData {
  crypto: CryptoData[];
  stocks: StockData[];
  forex: any[];
  timestamp: string;
}

export interface FinanceQuery {
  query: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  total: number;
  page: number;
  limit: number;
}