import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function getObjectBadges(detectedObjects: Array<{ class: string; confidence: number }>) {
  return Object.entries(
    detectedObjects.reduce((acc, obj) => {
      acc[obj.class] = (acc[obj.class] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([title, count]) => ({
    title,
    count
  }));
}
