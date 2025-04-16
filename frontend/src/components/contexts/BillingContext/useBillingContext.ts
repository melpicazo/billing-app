import { ClientTotals, FirmTotals } from "@/api/types";
import { createContext, useContext } from "react";

interface BillingContextValues {
  hasData: boolean;
  firmTotals: FirmTotals | null;
  clientTotals: ClientTotals[] | null;
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
