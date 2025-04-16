import { createContext, useContext } from "react";

interface BillingContextValues {
  hasData: boolean;
  firmTotals: {
    firm_aum_cad: number;
    firm_revenue_cad: number;
    firm_average_fee_rate: number;
    num_clients: number;
    num_portfolios: number;
  } | null;
  clientTotals:
    | {
        client_name: string;
        total_fees_cad: number;
        external_tier_id: string;
      }[]
    | null;
  isLoadingFirmTotals: boolean;
  isLoadingClientTotals: boolean;
  firmTotalsError: Error | null;
  clientTotalsError: Error | null;
  refetchAll: () => Promise<void>;
}

export const BillingContext = createContext<BillingContextValues | null>(null);

export const useBillingContext = () => {
  const context = useContext(BillingContext);

  if (!context) {
    throw new Error("useBillingContext must be used within a BillingProvider");
  }

  return context;
};
