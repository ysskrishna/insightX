import type { ImageResult, PaginatedResponse } from "./types"

// Generate a set of mock images for testing
export const mockImages: ImageResult[] = [
  {
    image_id: 1,
    name: "city_street.jpg",
    is_processed: true,
    is_nsfw: false,
    input_image_url: "/placeholder.svg?height=400&width=600",
    detected_nsfw: [],
    detected_objects: [
      {
        class: "person",
        confidence: 0.92,
        box: [120, 100, 220, 350],
      },
      {
        class: "car",
        confidence: 0.88,
        box: [300, 200, 500, 300],
      },
      {
        class: "bicycle",
        confidence: 0.76,
        box: [50, 250, 150, 350],
      },
    ],
    created_at: "2025-05-01T14:32:10.006323",
    updated_at: "2025-05-01T14:32:15.962234",
    output_image_url: "/placeholder.svg?height=400&width=600",
  },
  {
    image_id: 2,
    name: "beach_sunset.png",
    is_processed: true,
    is_nsfw: false,
    input_image_url: "/placeholder.svg?height=400&width=600",
    detected_nsfw: [],
    detected_objects: [
      {
        class: "person",
        confidence: 0.85,
        box: [200, 150, 300, 400],
      },
      {
        class: "umbrella",
        confidence: 0.79,
        box: [350, 100, 450, 200],
      },
    ],
    created_at: "2025-05-02T09:44:42.006323",
    updated_at: "2025-05-02T09:44:47.962234",
    output_image_url: "/placeholder.svg?height=400&width=600",
  },
  {
    image_id: 3,
    name: "office_meeting.jpg",
    is_processed: true,
    is_nsfw: false,
    input_image_url: "/placeholder.svg?height=400&width=600",
    detected_nsfw: [],
    detected_objects: [
      {
        class: "person",
        confidence: 0.94,
        box: [100, 120, 200, 350],
      },
      {
        class: "person",
        confidence: 0.91,
        box: [250, 120, 350, 350],
      },
      {
        class: "laptop",
        confidence: 0.87,
        box: [180, 250, 280, 300],
      },
      {
        class: "chair",
        confidence: 0.82,
        box: [120, 200, 180, 380],
      },
    ],
    created_at: "2025-05-03T11:22:33.006323",
    updated_at: "2025-05-03T11:22:38.962234",
    output_image_url: "/placeholder.svg?height=400&width=600",
  },
  {
    image_id: 4,
    name: "park_picnic.webp",
    is_processed: true,
    is_nsfw: false,
    input_image_url: "/placeholder.svg?height=400&width=600",
    detected_nsfw: [],
    detected_objects: [
      {
        class: "person",
        confidence: 0.89,
        box: [150, 100, 250, 350],
      },
      {
        class: "dog",
        confidence: 0.86,
        box: [300, 250, 380, 320],
      },
      {
        class: "tree",
        confidence: 0.92,
        box: [50, 50, 150, 400],
      },
    ],
    created_at: "2025-05-04T15:10:22.006323",
    updated_at: "2025-05-04T15:10:27.962234",
    output_image_url: "/placeholder.svg?height=400&width=600",
  },
  {
    image_id: 5,
    name: "kitchen_cooking.jpg",
    is_processed: false,
    is_nsfw: false,
    input_image_url: "/placeholder.svg?height=400&width=600",
    detected_nsfw: [],
    detected_objects: [],
    created_at: "2025-05-05T08:45:12.006323",
    updated_at: "2025-05-05T08:45:12.006323",
    output_image_url: "",
  },
  {
    image_id: 6,
    name: "concert_crowd.png",
    is_processed: true,
    is_nsfw: false,
    input_image_url: "/placeholder.svg?height=400&width=600",
    detected_nsfw: [],
    detected_objects: [
      {
        class: "person",
        confidence: 0.95,
        box: [100, 150, 180, 350],
      },
      {
        class: "person",
        confidence: 0.93,
        box: [200, 150, 280, 350],
      },
      {
        class: "person",
        confidence: 0.91,
        box: [300, 150, 380, 350],
      },
      {
        class: "microphone",
        confidence: 0.84,
        box: [250, 100, 270, 130],
      },
    ],
    created_at: "2025-05-06T19:30:42.006323",
    updated_at: "2025-05-06T19:30:47.962234",
    output_image_url: "/placeholder.svg?height=400&width=600",
  },
  {
    image_id: 7,
    name: "nsfw_content.jpg",
    is_processed: true,
    is_nsfw: true,
    input_image_url: "/placeholder.svg?height=400&width=600",
    detected_nsfw: [
      {
        class: "explicit_content",
        confidence: 0.89,
      },
    ],
    detected_objects: [
      {
        class: "person",
        confidence: 0.97,
        box: [150, 100, 350, 400],
      },
    ],
    created_at: "2025-05-07T12:15:22.006323",
    updated_at: "2025-05-07T12:15:27.962234",
    output_image_url: "/placeholder.svg?height=400&width=600",
  },
  {
    image_id: 8,
    name: "airport_terminal.jpg",
    is_processed: true,
    is_nsfw: false,
    input_image_url: "/placeholder.svg?height=400&width=600",
    detected_nsfw: [],
    detected_objects: [
      {
        class: "person",
        confidence: 0.88,
        box: [120, 150, 200, 350],
      },
      {
        class: "suitcase",
        confidence: 0.82,
        box: [220, 300, 280, 350],
      },
      {
        class: "chair",
        confidence: 0.79,
        box: [300, 250, 350, 350],
      },
    ],
    created_at: "2025-05-08T07:20:12.006323",
    updated_at: "2025-05-08T07:20:17.962234",
    output_image_url: "/placeholder.svg?height=400&width=600",
  },
  {
    image_id: 9,
    name: "restaurant_dinner.webp",
    is_processed: true,
    is_nsfw: false,
    input_image_url: "/placeholder.svg?height=400&width=600",
    detected_nsfw: [],
    detected_objects: [
      {
        class: "person",
        confidence: 0.91,
        box: [100, 150, 200, 350],
      },
      {
        class: "wine glass",
        confidence: 0.87,
        box: [250, 200, 280, 250],
      },
      {
        class: "fork",
        confidence: 0.76,
        box: [220, 250, 240, 280],
      },
      {
        class: "plate",
        confidence: 0.94,
        box: [200, 250, 300, 300],
      },
    ],
    created_at: "2025-05-09T20:45:32.006323",
    updated_at: "2025-05-09T20:45:37.962234",
    output_image_url: "/placeholder.svg?height=400&width=600",
  },
  {
    image_id: 10,
    name: "gym_workout.jpg",
    is_processed: true,
    is_nsfw: false,
    input_image_url: "/placeholder.svg?height=400&width=600",
    detected_nsfw: [],
    detected_objects: [
      {
        class: "person",
        confidence: 0.96,
        box: [150, 100, 300, 400],
      },
      {
        class: "dumbbell",
        confidence: 0.89,
        box: [320, 250, 380, 280],
      },
    ],
    created_at: "2025-05-10T16:30:22.006323",
    updated_at: "2025-05-10T16:30:27.962234",
    output_image_url: "/placeholder.svg?height=400&width=600",
  },
]

// Function to filter and paginate mock data
export function getMockPaginatedImages(page: number, limit: number, searchTerm = ""): PaginatedResponse {
  // Filter by search term if provided
  let filteredImages = [...mockImages]
  if (searchTerm) {
    const term = searchTerm.toLowerCase()
    filteredImages = filteredImages.filter((img) => img.name.toLowerCase().includes(term))
  }

  // Calculate pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedData = filteredImages.slice(startIndex, endIndex)

  return {
    page,
    limit,
    total: filteredImages.length,
    data: paginatedData,
  }
}

// Function to get a single mock image by ID
export function getMockImageById(imageId: number): ImageResult | undefined {
  return mockImages.find((img) => img.image_id === imageId)
}
