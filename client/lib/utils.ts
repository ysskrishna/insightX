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

export function getRelativeTime(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diff = (now.getTime() - date.getTime()) / 1000 // in seconds

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  if (diff < 60) return 'just now'
  if (diff < 3600) return rtf.format(-Math.floor(diff / 60), 'minute')
  if (diff < 86400) return rtf.format(-Math.floor(diff / 3600), 'hour')
  if (diff < 604800) return rtf.format(-Math.floor(diff / 86400), 'day')
  if (diff < 2592000) return rtf.format(-Math.floor(diff / 604800), 'week')
  if (diff < 31536000) return rtf.format(-Math.floor(diff / 2592000), 'month')
  return rtf.format(-Math.floor(diff / 31536000), 'year')
}
