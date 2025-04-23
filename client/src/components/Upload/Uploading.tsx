"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  RotateCw,
  ArrowRight,
  Code,
  Table2,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDocumentById } from "@/hooks/useGetDocuemntById";
import { DocumentStatus } from "@/lib/types";
import type { Document } from "@/lib/types";

interface UploadingProps {
  onUploadSuccess?: (document: Document) => void;
}

const formatKey = (key: string): string => {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const safeToString = (value: unknown): string => {
  if (value === null || value === undefined) return "N/A";
  return String(value);
};

export default function Uploading({ onUploadSuccess }: UploadingProps) {
  // File state
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("upload");

  // Status state
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | "info" | ""
  >("");
  const [status, setStatus] = useState<DocumentStatus>(DocumentStatus.PENDING);
  const [documentId, setDocumentId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Document fetching
  const {
    loading: documentLoading,
    data: documentData,
    fetchDocument,
  } = useGetDocumentById(documentId || undefined);

  const [activeView, setActiveView] = useState<"json" | "table">("table");

  const handleViewChange = (view: "json" | "table") => {
    setActiveView(view);
  };

  // Function to download data as JSON
  const downloadAsJSON = () => {
    if (!documentData?.extractedData) return;

    const jsonContent = JSON.stringify(documentData.extractedData, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${documentData.fileName || "document"}_data.json`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (status === DocumentStatus.PROCESSED && documentId) {
      fetchDocument();
    }
  }, [status, documentId, fetchDocument]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setMessage("");
        setMessageType("");
        setActiveTab("process");
      } else {
        setMessage("Please upload a PDF file");
        setMessageType("error");
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setPreviewUrl(URL.createObjectURL(droppedFile));
        setMessage("");
        setMessageType("");
        setActiveTab("process");
      } else {
        setMessage("Please upload a PDF file");
        setMessageType("error");
      }
    }
  };

  const pollDocumentStatus = useCallback(
    async (docId: string): Promise<boolean> => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/docs/status/${docId}`
        );
        const data = await response.json();

        if (!response.ok) throw new Error("Failed to get status");

        const { status } = data.document;
        setStatus(status);

        switch (status) {
          case DocumentStatus.EXTRACTING:
            break;
          case DocumentStatus.EXTRACTED:
            break;
          case DocumentStatus.PROCESSING:
            break;
          case DocumentStatus.PROCESSED:
            if (onUploadSuccess && data.document) {
              onUploadSuccess({
                id: docId,
                fileName: file?.name || "",
                fileType: file?.type || "",
                fileSize: file?.size || 0,
                status: DocumentStatus.PROCESSED,
                url: data.documentUrl,
                extractedData: {
                  generalData: data.document.generalData,
                  missingData: data.document.missingData,
                  validationData: data.document.validationData,
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                IP: "",
              });
            }
            return false;
          case DocumentStatus.FAILED:
            setMessage("Processing failed. Please try again.");
            setMessageType("error");
            return false;
        }
        return true;
      } catch (error) {
        console.error("Status check error:", error);
        setMessage("Failed to check processing status");
        setMessageType("error");
        return false;
      }
    },
    [onUploadSuccess, file]
  );

  const startProcessing = useCallback(
    async (docId: string) => {
      try {
        setActiveTab("process");
        while (await pollDocumentStatus(docId)) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error("Processing error:", error);
        setMessage("Processing failed. Please try again.");
        setMessageType("error");
      }
    },
    [pollDocumentStatus]
  );

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setMessageType("info");
    setStatus(DocumentStatus.UPLOADING);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/test/docs/procedure`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setDocumentId(data.documentId);
      await startProcessing(data.documentId);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Failed to upload document. Please try again.");
      setMessageType("error");
      setStatus(DocumentStatus.FAILED);
    }
  };

  const getLoadingContent = () => {
    switch (status) {
      case DocumentStatus.UPLOADING:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full"
          >
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="h-12 w-12 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              Uploading Document
            </h3>
            <p className="text-slate-600 mb-6 text-center text-sm">
              Uploading your document to the server
            </p>
            <div className="space-y-3 w-64">
              <Skeleton className="h-2 w-full bg-blue-100/50" />
              <Skeleton className="h-2 w-3/4 bg-blue-100/50" />
              <Skeleton className="h-2 w-1/2 bg-blue-100/50" />
            </div>
          </motion.div>
        );

      case DocumentStatus.EXTRACTING:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full"
          >
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="h-12 w-12 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              Extracting Content
            </h3>
            <p className="text-slate-600 mb-6 text-center text-sm">
              AI is analyzing and extracting data from your document
            </p>
            <div className="space-y-3 w-64">
              <Skeleton className="h-2 w-full bg-blue-100/50" />
              <Skeleton className="h-2 w-3/4 bg-blue-100/50" />
              <Skeleton className="h-2 w-1/2 bg-blue-100/50" />
            </div>
          </motion.div>
        );

      case DocumentStatus.EXTRACTED:

      case DocumentStatus.PROCESSING:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full"
          >
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <RotateCw className="h-12 w-12 text-white animate-spin" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              Processing Document
            </h3>
            <p className="text-slate-600 mb-6 text-center text-sm">
              Structuring and organizing the extracted data
            </p>
            <div className="space-y-3 w-64">
              <Skeleton className="h-2 w-full bg-indigo-100/50" />
              <Skeleton className="h-2 w-2/3 bg-indigo-100/50" />
              <Skeleton className="h-2 w-1/3 bg-indigo-100/50" />
            </div>
          </motion.div>
        );

      case DocumentStatus.PROCESSED:
        return documentLoading ? (
          <div className="flex flex-col h-full p-6">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
              <Skeleton className="h-4 w-3/6" />
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full"
          >
            <div className="border-b border-slate-200">
              <div className="bg-slate-100/80 backdrop-blur-lg rounded-full px-2 py-1.5 mx-4 my-3 flex gap-2">
                <button
                  onClick={() => handleViewChange("table")}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md transition-all duration-200 flex-1 ${
                    activeView === "table"
                      ? "bg-white text-blue-800 shadow-sm"
                      : "text-slate-600 hover:text-blue-800 hover:bg-white/50"
                  }`}
                >
                  <Table2 className="h-3.5 w-3.5" />
                  <span className="text-sm font-medium">Table View</span>
                </button>
                <button
                  onClick={() => handleViewChange("json")}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md transition-all duration-200 flex-1 ${
                    activeView === "json"
                      ? "bg-white text-blue-800 shadow-sm"
                      : "text-slate-600 hover:text-blue-800 hover:bg-white/50"
                  }`}
                >
                  <Code className="h-3.5 w-3.5" />
                  <span className="text-sm font-medium">JSON</span>
                </button>
                <button
                  onClick={downloadAsJSON}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-md transition-all duration-200 bg-white text-blue-800 shadow-sm hover:bg-blue-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="text-sm font-medium">Download JSON</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {activeView === "json" ? (
                <div className="h-full bg-slate-900 text-slate-50 p-4 rounded-xl overflow-auto shadow-inner">
                  <pre className="text-xs leading-relaxed font-mono font-normal tracking-tight">
                    <code className="block whitespace-pre overflow-x-auto text-slate-200 font-mono">
                      {JSON.stringify(documentData?.extractedData, null, 2)}
                    </code>
                  </pre>
                </div>
              ) : (
                <div className="space-y-6">{renderGeneralData()}</div>
              )}
            </div>
          </motion.div>
        );

      case DocumentStatus.FAILED:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full"
          >
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <AlertCircle className="h-12 w-12 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              Processing Failed
            </h3>
            <p className="text-slate-600 mb-6 text-center text-sm">
              There was an error processing your document
            </p>
            <Button
              onClick={handleUpload}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              Try Again
            </Button>
          </motion.div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <Button
              onClick={handleUpload}
              className="group relative bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              size="lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-3">
                <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                <span className="text-base font-medium tracking-wide">
                  Extract Data
                </span>
              </div>
            </Button>
          </div>
        );
    }
  };

  const renderGeneralData = () => {
    const extractedData = documentData?.extractedData;
    if (!extractedData) return null;

    // Helper function to render nested objects or arrays
    const renderNestedData = (data: unknown, level = 0) => {
      if (data === null || data === undefined) return "N/A";

      if (typeof data === "object") {
        if (Array.isArray(data)) {
          if (data.length === 0) return "No data";

          // Check if array contains objects
          if (data.length > 0 && typeof data[0] === "object") {
            return (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50/50">
                      {Object.keys(data[0]).map((header) => (
                        <th
                          key={header}
                          className="text-left px-4 py-3 font-medium text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200"
                        >
                          {formatKey(header)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        {Object.values(item).map((value, i) => (
                          <td
                            key={i}
                            className="px-4 py-3 text-sm text-slate-600"
                          >
                            {typeof value === "object" && value !== null
                              ? renderNestedData(value, level + 1)
                              : safeToString(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          // Simple array of primitives
          return (
            <div className="flex flex-wrap gap-2">
              {data.map((item, index) => (
                <span
                  key={index}
                  className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-sm"
                >
                  {safeToString(item)}
                </span>
              ))}
            </div>
          );
        }

        // Object with nested properties
        return (
          <div className="space-y-2">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="flex">
                <span className="font-medium text-slate-700 min-w-[120px]">
                  {formatKey(key)}:
                </span>
                <span className="text-slate-600 ml-2">
                  {typeof value === "object" && value !== null
                    ? renderNestedData(value, level + 1)
                    : safeToString(value)}
                </span>
              </div>
            ))}
          </div>
        );
      }

      return safeToString(data);
    };

    return (
      <div className="space-y-6">
        {/* General Data Section */}
        {extractedData.generalData &&
          Object.keys(extractedData.generalData).length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                <h3 className="text-base font-semibold text-slate-800">
                  General Information
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="text-left px-4 py-3 font-medium text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                        Field
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {Object.entries(extractedData.generalData).map(
                      ([key, value]) => (
                        <tr
                          key={key}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm font-medium text-slate-700">
                            {formatKey(key)}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {safeToString(value)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        {/* Grouped Data Section */}
        {extractedData.groupedData && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
              <h3 className="text-base font-semibold text-slate-800">
                Grouped Information
              </h3>
            </div>
            <div className="p-4">
              {Array.isArray(extractedData.groupedData)
                ? // Handle array of grouped data
                  extractedData.groupedData.map((group, groupIndex) => (
                    <div key={groupIndex} className="mb-6 last:mb-0">
                      {Object.entries(group).map(([key, value]) => (
                        <div key={key} className="mb-4 last:mb-0">
                          <h4 className="text-sm font-semibold text-slate-700 mb-2">
                            {formatKey(key)}
                          </h4>
                          {renderNestedData(value)}
                        </div>
                      ))}
                    </div>
                  ))
                : // Handle object of grouped data
                  Object.entries(extractedData.groupedData).map(
                    ([key, value]) => (
                      <div key={key} className="mb-4 last:mb-0">
                        <h4 className="text-sm font-semibold text-slate-700 mb-2">
                          {formatKey(key)}
                        </h4>
                        {renderNestedData(value)}
                      </div>
                    )
                  )}
            </div>
          </div>
        )}

        {/* Missing Data Section */}
        {extractedData.missingData &&
          Object.keys(extractedData.missingData).length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-red-100">
              <div className="px-4 py-3 border-b border-red-100 bg-red-50">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="h-3 w-3 text-red-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-red-800">
                    Missing Information
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(extractedData.missingData).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex items-start gap-2.5 p-2.5 bg-red-50/50 rounded-md border border-red-100"
                      >
                        <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                          <AlertCircle className="h-2.5 w-2.5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-red-800">
                            {formatKey(key)}
                          </p>
                          <p className="text-xs text-red-600 mt-0.5">
                            {typeof value === "string"
                              ? value
                              : "Not found in document"}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

        {/* Validation Data Section */}
        {/* {extractedData.validationData &&
          Object.keys(extractedData.validationData).length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-amber-100">
              <div className="px-4 py-3 border-b border-amber-100 bg-amber-50">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center">
                    <AlertCircle className="h-3 w-3 text-amber-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-amber-800">
                    Validation Results
                  </h3>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-amber-50/50">
                      <th className="text-left px-4 py-3 font-medium text-amber-700 text-xs uppercase tracking-wider border-b border-amber-100">
                        Field
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-amber-700 text-xs uppercase tracking-wider border-b border-amber-100">
                        Result
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100">
                    {Object.entries(extractedData.validationData).map(
                      ([key, value]) => (
                        <tr
                          key={key}
                          className="hover:bg-amber-50/30 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm font-medium text-amber-700">
                            {formatKey(key)}
                          </td>
                          <td className="px-4 py-3 text-sm text-amber-600">
                            {typeof value === "object" && value !== null
                              ? JSON.stringify(value, null, 2)
                              : safeToString(value)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )} */}
      </div>
    );
  };

  return (
    <div className="w-full h-full max-w-[1920px] mx-auto px-6">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as string)}
        className="w-full h-full"
      >
        <TabsList className="w-full mb-6 bg-slate-100/80 backdrop-blur-lg rounded-full p-1.5">
          <TabsTrigger
            value="upload"
            className="flex-1 data-[state=active]:bg-white data-[state=active]:text-blue-800 data-[state=active]:shadow-sm rounded-full transition-all duration-200"
          >
            Upload Document
          </TabsTrigger>
          <TabsTrigger
            value="process"
            disabled={!file}
            className="flex-1 data-[state=active]:bg-white data-[state=active]:text-blue-800 data-[state=active]:shadow-sm rounded-full transition-all duration-200"
          >
            Process Document
          </TabsTrigger>
        </TabsList>

        <div className="h-[calc(100vh-12rem)]">
          <TabsContent value="upload" className="h-full m-0">
            <div
              className={`border-2 border-dashed rounded-xl transition-all max-w-2xl mx-auto ${
                dragActive
                  ? "border-blue-400/50 bg-blue-50/30"
                  : "border-slate-200/80 hover:border-blue-300/50 hover:bg-slate-50/30"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="py-12 px-6 space-y-6"
              >
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-full flex items-center justify-center mx-auto shadow-sm ring-1 ring-slate-200/50">
                    <Upload className="h-10 w-10 text-blue-600/80" />
                  </div>
                  {file && (
                    <div className="absolute top-0 right-0 -mr-2 -mt-2">
                      <div className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full border border-slate-200/80 shadow-sm">
                        {file.name}
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-medium text-slate-700">
                      {file
                        ? "Ready to Process"
                        : "Drag & drop your document here"}
                    </h3>
                    <p className="text-sm text-slate-500/90">
                      {file
                        ? "Click Process Document to continue"
                        : "or use the button below"}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-px w-12 bg-slate-200/50"></div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-200/80 text-slate-600 hover:bg-slate-50/50 hover:text-blue-600 hover:border-blue-200/50 shadow-sm hover:shadow transition-all duration-200 min-w-[120px]"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Browse Files
                    </Button>
                    <div className="h-px w-12 bg-slate-200/50"></div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf"
                  />
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500/80">
                    <FileText className="h-3 w-3" />
                    <span>Supported format: PDF</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="process" className="h-full m-0">
            <div className="grid grid-cols-2 gap-6 h-full">
              {/* Left side - PDF Preview */}
              <div className="h-full rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                {previewUrl ? (
                  <iframe
                    src={`${previewUrl}#toolbar=0`}
                    className="w-full h-full"
                    title="Document Preview"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Skeleton className="w-full h-full" />
                  </div>
                )}
              </div>

              {/* Right side - Processing & Results */}
              <div className="h-full bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {status === DocumentStatus.PROCESSED ? (
                  documentLoading ? (
                    <div className="flex flex-col h-full p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-8 w-32" />
                      </div>
                      <div className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                        <Skeleton className="h-4 w-3/6" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full">
                      <div className="border-b border-slate-200">
                        <div className="bg-slate-100/80 backdrop-blur-lg rounded-full px-2 py-1.5 mx-4 my-3 flex gap-2">
                          <button
                            onClick={() => handleViewChange("table")}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-md transition-all duration-200 flex-1 ${
                              activeView === "table"
                                ? "bg-white text-blue-800 shadow-sm"
                                : "text-slate-600 hover:text-blue-800 hover:bg-white/50"
                            }`}
                          >
                            <Table2 className="h-3.5 w-3.5" />
                            <span className="text-sm font-medium">
                              Table View
                            </span>
                          </button>
                          <button
                            onClick={() => handleViewChange("json")}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-md transition-all duration-200 flex-1 ${
                              activeView === "json"
                                ? "bg-white text-blue-800 shadow-sm"
                                : "text-slate-600 hover:text-blue-800 hover:bg-white/50"
                            }`}
                          >
                            <Code className="h-3.5 w-3.5" />
                            <span className="text-sm font-medium">JSON</span>
                          </button>
                          <button
                            onClick={downloadAsJSON}
                            className="flex items-center gap-2 px-4 py-1.5 rounded-md transition-all duration-200 bg-white text-blue-800 shadow-sm hover:bg-blue-50"
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span className="text-sm font-medium">
                              Download JSON
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 overflow-auto p-4">
                        {activeView === "json" ? (
                          <div className="h-full bg-slate-900 text-slate-50 p-5 rounded-xl overflow-auto shadow-inner">
                            <pre className="text-xs leading-relaxed font-mono font-normal tracking-tight">
                              <code className="block whitespace-pre overflow-x-auto text-slate-200 font-mono">
                                {JSON.stringify(
                                  documentData?.extractedData,
                                  null,
                                  2
                                )}
                              </code>
                            </pre>
                          </div>
                        ) : (
                          <div className="space-y-6">{renderGeneralData()}</div>
                        )}
                      </div>
                    </div>
                  )
                ) : (
                  getLoadingContent()
                )}
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4"
          >
            <Alert
              variant={messageType === "error" ? "destructive" : "default"}
              className={
                messageType === "success" ? "border-green-200 bg-green-50" : ""
              }
            >
              {messageType === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription
                className={messageType === "success" ? "text-green-600" : ""}
              >
                {message}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
