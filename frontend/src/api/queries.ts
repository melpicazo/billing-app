import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./types";
import { fetchFirmTotals, fetchSystemStatus } from "./functions";

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
