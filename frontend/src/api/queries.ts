import { useQuery } from "@tanstack/react-query";
import { fetchSystemStatus, fetchFirmTotals } from "./functions";

export function useSystemStatus() {
  return useQuery({
    queryKey: ["systemStatus"],
    queryFn: fetchSystemStatus,
  });
}

export function useFirmTotals() {
  return useQuery({
    queryKey: ["firmTotals"],
    queryFn: fetchFirmTotals,
    // Only fetch if we have data in the system
    enabled: useSystemStatus().data ?? false,
  });
}
