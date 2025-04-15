export interface FirmTotals {
  firm_aum_cad: number;
  firm_revenue_cad: number;
  firm_average_fee_rate: number;
  num_clients: number;
  num_portfolios: number;
}

export interface ClientTotals {
  client_id: number;
  external_client_id: string;
  client_name: string;
  total_aum_cad: number;
  total_fees_cad: number;
  effective_fee_rate: number;
}

export interface Portfolio {
  portfolio_id: string;
  external_portfolio_id: string;
  total_aum_cad: number;
  total_fees_cad: number;
  effective_fee_rate: number;
}

// Simple API response wrapper
export interface ApiResponse<T> {
  data: T | null;
  error?: string;
}
