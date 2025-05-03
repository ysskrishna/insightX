"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { uploadImage } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { ImagePlus, X, AlertCircle, CheckCircle2 } from "lucide-react"

interface UploadZoneProps {
  onUploadSuccess: () => void
}

export function UploadZone({ onUploadSuccess }: UploadZoneProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null)

    // Filter out unsupported file types
    const supportedFiles = acceptedFiles.filter((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase()
      const supportedExtensions = ["jpg", "jpeg", "png", "webp"]
      return extension && supportedExtensions.includes(extension)
    })

    if (supportedFiles.length !== acceptedFiles.length) {
      setError("Some files were rejected. Only JPG, JPEG, PNG, and WEBP files are supported.")
    }

    setFiles((prev) => [...prev, ...supportedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 10485760, // 10MB
  })

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    setProgress(0)
    setError(null)
    setSuccess(false)

    try {
      // Upload files one by one
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        await uploadImage(file, (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          // Calculate overall progress based on current file
          const overallProgress = ((i + percentCompleted / 100) / files.length) * 100
          setProgress(overallProgress)
        })
      }

      setSuccess(true)
      setFiles([])
      onUploadSuccess()
    } catch (err) {
      setError("Failed to upload images. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-3">
            <ImagePlus className="h-12 w-12 text-gray-400" />
            <div className="space-y-1">
              <p className="text-lg font-medium">Drag and drop your images here</p>
              <p className="text-sm text-gray-500">Supports JPG, JPEG, PNG, and WEBP (max 10MB)</p>
            </div>
            <Button type="button" className="mt-2">
              Select Files
            </Button>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Selected Files ({files.length})</h3>
              {!uploading && (
                <Button variant="outline" size="sm" onClick={() => setFiles([])}>
                  Clear All
                </Button>
              )}
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                      <img
                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  {!uploading && (
                    <Button variant="ghost" size="icon" onClick={() => removeFile(index)} className="h-8 w-8">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove file</span>
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mt-4 border-green-200 bg-green-50 text-green-800">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>All images uploaded successfully!</AlertDescription>
              </Alert>
            )}

            {uploading && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <Button onClick={handleUpload} disabled={uploading || files.length === 0} className="w-full sm:w-auto">
                {uploading ? "Uploading..." : `Upload ${files.length} ${files.length === 1 ? "File" : "Files"}`}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
