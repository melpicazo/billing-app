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
  tier_id: number;
  external_tier_id: string;
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

export interface TierRange {
  id: number;
  portfolio_aum_min: number;
  portfolio_aum_max: number;
  fee_percentage: number;
}

export interface BillingTier {
  id: number;
  external_tier_id: string;
  ranges: TierRange[];
}

export interface Asset {
  asset_id: string;
  external_portfolio_id: string;
  asset_value: number;
  currency: string;
  date: string;
}
