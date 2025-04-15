import { useMemo, type PropsWithChildren } from "react";
import { useSystemStatus, useFirmTotals } from "../../../api/queries";
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
    isLoading: isLoadingTotals,
    error: totalsError,
  } = useFirmTotals();

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
      isLoadingTotals,
      statusError,
      totalsError,
      refetchAll,
    }),
    [
      hasData,
      firmTotals,
      isLoadingStatus,
      isLoadingTotals,
      statusError,
      totalsError,
      refetchAll,
    ]
  );

  return (
    <BillingContext.Provider value={contextValue}>
      {children}
    </BillingContext.Provider>
  );
};
