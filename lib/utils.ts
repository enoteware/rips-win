import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(value: number | string | null | undefined): string {
  const n = value != null ? Number(value) : NaN;
  if (Number.isNaN(n) || n === 0) return "—";
  return `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatStreak(value: number | null | undefined): string {
  const n = value != null ? Number(value) : 0;
  if (n <= 0) return "—";
  return `${n} 🔥`;
}
