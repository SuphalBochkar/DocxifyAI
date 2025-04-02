"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  FileImage,
  FileIcon as FilePdf,
  FileType,
  Eye,
  Download,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"

export const DocumentUpload = () => {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("upload")

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Simulate progress during upload
  const simulateProgress = () => {
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + 5
      })
    }, 200)

    return () => clearInterval(interval)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0]
      setFile(selectedFile)
      setMessage("")
      setMessageType("")

      // Create preview URL for supported file types
      if (selectedFile.type.startsWith("image/")) {
        const url = URL.createObjectURL(selectedFile)
        setPreviewUrl(url)
      } else if (selectedFile.type === "application/pdf") {
        const url = URL.createObjectURL(selectedFile)
        setPreviewUrl(url)
      } else {
        setPreviewUrl(null)
      }
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      setFile(droppedFile)
      setMessage("")
      setMessageType("")

      // Create preview URL for supported file types
      if (droppedFile.type.startsWith("image/")) {
        const url = URL.createObjectURL(droppedFile)
        setPreviewUrl(url)
      } else if (droppedFile.type === "application/pdf") {
        const url = URL.createObjectURL(droppedFile)
        setPreviewUrl(url)
      } else {
        setPreviewUrl(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload.")
      setMessageType("error")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    setUploading(true)
    setMessage("")
    setMessageType("")

    // Start progress simulation
    const clearProgressSimulation = simulateProgress()

    try {
      const response = await fetch("http://localhost:3000/api/v1/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      // Complete progress
      setUploadProgress(100)

      if (response.ok) {
        setMessage(`Upload successful: ${data.document.url}`)
        setMessageType("success")
        // Switch to preview tab after successful upload
        setActiveTab("preview")
      } else {
        setMessage(`Error: ${data.error || "Upload failed"}`)
        setMessageType("error")
      }
    } catch (error) {
      setMessage("Upload failed. Check console for details.")
      setMessageType("error")
      console.error("Upload error:", error)
    } finally {
      // Clear progress simulation if it's still running
      clearProgressSimulation()
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setFile(null)
    setMessage("")
    setMessageType("")
    setPreviewUrl(null)
    setUploadProgress(0)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getFileIcon = () => {
    if (!file) return <FileText className="h-6 w-6" />

    if (file.type.startsWith("image/")) {
      return <FileImage className="h-6 w-6" />
    } else if (file.type === "application/pdf") {
      return <FilePdf className="h-6 w-6" />
    } else if (file.type.includes("word") || file.type.includes("doc")) {
      return <FileText className="h-6 w-6" />
    } else {
      return <FileType className="h-6 w-6" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="upload" className="text-base">
            <Upload className="mr-2 h-4 w-4" /> Upload Document
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={!file} className="text-base">
            <Eye className="mr-2 h-4 w-4" /> Preview Document
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card className="border-slate-200 shadow-md">
            <CardContent className="p-6">
              {/* Drag & Drop Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${
                  dragActive ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {!file ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="h-10 w-10 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-slate-800 mb-2">Drag & drop your document here</h3>
                      <p className="text-slate-600 mb-4">or</p>
                      <Button
                        variant="outline"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Browse Files
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </div>
                    <p className="text-sm text-slate-500 mt-4">Supported formats: PDF, DOC, DOCX, JPG, PNG</p>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="flex items-center justify-center">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                        {getFileIcon()}
                      </div>
                    </div>

                    <div className="max-w-md mx-auto">
                      <h3 className="text-lg font-medium text-slate-800 mb-2 truncate">{file.name}</h3>

                      <div className="flex flex-wrap justify-center gap-3 mb-4">
                        <Badge variant="outline" className="text-slate-600 bg-slate-50">
                          {file.type || "Unknown type"}
                        </Badge>
                        <Badge variant="outline" className="text-slate-600 bg-slate-50">
                          {formatFileSize(file.size)}
                        </Badge>
                        <Badge variant="outline" className="text-slate-600 bg-slate-50">
                          Last modified: {new Date(file.lastModified).toLocaleDateString()}
                        </Badge>
                      </div>

                      {uploading ? (
                        <div className="space-y-2">
                          <Progress value={uploadProgress} className="h-2" />
                          <p className="text-sm text-slate-600 text-center">Uploading... {uploadProgress}%</p>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-3">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={handleRemove}
                                  className="border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Remove file</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          {previewUrl && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setActiveTab("preview")}
                                    className="border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200"
                                  >
                                    <Eye className="h-5 w-5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Preview file</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Upload Button */}
              {file && !uploading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="mt-6 flex justify-center"
                >
                  <Button onClick={handleUpload} className="bg-blue-600 hover:bg-blue-700 text-white px-8" size="lg">
                    Upload Document
                  </Button>
                </motion.div>
              )}

              {/* Upload Status Message */}
              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6"
                  >
                    <Alert
                      variant={messageType === "error" ? "destructive" : "default"}
                      className={messageType === "success" ? "border-green-200 bg-green-50" : ""}
                    >
                      {messageType === "success" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : messageType === "error" ? (
                        <AlertCircle className="h-4 w-4" />
                      ) : null}
                      <AlertDescription className={messageType === "success" ? "text-green-600" : ""}>
                        {message}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-slate-800 mb-4">Document Processing Instructions</h3>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Upload your document in PDF, DOC, DOCX, or image format</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Our AI will automatically extract and structure the data</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Review the extracted data and use our AI assistant to fill any gaps</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Download the structured data in JSON format or integrate with your systems</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card className="border-slate-200 shadow-md">
            <CardContent className="p-6">
              {file && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                        {getFileIcon()}
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-800 truncate max-w-md">{file.name}</h3>
                        <p className="text-sm text-slate-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab("upload")}
                        className="border-slate-200"
                      >
                        Back to Upload
                      </Button>

                      {previewUrl && file.type.startsWith("image/") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(previewUrl, "_blank")}
                          className="border-slate-200"
                        >
                          <Download className="h-4 w-4 mr-1" /> Download
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden bg-slate-50 min-h-[400px] flex items-center justify-center">
                    {previewUrl ? (
                      file.type.startsWith("image/") ? (
                        <img
                          src={previewUrl || "/placeholder.svg"}
                          alt={file.name}
                          className="max-w-full max-h-[600px] object-contain"
                        />
                      ) : file.type === "application/pdf" ? (
                        <iframe src={`${previewUrl}#toolbar=0`} className="w-full h-[600px]" title={file.name} />
                      ) : (
                        <div className="text-center p-6">
                          <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-slate-800 mb-2">Preview not available</h3>
                          <p className="text-slate-600">This file type cannot be previewed directly.</p>
                        </div>
                      )
                    ) : (
                      <div className="text-center p-6">
                        <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-800 mb-2">No preview available</h3>
                        <p className="text-slate-600">Upload a document to see a preview.</p>
                      </div>
                    )}
                  </div>

                  {/* Document Details */}
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h4 className="font-medium text-slate-800 mb-3">Document Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-500">File Name</p>
                        <p className="text-slate-800 truncate">{file.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">File Type</p>
                        <p className="text-slate-800">{file.type || "Unknown"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">File Size</p>
                        <p className="text-slate-800">{formatFileSize(file.size)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Last Modified</p>
                        <p className="text-slate-800">{new Date(file.lastModified).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Processing Status */}
                  {messageType === "success" && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-800 mb-1">Processing Complete</h4>
                          <p className="text-green-700 text-sm">
                            Your document has been successfully uploaded and processed. You can now view the extracted
                            data.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

