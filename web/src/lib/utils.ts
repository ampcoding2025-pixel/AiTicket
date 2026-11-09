import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFaNumber(value: number, digits = 0) {
  return new Intl.NumberFormat("fa-IR", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

export function formatFaPercent(value: number, digits = 1) {
  return `${formatFaNumber(value, digits)}٪`;
}
