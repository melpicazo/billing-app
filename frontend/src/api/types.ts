export const queryKeys = {
  systemStatus: ["systemStatus"] as const,
  firmTotals: ["firmTotals"] as const,
  clients: ["clients"] as const,
  portfolios: ["portfolios"] as const,
} as const;

export type QueryKeys = typeof queryKeys;
