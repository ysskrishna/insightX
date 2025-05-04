"use client"

import { useState, useCallback, useRef } from "react"
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
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const startUpload = async (file: File) => {
    setUploading(true)
    setProgress(0)
    setError(null)
    setSuccess(false)
    try {
      await uploadImage(file, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        setProgress(percentCompleted)
      })
      setSuccess(true)
      onUploadSuccess()
      setTimeout(() => {
        setFile(null)
        setUploading(false)
        setProgress(0)
        setSuccess(false)
      }, 2000)
    } catch (err) {
      setError("Failed to upload image. Please try again.")
      setUploading(false)
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null)
    setSuccess(false)
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      const extension = file.name.split(".").pop()?.toLowerCase()
      const supportedExtensions = ["jpg", "jpeg", "png", "webp"]
      if (extension && supportedExtensions.includes(extension)) {
        setFile(file)
        startUpload(file)
      } else {
        setError("Only JPG, JPEG, PNG, and WEBP files are supported.")
      }
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected: (rejectedFiles) => {
      const file = rejectedFiles[0]
      const error = file.errors[0]
      console.log('Drop rejected:', error.code)
      
      switch (error.code) {
        case 'file-too-large':
          setError("File is too large. Maximum size is 10MB.")
          break
        case 'file-invalid-type':
          setError("Invalid file type. Only JPG, JPEG, PNG, and WEBP files are supported.")
          break
        case 'too-many-files':
          setError("Too many files. Please upload only one file at a time.")
          break
        case 'file-too-small':
          setError("File is too small.")
          break
        default:
          setError("An error occurred while uploading the file. Please try again.")
      }
    },
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 10485760, // 10MB
    multiple: false,
    disabled: uploading
  })

  const handleRemove = () => {
    setFile(null)
    setUploading(false)
    setProgress(0)
    setError(null)
    setSuccess(false)
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!file && (
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
                <p className="text-lg font-medium">Drag and drop your image here</p>
                <p className="text-sm text-gray-500">Supports JPG, JPEG, PNG, and WEBP (max 10MB)</p>
              </div>
              <Button type="button" className="mt-2">
                Select File
              </Button>
            </div>
          </div>
        )}

        {file && (
          <div className="mt-6">
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleRemove} className="h-8 w-8" disabled={uploading}>
                <X className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
              </Button>
            </div>

            {success && (
              <Alert className="mt-4 border-green-200 bg-green-50 text-green-800">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>Image uploaded successfully!</AlertDescription>
              </Alert>
            )}

            {uploading && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
