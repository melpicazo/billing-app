export interface SystemStatus {
  hasData: boolean;
  clientCount: number;
  portfolioCount: number;
  assetCount: number;
  lastImportDate: Date | null;
}

export interface FirmTotals {
  firm_aum_cad: number;
  firm_revenue_cad: number;
  firm_average_fee_rate: number;
  num_clients: number;
  num_portfolios: number;
}

export interface ClientTotals {
  client_id: string;
  client_name: string;
  total_aum_cad: number;
  total_fees_cad: number;
  effective_fee_rate: number;
  num_portfolios: number;
}

// Simple API response wrapper
export interface ApiResponse<T> {
  data: T | null;
  error?: string;
}
