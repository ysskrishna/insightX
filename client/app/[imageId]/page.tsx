"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { fetchImageById } from "@/lib/api"
import type { ImageResult } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatDate, getObjectBadges } from "@/lib/utils"
import { ObjectBadge } from "@/components/object-badge"
import { ProcessingStatusBadge } from "@/components/processing-status-badge"

export default function ImageDetailsPage({ params }: { params: { imageId: string } }) {
  const [image, setImage] = useState<ImageResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const imageId = Number.parseInt(params.imageId)

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      const data = await fetchImageById(imageId)
      setImage(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh image details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true)
        const data = await fetchImageById(imageId)
        setImage(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load image details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (imageId) {
      loadImage()
    }
  }, [imageId, toast])

  if (loading) {
    return (
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg">Loading image details...</p>
          </div>
        </main>
    )
  }

  if (!image) {
    return (
        <main className="flex-1 container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to images
          </Button>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">Image not found or has been deleted.</p>
                <Button onClick={() => router.push("/")} className="mt-4">
                  Return to home
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
    )
  }

  return (
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to images
        </Button>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">Image Details</CardTitle>
                  <div className="flex gap-2 items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleRefresh}
                      disabled={refreshing}
                    >
                      <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                      <span className="sr-only">Refresh details</span>
                    </Button>
                    <ProcessingStatusBadge isProcessed={image.is_processed} />
                    {image.is_nsfw && <Badge variant="destructive">NSFW</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="processed" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="processed">Processed Image</TabsTrigger>
                    <TabsTrigger value="original">Original Image</TabsTrigger>
                  </TabsList>
                  <TabsContent value="processed" className="mt-4">
                    {image.is_processed ? (
                      <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
                        <Image
                          src={image.output_image_url}
                          alt={image.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md">
                        <div className="flex flex-col items-center">
                          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                          <p>Processing image...</p>
                        </div>
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
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Image Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">File Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{image.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Upload Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(image.created_at)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(image.updated_at)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Image ID</dt>
                    <dd className="mt-1 text-sm text-gray-900">{image.image_id}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-xl">Detected Objects</CardTitle>
              </CardHeader>
              <CardContent>
                {image.detected_objects.length > 0 ? (
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
                  <p className="text-sm text-gray-500">No objects detected</p>
                )}
              </CardContent>
            </Card>

            {image.detected_nsfw && image.detected_nsfw.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-xl">NSFW Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {image.detected_nsfw.map((item: any, index: number) => (
                      <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <span className="font-medium capitalize">{item.class}</span>
                        <Badge variant="outline" className="bg-white">
                          {Math.round(item.confidence * 100)}%
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
  )
}
