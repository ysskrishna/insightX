import axios from "axios"
import type { ImageResult, PaginatedResponse } from "./types"
import config from "@/common/config"


// Fetch paginated list of images
export async function fetchImages(page = 1, limit = 10, searchTerm = ""): Promise<PaginatedResponse> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    if (searchTerm) {
      params.append("search", searchTerm)
    }

    const response = await axios.get(`${config?.apiUrl}/images/list?${params.toString()}`)
    return response.data
  } catch (error) {
    console.error("Error fetching images:", error)
    throw error
  }
}

// Fetch a single image by ID
export async function fetchImageById(imageId: number): Promise<ImageResult> {
  try {
    const response = await axios.get(`${config?.apiUrl}/images/${imageId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching image ${imageId}:`, error)
    throw error
  }
}

// Upload an image
export async function uploadImage(file: File, onProgress?: (progressEvent: any) => void): Promise<ImageResult> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await axios.post(`${config?.apiUrl}/images/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: onProgress,
    })

    return response.data
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

