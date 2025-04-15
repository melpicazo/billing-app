import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const formatMoney = (value: number | undefined, decimals?: number) => {
  if (!value) return "$0";
  return `$${Number(value)
    .toFixed(decimals ?? 2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

export const formatPercent = (value: number | undefined) =>
  `${(Number(value) * 100).toFixed(2)}%`;
