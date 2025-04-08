"use client";

import { useState } from "react";
import {
  FileText,
  Trash2,
  Calendar,
  FileType,
  Search,
  SortAsc,
  SortDesc,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import type { Document } from "../../lib/types";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "../../lib/utils";

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
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
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
    <Card className="border-slate-200 shadow-lg rounded-xl h-full flex flex-col">
      <CardHeader className="px-4 py-3 border-b bg-gradient-to-r from-blue-800 to-blue-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-white" />
            <CardTitle className="text-lg text-white font-bold">
              Documents
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="h-8 bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            {sortOrder === "asc" ? (
              <SortAsc className="h-4 w-4 mr-1" />
            ) : (
              <SortDesc className="h-4 w-4 mr-1" />
            )}
            Date
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredDocuments.length > 0 ? (
            <div className="divide-y">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className={cn(
                    "p-4 hover:bg-slate-50 cursor-pointer transition-all duration-200",
                    selectedDocumentId === doc.id &&
                      "bg-blue-50 hover:bg-blue-50"
                  )}
                  onClick={() => onSelectDocument(doc)}
                >
                  <div className="flex flex-col gap-2">
                    {/* Document header with name and actions */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div
                          className={cn(
                            "bg-slate-100 rounded-xl p-2 flex-shrink-0",
                            getFileIcon(doc.fileType)
                          )}
                        >
                          <FileText className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-slate-800 truncate">
                            {doc.fileName}
                          </h3>
                          <div className="mt-1">
                            {getStatusBadge(doc.status)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {selectedDocumentId === doc.id && (
                          <Badge
                            variant="default"
                            className="shrink-0 bg-blue-800 text-white"
                          >
                            Selected
                          </Badge>
                        )}
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
                                  className="h-7 w-7 p-0 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
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

                    {/* Document details */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pl-12">
                      <div className="flex items-center gap-1">
                        <FileType className="h-3 w-3 text-slate-400" />
                        <span className="truncate">{doc.fileType}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        <span className="truncate">
                          {formatDate(doc.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3 text-slate-400" />
                        <span className="truncate">
                          {formatFileSize(doc.fileSize)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3 text-slate-400" />
                        <span className="truncate">
                          ID: {doc.id.substring(0, 8)}...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 text-center text-slate-500">
              {searchTerm
                ? "No documents match your search"
                : "No documents available"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
