import { cn } from "@/lib/utils"

interface ObjectBadgeProps {
  title: string
  count: number
  className?: string
}

export function ObjectBadge({ title, count, className }: ObjectBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-center rounded-full bg-white border border-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700 shadow-sm gap-2",
        className
      )}
    >
      <span className="capitalize">{title}</span>
      <span className="flex items-center justify-center bg-blue-500 text-white rounded-full w-5 h-5 text-xs font-bold border-2 border-white shadow">
        {count}
      </span>
    </div>
  )
} 