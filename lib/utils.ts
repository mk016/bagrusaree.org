import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to safely convert decimal values to numbers
export function safeDecimal(value: any): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value) || 0;
  if (value && typeof value === 'object' && 'toNumber' in value) return value.toNumber();
  return 0;
}

// Utility function to format currency safely
export function formatCurrency(value: any, currency: string = '₹'): string {
  const numValue = safeDecimal(value);
  return `${currency}${numValue.toFixed(2)}`;
}
