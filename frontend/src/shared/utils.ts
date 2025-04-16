import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const colors = [
  "#0369a1",
  "#059669",
  "#ea580c",
  "#0891b2",
  "#0d9488",
  "#65a30d",
];

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

export const getIndexedColor = (index: number) => {
  return colors[index % colors.length];
};
