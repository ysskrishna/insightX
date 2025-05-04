import { Badge } from "@/components/ui/badge"

interface ProcessingStatusBadgeProps {
  isProcessed: boolean
  className?: string
}

export function ProcessingStatusBadge({ isProcessed, className = "" }: ProcessingStatusBadgeProps) {
  return (
    <Badge className={`bg-black text-white font-semibold rounded px-2 py-1 ${className}`}>
      {isProcessed ? "Processed" : "Processing ... "}
    </Badge>
  )
} 