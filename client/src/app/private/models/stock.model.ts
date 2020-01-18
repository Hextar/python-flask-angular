export interface Stock {
  label: string;
  forecast?: ForecastData;
  points?: StockData[];
}

export interface ForecastData {
  closing_price: number;
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
