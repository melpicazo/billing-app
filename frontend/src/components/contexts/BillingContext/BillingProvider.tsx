import { useMemo, type PropsWithChildren } from "react";
import { useSystemStatus, useFirmTotals, useClientTotals } from "@/api/queries";
import { BillingContext } from "./useBillingContext";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/api/keys";

type BillingProviderProps = PropsWithChildren;

export const BillingProvider = ({ children }: BillingProviderProps) => {
  const queryClient = useQueryClient();
  const {
    data: hasData,
    isLoading: isLoadingStatus,
    error: statusError,
  } = useSystemStatus();
  const {
    data: firmTotals,
    isLoading: isLoadingFirmTotals,
    error: firmTotalsError,
  } = useFirmTotals();
  const {
    data: clientTotals,
    isLoading: isLoadingClientTotals,
    error: clientTotalsError,
  } = useClientTotals();

  const refetchAll = useMemo(() => {
    return async () => {
      const queriesToRefetch = [
        queryKeys.systemStatus,
        queryKeys.firmTotals,
        queryKeys.clientTotals,
      ];

      try {
        await Promise.all(
          queriesToRefetch.map((queryKey) =>
            queryClient.refetchQueries({ queryKey })
          )
        );
      } catch (error) {
        console.error("Error refetching data:", error);
        throw error;
      }
    };
  }, [queryClient]);

  // Memoize our context value
  const contextValue = useMemo(
    () => ({
      hasData: hasData ?? false,
      firmTotals: firmTotals ?? null,
      isLoadingStatus,
      isLoadingFirmTotals,
      firmTotalsError,
      clientTotals: clientTotals ?? null,
      isLoadingClientTotals,
      statusError,
      clientTotalsError,
      refetchAll,
    }),
    [
      hasData,
      firmTotals,
      clientTotals,
      isLoadingStatus,
      isLoadingFirmTotals,
      isLoadingClientTotals,
      statusError,
      firmTotalsError,
      clientTotalsError,
      refetchAll,
    ]
  );

  return (
    <BillingContext.Provider value={contextValue}>
      {children}
    </BillingContext.Provider>
  );
};
