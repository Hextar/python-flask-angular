export interface Stock {
  label: string;
  forecaster_value?: number;
  points?: StockPoint[];
}

export interface StockPoint {
  timestamp: number;
  value: number;
}
