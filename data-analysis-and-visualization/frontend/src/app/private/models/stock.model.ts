export interface Stock {
  label: string;
  forecaster_value?: number;
  values?: ClosingStockValues[];
}

export interface ClosingStockValues {
  timestamp: number;
  value: number;
}
