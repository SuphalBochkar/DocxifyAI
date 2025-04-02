"use client"

import { useState } from "react"
import { Eye, Code, Table2, Download, ExternalLink, FileText, AlertCircle, CheckCircle } from "lucide-react"
import type { Document, ParsedField } from "../../lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"

interface DocumentViewerProps {
  document: Document | null
}

export function DocumentViewer({ document }: DocumentViewerProps) {
  const [activeTab, setActiveTab] = useState<string>("preview")

  if (!document) {
    return (
      <Card className="border-slate-200 shadow-sm h-full">
        <CardHeader className="px-4 py-3 border-b bg-slate-50">
          <CardTitle className="text-lg font-medium text-slate-800">Document Viewer</CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex flex-col items-center justify-center h-full">
          <div className="text-center">
            <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">No document selected</h3>
            <p className="text-slate-500 max-w-md">
              Select a document from the list to view its contents and extracted data
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Extract fields from document's parsedData if available
  const parsedFields: ParsedField[] = []
  if (document.parsedData) {
    Object.entries(document.parsedData).forEach(([key, value]) => {
      parsedFields.push({
        name: key,
        value: value !== null ? String(value) : null,
        status: value !== null ? "found" : "missing",
      })
    })
  }

  const isPdf = document.type === "application/pdf"
  const isImage = document.type.startsWith("image/")

  return (
    <Card className="border-slate-200 shadow-sm h-full">
      <CardHeader className="px-4 py-3 border-b bg-slate-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-slate-800">{document.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8" onClick={() => window.open(document.url, "_blank")}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b">
            <TabsList className="bg-transparent p-0 h-auto">
              <TabsTrigger
                value="preview"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
              <TabsTrigger
                value="json"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
              >
                <Code className="h-4 w-4 mr-2" />
                JSON
              </TabsTrigger>
              <TabsTrigger
                value="table"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
              >
                <Table2 className="h-4 w-4 mr-2" />
                Table View
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="preview" className="p-0 m-0">
            <div className="h-[500px] overflow-auto bg-slate-50 flex items-center justify-center">
              {isPdf ? (
                <iframe src={`${document.url}#toolbar=0`} className="w-full h-full border-0" title={document.name} />
              ) : isImage ? (
                <img
                  src={document.url || "/placeholder.svg"}
                  alt={document.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-center p-6">
                  <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-800 mb-2">Preview not available</h3>
                  <p className="text-slate-600 mb-4">This file type cannot be previewed directly.</p>
                  <Button variant="outline" onClick={() => window.open(document.url, "_blank")}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in new tab
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="json" className="p-4 m-0">
            <div className="bg-slate-900 text-slate-50 p-4 rounded-md overflow-auto max-h-[500px]">
              <pre className="text-sm font-mono">
                {document.parsedData
                  ? JSON.stringify(document.parsedData, null, 2)
                  : "No parsed data available for this document."}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="table" className="p-4 m-0">
            {parsedFields.length > 0 ? (
              <div className="overflow-auto max-h-[500px]">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="text-left p-3 border border-slate-200">Field</th>
                      <th className="text-left p-3 border border-slate-200">Value</th>
                      <th className="text-left p-3 border border-slate-200">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedFields.map((field, index) => (
                      <tr key={index} className="border-b border-slate-200">
                        <td className="p-3 border border-slate-200 font-medium">{field.name}</td>
                        <td className="p-3 border border-slate-200">
                          {field.value !== null ? field.value : <span className="text-red-500">Missing</span>}
                        </td>
                        <td className="p-3 border border-slate-200">
                          {field.status === "found" ? (
                            <Badge variant="success" className="flex items-center gap-1 w-fit">
                              <CheckCircle className="h-3 w-3" />
                              Found
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                              <AlertCircle className="h-3 w-3" />
                              Missing
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-6 text-slate-500">No parsed data available for this document.</div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

