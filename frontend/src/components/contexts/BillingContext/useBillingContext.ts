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
  isLoadingStatus: boolean;
  isLoadingTotals: boolean;
  statusError: Error | null;
  totalsError: Error | null;
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
