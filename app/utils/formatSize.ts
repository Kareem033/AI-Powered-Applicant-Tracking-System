import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Convert bytes into a human-readable string using binary (1024) units.
 * Examples:
 *  1024 -> "1 KB"
 *  1536 -> "1.5 KB"
 *  1048576 -> "1 MB"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSize(bytes: number): string {
  if (bytes == null || isNaN(bytes)) return "0 B";
  const negative = bytes < 0;
  let value = Math.abs(bytes);
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i += 1;
  }
  // Show one decimal for non-integer values, otherwise no decimals
  const formatted = value % 1 === 0 ? String(value) : value.toFixed(1);
  return `${negative ? "-" : ""}${formatted} ${units[i]}`;
}

export default formatSize;

export const generateUUID = () => crypto.randomUUID();
