"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import type { ImageResult } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ImageDetailsModal } from "@/components/image-details-modal"
import { formatDate, truncateText } from "@/lib/utils"
import { ArrowUpDown, Eye, MoreHorizontal, Trash2 } from "lucide-react"

interface ResultsTableProps {
  images: ImageResult[]
  onDelete: (imageId: number) => Promise<void>
  onSort: (field: keyof ImageResult) => void
  sortConfig: {
    field: keyof ImageResult | null
    direction: "asc" | "desc"
  }
}

export function ResultsTable({ images, onDelete, onSort, sortConfig }: ResultsTableProps) {
  const [selectedImage, setSelectedImage] = useState<ImageResult | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const handleDelete = async (imageId: number) => {
    await onDelete(imageId)
    setDeleteConfirm(null)
  }

  const renderSortIcon = (field: keyof ImageResult) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    return <ArrowUpDown className={`ml-2 h-4 w-4 ${sortConfig.field === field ? "text-primary" : ""}`} />
  }

  if (images.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-lg font-medium mb-2">No images found</h3>
        <p className="text-gray-500 mb-4">Upload some images to get started</p>
      </Card>
    )
  }

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => onSort("name")}
                  className="font-medium flex items-center p-0 h-auto"
                >
                  Name {renderSortIcon("name")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => onSort("is_processed")}
                  className="font-medium flex items-center p-0 h-auto"
                >
                  Status {renderSortIcon("is_processed")}
                </Button>
              </TableHead>
              <TableHead>Objects</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => onSort("created_at")}
                  className="font-medium flex items-center p-0 h-auto"
                >
                  Date {renderSortIcon("created_at")}
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {images.map((image) => (
              <TableRow key={image.image_id}>
                <TableCell>
                  <div className="relative h-10 w-10 rounded-md overflow-hidden bg-gray-100">
                    <Image
                      src={image.input_image_url || "/placeholder.svg"}
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
                  <Badge variant={image.is_processed ? "success" : "secondary"}>
                    {image.is_processed ? "Processed" : "Processing"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {image.is_processed ? (
                    <span>{image.detected_objects.length} objects</span>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </TableCell>
                <TableCell>{formatDate(image.created_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <Link href={`/${image.image_id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/${image.image_id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteConfirm(image.image_id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedImage && <ImageDetailsModal image={selectedImage} onClose={() => setSelectedImage(null)} />}

      <Dialog
        open={deleteConfirm !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirm(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
