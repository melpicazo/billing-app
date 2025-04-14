import { useMemo, type PropsWithChildren } from "react";
import { useSystemStatus, useFirmTotals } from "../../../api/queries";
import { BillingContext } from "./useBillingContext";

type BillingProviderProps = PropsWithChildren;

export const BillingProvider = ({ children }: BillingProviderProps) => {
  const {
    data: hasData,
    isLoading: isLoadingStatus,
    error: statusError,
  } = useSystemStatus();
  const {
    data: firmTotals,
    isLoading: isLoadingTotals,
    error: totalsError,
  } = useFirmTotals();

  // Memoize our context value
  const contextValue = useMemo(
    () => ({
      hasData: hasData ?? false,
      firmTotals: firmTotals ?? null,
      isLoadingStatus,
      isLoadingTotals,
      statusError,
      totalsError,
    }),
    [
      hasData,
      firmTotals,
      isLoadingStatus,
      isLoadingTotals,
      statusError,
      totalsError,
    ]
  );

  return (
    <BillingContext.Provider value={contextValue}>
      {children}
    </BillingContext.Provider>
  );
};
