import axios from "axios"
import type { ImageResult, PaginatedResponse } from "./types"
import { getMockPaginatedImages, getMockImageById } from "./mock-data"

const API_BASE_URL = "http://localhost:8000"

// Flag to use mock data instead of real API
const USE_MOCK_DATA = true

// Fetch paginated list of images
export async function fetchImages(page = 1, limit = 10, searchTerm = ""): Promise<PaginatedResponse> {
  if (USE_MOCK_DATA) {
    // Return mock data with a small delay to simulate network request
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getMockPaginatedImages(page, limit, searchTerm))
      }, 500)
    })
  }

  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    if (searchTerm) {
      params.append("search", searchTerm)
    }

    const response = await axios.get(`${API_BASE_URL}/images/list?${params.toString()}`)
    return response.data
  } catch (error) {
    console.error("Error fetching images:", error)
    throw error
  }
}

// Fetch a single image by ID
export async function fetchImageById(imageId: number): Promise<ImageResult> {
  if (USE_MOCK_DATA) {
    // Return mock data with a small delay to simulate network request
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const image = getMockImageById(imageId)
        if (image) {
          resolve(image)
        } else {
          reject(new Error(`Image with ID ${imageId} not found`))
        }
      }, 500)
    })
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/images/${imageId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching image ${imageId}:`, error)
    throw error
  }
}

// Upload an image
export async function uploadImage(file: File, onProgress?: (progressEvent: any) => void): Promise<ImageResult> {
  if (USE_MOCK_DATA) {
    // Simulate upload progress
    let progress = 0
    const progressInterval = setInterval(() => {
      progress += 10
      if (onProgress) {
        onProgress({ loaded: progress, total: 100 })
      }
      if (progress >= 100) {
        clearInterval(progressInterval)
      }
    }, 300)

    // Return a new mock image after a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const newImage: ImageResult = {
          image_id: Math.floor(Math.random() * 1000) + 100,
          name: file.name,
          is_processed: false, // Initially not processed
          is_nsfw: false,
          input_image_url: "/placeholder.svg?height=400&width=600",
          detected_nsfw: [],
          detected_objects: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          output_image_url: "",
        }

        // Simulate processing completion after another delay
        setTimeout(() => {
          newImage.is_processed = true
          newImage.output_image_url = "/placeholder.svg?height=400&width=600"
          newImage.detected_objects = [
            {
              class: "person",
              confidence: 0.85 + Math.random() * 0.1,
              box: [100, 100, 200, 300],
            },
            {
              class: "car",
              confidence: 0.75 + Math.random() * 0.1,
              box: [300, 200, 450, 280],
            },
          ]
          newImage.updated_at = new Date().toISOString()
        }, 3000)

        resolve(newImage)
      }, 2000)
    })
  }

  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await axios.post(`${API_BASE_URL}/images/upload`, formData, {
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

// Delete an image
export async function deleteImage(imageId: number): Promise<void> {
  if (USE_MOCK_DATA) {
    // Simulate delete with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Mock delete image with ID: ${imageId}`)
        resolve()
      }, 500)
    })
  }

  try {
    await axios.delete(`${API_BASE_URL}/images/${imageId}`)
  } catch (error) {
    console.error(`Error deleting image ${imageId}:`, error)
    throw error
  }
}
