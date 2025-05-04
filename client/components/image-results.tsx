import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import type { ImageResult } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getRelativeTime, truncateText, getObjectBadges } from "@/lib/utils"
import { Eye, RefreshCw } from "lucide-react"
import { fetchImageById } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { ObjectBadge } from "@/components/object-badge"
import { useIsMobile } from "@/hooks/use-mobile"
import { ImageCard } from "@/components/image-card"
import { ProcessingStatusBadge } from "@/components/processing-status-badge"

interface ImageResultsProps {
  images: ImageResult[]
  onImageUpdate?: (updatedImage: ImageResult) => void
  onSort?: (field: keyof ImageResult) => void
  sortConfig?: {
    field: keyof ImageResult | null
    direction: "asc" | "desc"
  }
  viewMode?: "table" | "card"
}

export function ImageResults({ images, onImageUpdate, onSort, sortConfig, viewMode = "table" }: ImageResultsProps) {
  const [refreshingIds, setRefreshingIds] = useState<Set<number>>(new Set())
  const { toast } = useToast()
  const isMobile = useIsMobile()

  const handleRefresh = async (imageId: number) => {
    try {
      setRefreshingIds(prev => new Set(prev).add(imageId))
      const updatedImage = await fetchImageById(imageId)
      onImageUpdate?.(updatedImage)
      toast({
        title: "Success",
        description: "Image details refreshed successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh image details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setRefreshingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(imageId)
        return newSet
      })
    }
  }

  if (images.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-lg font-medium mb-2">No images found</h3>
        <p className="text-gray-500 mb-4">Upload some images to get started</p>
      </Card>
    )
  }

  // Card layout for mobile/tablet or when viewMode is 'card'
  if (isMobile || viewMode === "card") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <ImageCard
            key={image.image_id}
            image={image}
            onRefresh={handleRefresh}
            isRefreshing={refreshingIds.has(image.image_id)}
          />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Objects</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {images.map((image) => (
              <TableRow key={image.image_id}>
                <TableCell>
                  <div className="relative h-10 w-10 rounded-md overflow-hidden bg-gray-100">
                    <Image
                      src={image.input_image_url || "/placeholder.png"}
                      alt={image.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{truncateText(image.name, 20)}</div>
                  {image.is_nsfw && (
                    <Badge variant="destructive" className="mt-1">
                      NSFW
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <ProcessingStatusBadge isProcessed={image.is_processed} />
                </TableCell>
                <TableCell>
                  {image.is_processed ? (
                    <div className="flex flex-wrap gap-2">
                      {getObjectBadges(image.detected_objects).map(({ title, count }) => (
                        <ObjectBadge
                          key={title}
                          title={title}
                          count={count}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">-</div>
                  )}
                </TableCell>
                <TableCell>{getRelativeTime(image.created_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleRefresh(image.image_id)}
                      disabled={refreshingIds.has(image.image_id)}
                    >
                      <RefreshCw className={`h-4 w-4 ${refreshingIds.has(image.image_id) ? 'animate-spin' : ''}`} />
                      <span className="sr-only">Refresh details</span>
                    </Button>
                    <Link href={`/${image.image_id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
