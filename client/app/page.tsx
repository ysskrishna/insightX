"use client"

import { useState, useEffect } from "react"
import { UploadZone } from "@/components/upload-zone"
import { ResultsTable } from "@/components/results-table"
import { Pagination } from "@/components/pagination"
import { SearchFilter } from "@/components/search-filter"
import { fetchImages } from "@/lib/api"
import type { ImageResult } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"

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
  const isMobile = useIsMobile()
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table')

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

          {/* Toggle for desktop only */}
          {!isMobile && (
            <div className="flex justify-end mb-4">
              <div className="inline-flex rounded-md shadow-sm border border-gray-200 bg-gray-50">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  className={viewMode === 'table' ? 'rounded-l-md' : 'rounded-l-md'}
                  onClick={() => setViewMode('table')}
                >
                  Table View
                </Button>
                <Button
                  variant={viewMode === 'card' ? 'default' : 'ghost'}
                  size="sm"
                  className={viewMode === 'card' ? 'rounded-r-md' : 'rounded-r-md'}
                  onClick={() => setViewMode('card')}
                >
                  Card View
                </Button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">Loading images...</span>
            </div>
          ) : (
            <>
              <ResultsTable 
                images={sortedImages} 
                onSort={handleSort} 
                sortConfig={sortBy}
                onImageUpdate={(updatedImage) => {
                  setImages(prevImages => 
                    prevImages.map(img => 
                      img.image_id === updatedImage.image_id ? updatedImage : img
                    )
                  )
                }}
                viewMode={isMobile ? 'card' : viewMode}
              />

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
