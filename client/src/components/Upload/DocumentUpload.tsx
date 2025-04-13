"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  FileIcon as FilePdf,
  RotateCw,
  ArrowRight,
  X,
  Eye,
  FileType,
  Download,
  Trash2,
  Server,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ProcessingStatus =
  | "PENDING"
  | "EXTRACTING"
  | "EXTRACTED"
  | "PROCESSING"
  | "PROCESSED"
  | "FAILED";

interface ProcessingStep {
  id: string;
  label: string;
  description: string;
  status: "waiting" | "processing" | "completed" | "failed";
}

export const DocumentUpload = () => {
  // File state
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // UI state
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Processing state
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>("PENDING");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log(error, progress);

  // Processing steps
  const [steps, setSteps] = useState<ProcessingStep[]>([
    {
      id: "upload",
      label: "Upload Document",
      description: "Upload your document to our secure server",
      status: "waiting",
    },
    {
      id: "extract",
      label: "Extract Content",
      description: "AI extracts text and structure from your document",
      status: "waiting",
    },
    {
      id: "process",
      label: "Process Data",
      description: "Process and structure the extracted information",
      status: "waiting",
    },
  ]);

  const updateStepStatus = useCallback(
    (stepId: string, newStatus: ProcessingStep["status"]) => {
      setSteps((current) =>
        current.map((step) =>
          step.id === stepId ? { ...step, status: newStatus } : step
        )
      );
    },
    []
  );

  const pollDocumentStatus = useCallback(
    async (docId: string): Promise<boolean> => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/docs/status/${docId}`
        );
        const data = await response.json();

        if (!response.ok) throw new Error("Failed to get status");

        setStatus(data.status);

        switch (data.status) {
          case "EXTRACTING":
            updateStepStatus("extract", "processing");
            setProgress(33);
            break;
          case "EXTRACTED":
            updateStepStatus("extract", "completed");
            updateStepStatus("process", "processing");
            setProgress(66);
            break;
          case "PROCESSING":
            updateStepStatus("extract", "completed");
            updateStepStatus("process", "processing");
            setProgress(80);
            break;
          case "PROCESSED":
            updateStepStatus("process", "completed");
            setProgress(100);
            setError(null);
            setMessage("Document successfully processed");
            setMessageType("success");
            return false;
          case "FAILED":
            setSteps((steps) =>
              steps.map((step) =>
                step.status === "processing"
                  ? { ...step, status: "failed" }
                  : step
              )
            );
            setError("Processing failed. Please try again.");
            setMessage("Processing failed. Please try again.");
            setMessageType("error");
            return false;
        }
        return true;
      } catch (error) {
        console.error("Status check error:", error);
        setError("Failed to check processing status");
        setMessage("Failed to check processing status");
        setMessageType("error");
        return false;
      }
    },
    [updateStepStatus]
  );

  const startProcessing = useCallback(
    async (docId: string) => {
      try {
        // Switch to the processing tab
        setActiveTab("processing");

        while (await pollDocumentStatus(docId)) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error("Processing error:", error);
        setError("Processing failed. Please try again.");
        setMessage("Processing failed. Please try again.");
        setMessageType("error");
        setSteps((steps) =>
          steps.map((step) =>
            step.status === "processing" ? { ...step, status: "failed" } : step
          )
        );
      }
    },
    [pollDocumentStatus]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setError(null);
        setMessage("");
        setMessageType("");
        setProgress(0);
        setSteps((steps) =>
          steps.map((step) => ({ ...step, status: "waiting" }))
        );

        // Create preview URL
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
      } else {
        setError("Please upload a PDF file");
        setMessage("Please upload a PDF file");
        setMessageType("error");
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setError(null);
        setMessage("");
        setMessageType("");
        setProgress(0);
        setSteps((steps) =>
          steps.map((step) => ({ ...step, status: "waiting" }))
        );

        // Create preview URL
        const url = URL.createObjectURL(droppedFile);
        setPreviewUrl(url);
      } else {
        setError("Please upload a PDF file");
        setMessage("Please upload a PDF file");
        setMessageType("error");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      setMessageType("error");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setError(null);
    setMessage("");
    setMessageType("");
    setProgress(0);
    updateStepStatus("upload", "processing");
    setActiveTab("processing");

    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(uploadInterval);
          return prev;
        }
        return prev + 5;
      });
    }, 200);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/docs/procedure`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      clearInterval(uploadInterval);
      setUploadProgress(100);

      if (response.ok) {
        updateStepStatus("upload", "completed");
        setDocumentId(data.documentId);
        await startProcessing(data.documentId);
      } else {
        setError(data.error || "Upload failed");
        setMessage(data.error || "Upload failed");
        setMessageType("error");
        updateStepStatus("upload", "failed");
      }
    } catch (error) {
      clearInterval(uploadInterval);
      console.error("Upload error:", error);
      setError("Upload failed. Please try again.");
      setMessage("Upload failed. Please try again.");
      setMessageType("error");
      updateStepStatus("upload", "failed");
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setDocumentId(null);
    setStatus("PENDING");
    setError(null);
    setMessage("");
    setMessageType("");
    setProgress(0);
    setUploadProgress(0);
    setPreviewUrl(null);
    setSteps((steps) => steps.map((step) => ({ ...step, status: "waiting" })));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setActiveTab("upload");
  };

  const getFileIcon = () => {
    if (!file) return <FileText className="h-6 w-6" />;

    if (file.type === "application/pdf") {
      return <FilePdf className="h-6 w-6" />;
    } else {
      return <FileType className="h-6 w-6" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStepIcon = (status: ProcessingStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <X className="h-5 w-5 text-red-500" />;
      case "processing":
        return <RotateCw className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return (
          <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
        );
    }
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-100/80 backdrop-blur-lg rounded-full p-1.5">
          <TabsTrigger
            value="upload"
            className="text-base data-[state=active]:bg-white data-[state=active]:text-blue-800 data-[state=active]:shadow-sm rounded-full transition-all duration-200"
          >
            <Upload className="mr-2 h-4 w-4" /> Upload Document
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            disabled={!file}
            className="text-base data-[state=active]:bg-white data-[state=active]:text-blue-800 data-[state=active]:shadow-sm rounded-full transition-all duration-200"
          >
            <Eye className="mr-2 h-4 w-4" /> Preview Document
          </TabsTrigger>
          <TabsTrigger
            value="processing"
            disabled={!documentId}
            className="text-base data-[state=active]:bg-white data-[state=active]:text-blue-800 data-[state=active]:shadow-sm rounded-full transition-all duration-200"
          >
            <Server className="mr-2 h-4 w-4" /> Processing
          </TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-6">
          <Card className="border-slate-200 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-white p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">
                Upload Document
              </h2>
              <p className="text-sm text-slate-500">
                Upload your document for AI processing
              </p>
            </div>
            <CardContent className="p-6">
              {/* Drag & Drop Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  dragActive
                    ? "border-blue-500 bg-blue-50/50"
                    : "border-slate-200 hover:border-blue-400 hover:bg-slate-50/50"
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
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-slate-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <Upload className="h-10 w-10 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-slate-800 mb-2">
                        Drag & drop your document here
                      </h3>
                      <p className="text-slate-600 mb-4">or</p>
                      <Button
                        variant="outline"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50 shadow-sm hover:shadow transition-all duration-200"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Browse Files
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf"
                      />
                    </div>
                    <p className="text-sm text-slate-500 mt-4">
                      Supported format: PDF
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="max-w-md mx-auto p-6">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm mb-2">
                          <div className="text-white">{getFileIcon()}</div>
                        </div>
                        <h3 className="text-base font-medium text-slate-800 mb-2 text-center truncate max-w-[90%]">
                          {file.name}
                        </h3>
                        <div className="w-full flex justify-center gap-3 mt-1">
                          <div className="flex flex-col items-center bg-slate-50 px-3 py-2 rounded-lg">
                            <p className="text-xs text-slate-500 mb-0.5">
                              Type
                            </p>
                            <p className="text-xs text-slate-700">
                              {file.type || "Unknown"}
                            </p>
                          </div>
                          <div className="flex flex-col items-center bg-slate-50 px-3 py-2 rounded-lg">
                            <p className="text-xs text-slate-500 mb-0.5">
                              Size
                            </p>
                            <p className="text-xs text-slate-700">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                          <div className="flex flex-col items-center bg-slate-50 px-3 py-2 rounded-lg">
                            <p className="text-xs text-slate-500 mb-0.5">
                              Date
                            </p>
                            <p className="text-xs text-slate-700">
                              {new Date(file.lastModified).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {uploading ? (
                        <div className="mt-6 space-y-2">
                          <Progress value={uploadProgress} className="h-2" />
                          <p className="text-sm text-slate-600 text-center">
                            Uploading... {uploadProgress}%
                          </p>
                        </div>
                      ) : (
                        <div className="mt-6 flex justify-center gap-3">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleReset}
                                  className="border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 transition-all duration-200"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove
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
                                    size="sm"
                                    onClick={() => setActiveTab("preview")}
                                    className="border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all duration-200"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Preview
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
                  <Button
                    onClick={handleUpload}
                    className="bg-blue-800 hover:bg-blue-700 text-white px-8 py-6 transition-all duration-300 rounded-lg"
                    size="lg"
                  >
                    {uploading ? (
                      <>
                        <RotateCw className="mr-2 h-5 w-5 animate-spin" />
                        Extracting...
                      </>
                    ) : (
                      <>
                        <ArrowRight className="mr-2 h-5 w-5" />
                        Start Extracting
                      </>
                    )}
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
                      variant={
                        messageType === "error" ? "destructive" : "default"
                      }
                      className={
                        messageType === "success"
                          ? "border-green-200 bg-green-50"
                          : ""
                      }
                    >
                      {messageType === "success" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : messageType === "error" ? (
                        <AlertCircle className="h-4 w-4" />
                      ) : null}
                      <AlertDescription
                        className={
                          messageType === "success" ? "text-green-600" : ""
                        }
                      >
                        {message}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="border-slate-200 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-white p-6 border-b border-slate-200">
              <h3 className="text-lg font-medium text-slate-800">
                Document Processing Instructions
              </h3>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <Upload className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-medium text-slate-800 mb-1">
                    Upload PDF
                  </h3>
                  <p className="text-sm text-slate-500">
                    Upload your document in PDF format
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-medium text-slate-800 mb-1">
                    AI Processing
                  </h3>
                  <p className="text-sm text-slate-500">
                    Our AI extracts and structures the data
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-medium text-slate-800 mb-1">
                    View Results
                  </h3>
                  <p className="text-sm text-slate-500">
                    Review and use the processed data
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          <Card className="border-slate-200 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-white p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">
                Document Preview
              </h2>
              <p className="text-sm text-slate-500">
                Review your document before processing
              </p>
            </div>
            <CardContent className="p-6">
              {file && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-slate-100 rounded-full flex items-center justify-center mr-3 shadow-sm">
                        {getFileIcon()}
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-800 truncate max-w-md">
                          {file.name}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab("upload")}
                        className="border-slate-200 shadow-sm hover:shadow transition-all duration-200"
                      >
                        Back to Upload
                      </Button>

                      {previewUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(previewUrl, "_blank")}
                          className="border-slate-200 shadow-sm hover:shadow transition-all duration-200"
                        >
                          <Download className="h-4 w-4 mr-1" /> Download
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Document Details - Moved to sidebar */}
                    <div className="md:col-span-1 space-y-4">
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 shadow-sm">
                        <h4 className="font-medium text-slate-800 mb-3">
                          Document Details
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-slate-500">File Name</p>
                            <p className="text-slate-800 truncate">
                              {file.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">File Type</p>
                            <p className="text-slate-800">
                              {file.type || "Unknown"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">File Size</p>
                            <p className="text-slate-800">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">
                              Last Modified
                            </p>
                            <p className="text-slate-800">
                              {new Date(file.lastModified).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Processing Button - Moved to sidebar */}
                      {!documentId && (
                        <div className="flex justify-center">
                          <Button
                            onClick={handleUpload}
                            className="w-full bg-blue-800 hover:bg-blue-700 text-white px-8 shadow-sm hover:shadow-md transition-all duration-300"
                            size="lg"
                          >
                            <ArrowRight className="mr-2 h-4 w-4" />
                            Extract Document
                          </Button>
                        </div>
                      )}

                      {/* Processing Status - Moved to sidebar */}
                      {messageType === "success" && (
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200 shadow-sm">
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-green-800 mb-1">
                                Processing Complete
                              </h4>
                              <p className="text-green-700 text-sm">
                                Your document has been successfully processed.
                                You can view processing details in the
                                Processing tab.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Preview Area - Now takes 2/3 of the space */}
                    <div className="md:col-span-2">
                      <div className="border rounded-lg overflow-hidden bg-slate-50 h-[calc(100vh-400px)] flex items-center justify-center shadow-sm">
                        {previewUrl ? (
                          file.type === "application/pdf" ? (
                            <iframe
                              src={`${previewUrl}#toolbar=0`}
                              className="w-full h-full"
                              title={file.name}
                            />
                          ) : (
                            <div className="text-center p-4">
                              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                              <h3 className="text-base font-medium text-slate-800 mb-1">
                                Preview not available
                              </h3>
                              <p className="text-sm text-slate-600">
                                This file type cannot be previewed directly.
                              </p>
                            </div>
                          )
                        ) : (
                          <div className="text-center p-4">
                            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                            <h3 className="text-base font-medium text-slate-800 mb-1">
                              No preview available
                            </h3>
                            <p className="text-sm text-slate-600">
                              Upload a document to see a preview.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Processing Tab */}
        <TabsContent value="processing" className="space-y-6">
          <Card className="border-slate-200 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-white p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">
                Document Processing
              </h2>
              <p className="text-sm text-slate-500">
                Our AI is processing your document
              </p>
            </div>
            <CardContent className="p-6">
              {/* File Info */}
              {file && (
                <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-white rounded-xl p-4 mb-6 shadow-sm border border-slate-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-sm">
                      <FilePdf className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-800 truncate max-w-xs">
                        {file.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`px-3 py-1 ${
                      status === "PROCESSED"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : status === "FAILED"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {status}
                  </Badge>
                </div>
              )}

              {/* Processing Steps */}
              <div className="space-y-4 mb-6">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`relative bg-white rounded-xl p-4 border transition-all duration-300 ${
                      step.status === "processing"
                        ? "border-blue-200 bg-gradient-to-r from-blue-50 to-white shadow-md"
                        : step.status === "completed"
                        ? "border-green-200 bg-gradient-to-r from-green-50 to-white shadow-sm"
                        : step.status === "failed"
                        ? "border-red-200 bg-gradient-to-r from-red-50 to-white shadow-sm"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          step.status === "processing"
                            ? "bg-blue-100 text-blue-600"
                            : step.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : step.status === "failed"
                            ? "bg-red-100 text-red-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {getStepIcon(step.status)}
                      </div>
                      <div className="flex-1">
                        <h4
                          className={`font-medium ${
                            step.status === "processing"
                              ? "text-blue-800"
                              : step.status === "completed"
                              ? "text-green-800"
                              : step.status === "failed"
                              ? "text-red-800"
                              : "text-slate-800"
                          }`}
                        >
                          {step?.label}
                        </h4>
                        <p className="text-sm text-slate-500">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`absolute left-5 top-14 w-0.5 h-6 ${
                          step.status === "completed"
                            ? "bg-green-200"
                            : "bg-slate-200"
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              {status === "PROCESSED" && (
                <div className="flex justify-center">
                  <Button
                    onClick={() => (window.location.href = `/agent`)}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md hover:shadow-lg transition-all duration-300 px-8 py-6 rounded-lg"
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    View Document
                  </Button>
                </div>
              )}

              {status === "FAILED" && (
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-gradient-to-r from-red-50 to-white rounded-xl p-4 border border-red-200 w-full shadow-sm">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-800 mb-1">
                          Processing Failed
                        </h4>
                        <p className="text-red-700 text-sm">
                          There was an error processing your document. Please
                          try again or contact support.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleUpload}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-300 px-6 py-5 rounded-lg"
                  >
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Try Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Instructions */}
        <TabsContent value="instructions" className="space-y-6">
          <Card className="border-slate-200 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-white p-6 border-b border-slate-200">
              <h3 className="text-lg font-medium text-slate-800">
                Document Processing Instructions
              </h3>
            </div>
            <CardContent className="p-6">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Upload your document in PDF format for processing</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    Our AI will extract and structure the data, filling in any
                    missing information
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    Review the processed data and download the results
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
