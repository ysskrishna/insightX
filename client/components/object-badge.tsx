import { cn } from "@/lib/utils"

interface ObjectBadgeProps {
  title: string
  count?: number
  className?: string
}

export function ObjectBadge({ title, count, className }: ObjectBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-black gap-2",
        className
      )}
    >
      <span className="capitalize text-black">{title}</span>
      {count && (
        <span className="flex items-center justify-center bg-black text-white rounded-full w-5 h-5 text-xs font-bold">
          {count}
        </span>
      )}
    </div>
  )
} 