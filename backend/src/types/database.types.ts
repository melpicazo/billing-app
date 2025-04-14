export interface BillingTier {
  id: number;
  external_tier_id: string;
}

export interface TierRange {
  id: number;
  billing_tier_id: number;
  portfolio_aum_min: number;
  portfolio_aum_max: number;
  fee_percentage: number;
}

export interface Client {
  id: number;
  external_client_id: string;
  client_name: string;
  province: string;
  country: string;
  billing_tier_id: BillingTier["id"];
}

export interface Portfolio {
  id: number;
  external_portfolio_id: string;
  client_id: Client["id"];
  currency: string;
}

export interface Asset {
  id: number;
  portfolio_id: Portfolio["id"];
  asset_id: string;
  asset_value: number;
  currency: string;
  date: Date;
}

export enum DataType {
  CLIENT = "client_billing",
  PORTFOLIO = "portfolio",
  ASSET = "asset",
  BILLING = "billing_tier",
}

export const EXCEL_HEADERS = {
  [DataType.CLIENT]: [
    "external_client_id",
    "client_name",
    "province",
    "country",
    "billing_tier_id",
  ],
  [DataType.PORTFOLIO]: [
    "external_client_id",
    "external_portfolio_id",
    "currency",
  ],
  [DataType.ASSET]: [
    "date",
    "external_portfolio_id",
    "asset_id",
    "asset_value",
    "currency",
  ],
  [DataType.BILLING]: [
    "external_tier_id",
    "portfolio_aum_min",
    "portfolio_aum_max",
    "fee_percentage",
  ],
};
