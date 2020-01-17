export interface Stock {
  label: string;
  forecast?: ForecastData;
  stock_data?: StockData[];
}

export interface ForecastData {
  closing_price: number;
  confidence: number;
}

export interface StockData {
  timestamp: number;
  close: number;
  high?: number;
  low?: number;
  open?: number;
  volume?: number;
  adj_close?: number;
}
