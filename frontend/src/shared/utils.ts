import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const formatMoney = (value: number | undefined) => {
  if (!value) return "";
  return `$${Number(value)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

export const formatPercent = (value: number | undefined) =>
  `${(Number(value) * 100).toFixed(2)}%`;
