import {
  Asset,
  BillingTier,
  ClientTotals,
  FirmTotals,
  Portfolio,
  UploadResult,
} from "./types";

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

export const fetchClientTotals = async (): Promise<ClientTotals[]> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_SERVER_URL}/billing/calculations/clients`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch client totals");
  }
  return response.json();
};

export const fetchClientPortfolios = async (
  clientId: number
): Promise<Portfolio[]> => {
  const response = await fetch(
    `${
      import.meta.env.VITE_API_SERVER_URL
    }/billing/calculations/clients/${clientId}/portfolios`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch client portfolios");
  }
  return response.json();
};

export const fetchBillingTiers = async (): Promise<BillingTier[]> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_SERVER_URL}/billing/tiers`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch billing tiers with ranges");
  }
  return response.json();
};

export const resetAllData = async (): Promise<{ message: string }> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_SERVER_URL}/billing/reset`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to reset data");
  }
  return response.json();
};

export const fetchAssets = async (): Promise<Asset[]> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_SERVER_URL}/billing/calculations/assets`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch assets");
  }
  return response.json();
};

export const uploadFiles = async (
  formData: FormData
): Promise<UploadResult[]> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_SERVER_URL}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await response.json();
  return data;
};
