export interface DetectedObject {
  class: string
  confidence: number
  box: number[] // [x1, y1, x2, y2] coordinates
}

export interface ImageResult {
  image_id: number
  name: string
  is_processed: boolean
  is_nsfw: boolean
  input_image_url: string
  detected_nsfw: any[]
  detected_objects: DetectedObject[]
  created_at: string
  updated_at: string
  output_image_url: string
}

export interface PaginatedResponse {
  page: number
  limit: number
  total: number
  data: ImageResult[]
}
