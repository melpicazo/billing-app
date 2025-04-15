import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import {
  fetchClientTotals,
  fetchClientPortfolios,
  fetchFirmTotals,
  fetchSystemStatus,
  fetchBillingTiers,
  resetAllData,
  fetchAssets,
} from "./functions";

export function useSystemStatus() {
  return useQuery({
    queryKey: queryKeys.systemStatus,
    queryFn: fetchSystemStatus,
  });
}

export function useFirmTotals() {
  return useQuery({
    queryKey: queryKeys.firmTotals,
    queryFn: fetchFirmTotals,
  });
}

export function useClientTotals() {
  return useQuery({
    queryKey: queryKeys.clientTotals,
    queryFn: fetchClientTotals,
  });
}

export function useClientPortfolios(clientId: number | null) {
  return useQuery({
    queryKey: [queryKeys.clientPortfolios, clientId],
    queryFn: () => fetchClientPortfolios(clientId!),
    enabled: !!clientId, // Only fetch when clientId is provided
  });
}

export function useBillingTiers() {
  return useQuery({
    queryKey: queryKeys.billingTiers,
    queryFn: fetchBillingTiers,
  });
}

export function useResetData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resetAllData,
    onSuccess: () => {
      return queryClient.invalidateQueries();
    },
  });
}

export function useAssets() {
  return useQuery({
    queryKey: queryKeys.assets,
    queryFn: fetchAssets,
  });
}
