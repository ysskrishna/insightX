"use client"

import { useState, useEffect } from "react"
import { UploadZone } from "@/components/upload-zone"
import { ResultsTable } from "@/components/results-table"
import { Pagination } from "@/components/pagination"
import { SearchFilter } from "@/components/search-filter"
import { fetchImages, deleteImage } from "@/lib/api"
import type { ImageResult } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [images, setImages] = useState<ImageResult[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<{
    field: keyof ImageResult | null
    direction: "asc" | "desc"
  }>({ field: "created_at", direction: "desc" })
  const { toast } = useToast()

  const loadImages = async () => {
    try {
      setLoading(true)
      const response = await fetchImages(page, limit, searchTerm)
      setImages(response.data)
      setTotal(response.total)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadImages()
  }, [page, limit, searchTerm])

  const handleUploadSuccess = () => {
    loadImages()
    toast({
      title: "Success",
      description: "Image uploaded successfully.",
    })
  }

  const handleDelete = async (imageId: number) => {
    try {
      await deleteImage(imageId)
      toast({
        title: "Success",
        description: "Image deleted successfully.",
      })
      loadImages()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete image. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setPage(1) // Reset to first page when changing limit
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setPage(1) // Reset to first page when searching
  }

  const handleSort = (field: keyof ImageResult) => {
    setSortBy((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  const sortedImages = [...images].sort((a, b) => {
    if (!sortBy.field) return 0

    const aValue = a[sortBy.field]
    const bValue = b[sortBy.field]

    if (aValue === bValue) return 0

    const comparison = aValue < bValue ? -1 : 1
    return sortBy.direction === "asc" ? comparison : -comparison
  })

  return (
      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="mb-8">
          <UploadZone onUploadSuccess={handleUploadSuccess} />
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <SearchFilter onSearch={handleSearch} />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">Loading images...</span>
            </div>
          ) : (
            <>
              <ResultsTable images={sortedImages} onDelete={handleDelete} onSort={handleSort} sortConfig={sortBy} />

              <div className="mt-6">
                <Pagination
                  currentPage={page}
                  totalPages={Math.ceil(total / limit)}
                  onPageChange={handlePageChange}
                  limit={limit}
                  onLimitChange={handleLimitChange}
                  total={total}
                />
              </div>
            </>
          )}
        </section>
      </main>
  )
}
