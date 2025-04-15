export const queryKeys = {
  systemStatus: ["systemStatus"] as const,
  firmTotals: ["firmTotals"] as const,
  clientTotals: ["clientTotals"] as const,
  clientPortfolios: ["clientPortfolios"] as const,
} as const;

export type QueryKeys = typeof queryKeys;
