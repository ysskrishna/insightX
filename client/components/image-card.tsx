import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Eye, RefreshCw } from "lucide-react"
import { ObjectBadge } from "@/components/object-badge"
import { ImageResult } from "@/lib/types"
import { getObjectBadges, getRelativeTime, truncateText } from "@/lib/utils"
import { ProcessingStatusBadge } from "@/components/processing-status-badge"

interface ImageCardProps {
  image: ImageResult
  onRefresh: (imageId: number) => Promise<void>
  isRefreshing: boolean
}

export function ImageCard({ image, onRefresh, isRefreshing }: ImageCardProps) {
  return (
    <Card className="flex flex-col h-full p-0 overflow-hidden">
      {/* Image at the top */}
      <div className="relative w-full h-48 bg-gray-100">
        <Image
          src={image.input_image_url || "/placeholder.svg"}
          alt={image.name}
          fill
          className="object-cover w-full h-full rounded-t-lg"
          style={{ objectFit: 'cover' }}
        />
      </div>
      {/* Card Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Title */}
        <div className="font-extrabold text-xl leading-tight break-all mb-1">{truncateText(image.name, 40)}</div>
        <div className="flex flex-row items-center gap-2 mb-2">
          {image.is_nsfw && (
            <Badge variant="destructive">NSFW</Badge>
          )}
          <ProcessingStatusBadge isProcessed={image.is_processed} />
        </div>
        {/* Object Badges */}
        {image.is_processed ? (
          <div className="flex flex-wrap gap-2">
            {getObjectBadges(image.detected_objects).map(({ title, count }) => (
              <ObjectBadge key={title} title={title} count={count} />
            ))}
          </div>
        ) : null}


        {/* Relative Time and Actions in one row at the bottom */}
        <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{getRelativeTime(image.created_at)}</span>
            <div className="flex gap-2">
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onRefresh(image.image_id)}
                disabled={isRefreshing}
            >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="sr-only">Refresh details</span>
            </Button>
            <Link href={`/${image.image_id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                <Eye className="h-4 w-4" />
                <span className="sr-only">View details</span>
                </Button>
            </Link>
            </div>
        </div>
      </div>


    </Card>
  )
} 