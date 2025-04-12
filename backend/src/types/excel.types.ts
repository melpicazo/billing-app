// This file contains the Excel data types derived from database types
import type { Client, Portfolio, Asset, BillingTier } from "./database.types";

export interface ExcelClient extends Omit<Client, "id" | "billing_tier_id"> {
  billing_tier_id: string; // external ID instead of DB ID
}

export interface ExcelPortfolio extends Omit<Portfolio, "id" | "client_id"> {
  client_id: string; // external ID instead of DB ID
}

export interface ExcelAsset
  extends Omit<Asset, "id" | "portfolio_id" | "date"> {
  portfolio_id: string; // external ID instead of DB ID
  date: string; // string instead of Date
}

export interface ExcelBillingTier extends Omit<BillingTier, "id"> {}

// Type for any Excel data
export type ExcelData =
  | ExcelClient
  | ExcelPortfolio
  | ExcelAsset
  | ExcelBillingTier;
