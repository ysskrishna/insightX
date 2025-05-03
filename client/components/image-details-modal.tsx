"use client"

import Image from "next/image"
import type { ImageResult } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from "@/lib/utils"
import { ObjectDetectionViewer } from "@/components/object-detection-viewer"

interface ImageDetailsModalProps {
  image: ImageResult
  onClose: () => void
}

export function ImageDetailsModal({ image, onClose }: ImageDetailsModalProps) {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{image.name}</span>
            <div className="flex gap-2">
              <Badge variant={image.is_processed ? "success" : "secondary"}>
                {image.is_processed ? "Processed" : "Processing"}
              </Badge>
              {image.is_nsfw && <Badge variant="destructive">NSFW</Badge>}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Tabs defaultValue="processed" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="processed">Processed Image</TabsTrigger>
                <TabsTrigger value="original">Original Image</TabsTrigger>
              </TabsList>
              <TabsContent value="processed" className="mt-4">
                {image.is_processed ? (
                  <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
                    <ObjectDetectionViewer imageUrl={image.output_image_url} detectedObjects={image.detected_objects} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md">
                    <p>Processing image...</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="original" className="mt-4">
                <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
                  <Image
                    src={image.input_image_url || "/placeholder.svg"}
                    alt={image.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Upload Date</h3>
                <p className="mt-1 text-sm">{formatDate(image.created_at)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Image ID</h3>
                <p className="mt-1 text-sm">{image.image_id}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Detected Objects</h3>
                {image.detected_objects.length > 0 ? (
                  <ul className="space-y-2">
                    {image.detected_objects.map((object, index) => (
                      <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md text-sm">
                        <span className="capitalize">{object.class}</span>
                        <Badge variant="outline" className="bg-white">
                          {Math.round(object.confidence * 100)}%
                        </Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No objects detected</p>
                )}
              </div>

              {image.detected_nsfw && image.detected_nsfw.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">NSFW Detection</h3>
                  <ul className="space-y-2">
                    {image.detected_nsfw.map((item: any, index: number) => (
                      <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md text-sm">
                        <span className="capitalize">{item.class}</span>
                        <Badge variant="outline" className="bg-white">
                          {Math.round(item.confidence * 100)}%
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-6">
              <Button variant="outline" className="w-full" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
