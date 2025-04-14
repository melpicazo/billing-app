import { FirmTotals } from "@/global/types";

export const fetchSystemStatus = async (): Promise<boolean> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_SERVER_URL}/billing/status`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch system status");
  }
  return response.json();
};

export const fetchFirmTotals = async (): Promise<FirmTotals> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_SERVER_URL}/billing/calculations/firm`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch firm totals");
  }
  return response.json();
};
