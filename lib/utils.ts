import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fmtDateRange = (start?: string, end?: string) => {
  if (!start && !end) return "No dates"
  try {
    const opts: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
    const startD = start ? new Date(start) : null
    const endD = end ? new Date(end) : null

    if (startD && endD) {
      // If same day, show single date
      if (
        startD.getUTCFullYear() === endD.getUTCFullYear() &&
        startD.getUTCMonth() === endD.getUTCMonth() &&
        startD.getUTCDate() === endD.getUTCDate()
      ) {
        return startD.toLocaleDateString(undefined, opts)
      }
      return `${startD.toLocaleDateString(undefined, opts)} — ${endD.toLocaleDateString(
        undefined,
        opts
      )}`
    }

    return startD ? startD.toLocaleDateString(undefined, opts) : endD?.toLocaleDateString(undefined, opts) ?? "No dates"
  } catch {
    return "Invalid date"
  }
}