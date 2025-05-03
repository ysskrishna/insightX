"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import type { DetectedObject } from "@/lib/types"

interface ObjectDetectionViewerProps {
  imageUrl: string
  detectedObjects: DetectedObject[]
}

export function ObjectDetectionViewer({ imageUrl, detectedObjects }: ObjectDetectionViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [hoveredObject, setHoveredObject] = useState<DetectedObject | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Generate random colors for each unique class
  const colorMap = useRef<Record<string, string>>({})

  useEffect(() => {
    detectedObjects.forEach((obj) => {
      if (!colorMap.current[obj.class]) {
        // Generate a random vibrant color
        const hue = Math.floor(Math.random() * 360)
        colorMap.current[obj.class] = `hsl(${hue}, 70%, 50%)`
      }
    })
  }, [detectedObjects])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set initial dimensions for the canvas
    canvas.width = 600
    canvas.height = 400
    setDimensions({ width: 600, height: 400 })

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Create a placeholder image with detected objects
    ctx.fillStyle = "#f3f4f6" // Light gray background
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add some text to indicate this is a placeholder
    ctx.fillStyle = "#9ca3af"
    ctx.font = "16px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Placeholder Image with Object Detection", canvas.width / 2, 30)

    // Draw bounding boxes for detected objects
    detectedObjects.forEach((obj) => {
      const [x1, y1, x2, y2] = obj.box
      const width = x2 - x1
      const height = y2 - y1

      const color = colorMap.current[obj.class] || "hsl(0, 70%, 50%)"

      // Draw rectangle
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.strokeRect(x1, y1, width, height)

      // Draw label background
      ctx.fillStyle = color
      const textMetrics = ctx.measureText(obj.class)
      const textHeight = 20
      ctx.fillRect(x1, y1 - textHeight, textMetrics.width + 10, textHeight)

      // Draw label text
      ctx.fillStyle = "white"
      ctx.font = "14px Arial"
      ctx.textAlign = "left"
      ctx.fillText(obj.class, x1 + 5, y1 - 5)
    })

    setImageLoaded(true)
  }, [imageUrl, detectedObjects])

  // Handle mouse movement to highlight objects
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    // Check if mouse is over any object
    let foundObject = null
    for (const obj of detectedObjects) {
      const [x1, y1, x2, y2] = obj.box
      if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
        foundObject = obj
        break
      }
    }

    setHoveredObject(foundObject)
  }

  return (
    <div className="relative w-full h-full">
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <p>Loading image...</p>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredObject(null)}
      />

      {hoveredObject && (
        <div className="absolute bottom-2 left-2 bg-black/70 text-white p-2 rounded text-sm">
          <div className="font-medium capitalize">{hoveredObject.class}</div>
          <div>Confidence: {Math.round(hoveredObject.confidence * 100)}%</div>
        </div>
      )}
    </div>
  )
}
