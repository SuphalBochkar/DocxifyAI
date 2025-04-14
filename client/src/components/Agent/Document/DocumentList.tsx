"use client";

import { useState } from "react";
import {
  FileText,
  Trash2,
  Calendar,
  Search,
  SortAsc,
  SortDesc,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import type { Document } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DocumentListProps {
  documents: Document[];
  onSelectDocument: (document: Document) => void;
  onDeleteDocument?: (documentId: string) => void;
  selectedDocumentId?: string | null;
}

export function DocumentList({
  documents,
  onSelectDocument,
  onDeleteDocument,
  selectedDocumentId,
}: DocumentListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return "text-red-500";
    if (fileType.includes("word") || fileType.includes("doc"))
      return "text-blue-500";
    if (fileType.includes("excel") || fileType.includes("sheet"))
      return "text-green-500";
    if (fileType.includes("image")) return "text-purple-500";
    return "text-slate-500";
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "processed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Processed
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-slate-50 text-slate-700 border-slate-200"
          >
            {status || "Unknown"}
          </Badge>
        );
    }
  };

  const filteredDocuments = documents
    .filter((doc) =>
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  return (
    <Card className="border-slate-200 shadow-lg rounded-xl h-full flex flex-col overflow-hidden bg-gradient-to-b from-slate-50">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg shadow-sm">
            <FileText className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <CardTitle className="text-base font-medium text-slate-800">
              Documents
            </CardTitle>
            <p className="text-xs text-slate-500">
              {filteredDocuments.length}{" "}
              {filteredDocuments.length === 1 ? "document" : "documents"}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="h-7 px-2.5 bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm rounded-md transition-colors"
        >
          {sortOrder === "asc" ? (
            <SortAsc className="h-3 w-3 mr-1 text-slate-600" />
          ) : (
            <SortDesc className="h-3 w-3 mr-1 text-slate-600" />
          )}
          <span className="text-xs">Sort</span>
        </Button>
      </div>
      <div className="border-b border-slate-200 bg-white">
        <div className="px-4 py-3 relative">
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {filteredDocuments.length > 0 ? (
          <div className="space-y-1 p-3">
            {filteredDocuments.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.99 }}
                className={cn(
                  "bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden",
                  selectedDocumentId === doc.id && "bg-blue-50/50"
                )}
                onClick={() => onSelectDocument(doc)}
              >
                <div className="p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={cn(
                          "bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-2 flex-shrink-0 shadow-sm border border-slate-200",
                          getFileIcon(doc.fileType)
                        )}
                      >
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-medium text-slate-800 truncate">
                            {doc.fileName}
                          </h3>
                          {selectedDocumentId === doc.id && (
                            <Badge
                              variant="default"
                              className="bg-blue-800 text-white px-2 py-0.5 text-xs"
                            >
                              Selected
                            </Badge>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-1.5">
                          {getStatusBadge(doc.status)}
                          {doc.validationData &&
                            Object.keys(doc.validationData).length > 0 && (
                              <Badge
                                variant="outline"
                                className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-100 px-1.5 py-0.5 rounded-full text-xs"
                              >
                                <Clock className="h-3 w-3 text-amber-600" />
                                <span className="truncate">
                                  Validation Pending
                                </span>
                              </Badge>
                            )}
                          {doc.missingData &&
                            Object.keys(doc.missingData).length > 0 && (
                              <Badge
                                variant="outline"
                                className="flex items-center gap-1 bg-red-50 text-red-800 border border-red-100 px-1.5 py-0.5 rounded-full text-xs"
                              >
                                <AlertCircle className="h-3 w-3 text-red-600" />
                                <span className="truncate">Missing Info</span>
                              </Badge>
                            )}
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{formatDate(doc.createdAt)}</span>
                          </div>
                          <div className="w-px h-3 bg-slate-200" />
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Download className="h-3.5 w-3.5" />
                            <span>{formatFileSize(doc.fileSize)}</span>
                          </div>
                          <div className="w-px h-3 bg-slate-200" />
                          {/* <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <FileType className="h-3.5 w-3.5" />
                            <span>{doc.fileType}</span>
                          </div> */}
                        </div>
                      </div>
                    </div>
                    {onDeleteDocument && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteDocument(doc.id);
                              }}
                              className="h-8 w-8 p-0 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete document</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-500">
            <div className="max-w-xs">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-lg font-medium mb-1">
                {searchTerm
                  ? "No documents match your search"
                  : "No documents available"}
              </p>
              <p className="text-sm text-slate-400">
                {searchTerm
                  ? "Try a different search term"
                  : "Upload documents to get started"}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
