export interface Stock {
  label: string;
  closing_price_forecast?: number;
  points?: StockPoint[];
}

export interface StockPoint {
  timestamp: number;
  value: number;
}
