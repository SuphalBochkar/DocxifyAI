"use client"

import { useState } from "react"
import { FileText, Trash2, Calendar, FileType, Search, SortAsc, SortDesc } from "lucide-react"
import type { Document } from "../../lib/types"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { cn } from "../../lib/utils"

interface DocumentListProps {
  documents: Document[]
  onSelectDocument: (document: Document) => void
  onDeleteDocument?: (documentId: string) => void
  selectedDocumentId?: string | null
}

export function DocumentList({ documents, onSelectDocument, onDeleteDocument, selectedDocumentId }: DocumentListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  const filteredDocuments = documents
    .filter((doc) => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const dateA = new Date(a.uploadedAt).getTime()
      const dateB = new Date(b.uploadedAt).getTime()
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    })

  return (
    <Card className="border-slate-200 shadow-sm h-full">
      <CardHeader className="px-4 py-3 border-b bg-slate-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-slate-800">Documents</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="h-8"
          >
            {sortOrder === "asc" ? <SortAsc className="h-4 w-4 mr-1" /> : <SortDesc className="h-4 w-4 mr-1" />}
            Date
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="divide-y max-h-[400px] overflow-y-auto">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className={cn(
                  "p-3 hover:bg-slate-50 cursor-pointer transition-colors",
                  selectedDocumentId === doc.id && "bg-blue-50 hover:bg-blue-50",
                )}
                onClick={() => onSelectDocument(doc)}
              >
                <div className="flex items-start gap-3">
                  <div className="bg-slate-100 rounded-md p-2">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-slate-800 truncate">{doc.name}</h3>
                      <div className="flex items-center gap-1 shrink-0">
                        {selectedDocumentId === doc.id && (
                          <Badge variant="default" className="shrink-0">
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
                                    e.stopPropagation()
                                    onDeleteDocument(doc.id)
                                  }}
                                  className="h-7 w-7 p-0 text-slate-500 hover:text-red-600"
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
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <FileType className="h-3 w-3" />
                        {doc.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(doc.uploadedAt)}
                      </span>
                      <span>{formatFileSize(doc.size)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-slate-500">
              {searchTerm ? "No documents match your search" : "No documents available"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

