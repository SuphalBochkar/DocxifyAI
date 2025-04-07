"use client";

import { useState } from "react";
import {
  Eye,
  Code,
  Table2,
  Download,
  ExternalLink,
  FileText,
  AlertCircle,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
import type { Document, ParsedField } from "../../lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import Image from "next/image";

interface DocumentViewerProps {
  document: Document | null;
}

export function DocumentViewer({ document }: DocumentViewerProps) {
  const [activeTab, setActiveTab] = useState<string>("preview");

  if (!document) {
    return (
      <Card className="border-slate-200 shadow-lg rounded-xl h-full flex flex-col">
        <CardHeader className="px-4 py-3 border-b bg-gradient-to-r from-blue-800 to-blue-900 flex items-center justify-center">
          <CardTitle className="text-lg font-bold text-white">
            Document Viewer
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <FileText className="h-16 w-16 text-slate-300 mx-auto" />
            <h3 className="text-lg font-medium text-slate-800">
              No document selected
            </h3>
            <p className="text-slate-500 max-w-md">
              Select a document from the list to view its contents and extracted
              data
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Extract fields from document's parsedData if available
  const parsedFields: ParsedField[] = [];
  if (document.parsedData) {
    Object.entries(document.parsedData).forEach(([key, value]) => {
      parsedFields.push({
        name: key,
        value: value !== null ? String(value) : null,
        status: value !== null ? "found" : "missing",
      });
    });
  }

  const isPdf = document.type === "application/pdf";
  const isImage = document.type.startsWith("image/");

  return (
    <Card className="border-slate-200 shadow-lg rounded-xl h-full flex flex-col">
      <CardHeader className="px-4 py-3 border-b bg-slate-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-slate-800">
            {document.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 bg-blue-800 text-white hover:bg-blue-700 border-blue-800"
              onClick={() => {
                // Placeholder for verify function
                console.log("Verify document:", document.id);
              }}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Verify
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 bg-blue-600 text-white hover:bg-blue-500 border-blue-600"
              onClick={() => {
                // Placeholder for validate function
                console.log("Validate document:", document.id);
              }}
            >
              <ShieldCheck className="h-4 w-4 mr-1" />
              Validate
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 bg-white hover:bg-slate-50 border-slate-200"
              onClick={() => window.open(document.url, "_blank")}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 flex flex-col">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          <div className="border-b">
            <TabsList className="bg-transparent p-0 h-auto">
              <TabsTrigger
                value="preview"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-800 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 transition-all duration-200"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
              <TabsTrigger
                value="json"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-800 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 transition-all duration-200"
              >
                <Code className="h-4 w-4 mr-2" />
                JSON
              </TabsTrigger>
              <TabsTrigger
                value="table"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-800 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 transition-all duration-200"
              >
                <Table2 className="h-4 w-4 mr-2" />
                Table View
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="preview" className="flex-1 p-0 m-0">
            <div className="h-full overflow-auto bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
              <div className="text-xl font-bold bg-yellow-200 p-4 mb-4 border-2 border-yellow-500 rounded-md">
                {document.url}
              </div>
              {isPdf ? (
                <iframe
                  src={document.url}
                  className="w-full h-full border-0"
                  title={document.name}
                  sandbox="allow-scripts allow-same-origin"
                />
              ) : (
                <div className="text-center p-6 space-y-4">
                  <FileText className="h-16 w-16 text-slate-400 mx-auto" />
                  <h3 className="text-lg font-medium text-slate-800">
                    Preview not available
                  </h3>
                  <p className="text-slate-600">
                    This file type cannot be previewed directly.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => window.open(document.url, "_blank")}
                    className="bg-white hover:bg-slate-50 border-slate-200"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in new tab
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="json" className="flex-1 p-4 m-0">
            <div className="h-full bg-slate-900 text-slate-50 p-4 rounded-xl overflow-auto">
              <pre className="text-sm font-mono">
                {document.parsedData
                  ? JSON.stringify(document.parsedData, null, 2)
                  : "No parsed data available for this document."}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="table" className="flex-1 p-4 m-0">
            {parsedFields.length > 0 ? (
              <div className="h-full overflow-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="text-left p-3 border border-slate-200">
                        Field
                      </th>
                      <th className="text-left p-3 border border-slate-200">
                        Value
                      </th>
                      <th className="text-left p-3 border border-slate-200">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedFields.map((field, index) => (
                      <tr key={index} className="border-b border-slate-200">
                        <td className="p-3 border border-slate-200 font-medium">
                          {field.name}
                        </td>
                        <td className="p-3 border border-slate-200">
                          {field.value !== null ? (
                            field.value
                          ) : (
                            <span className="text-red-500">Missing</span>
                          )}
                        </td>
                        <td className="p-3 border border-slate-200">
                          {field.status === "found" ? (
                            <Badge
                              variant="success"
                              className="flex items-center gap-1 w-fit bg-green-100 text-green-800"
                            >
                              <CheckCircle className="h-3 w-3" />
                              Found
                            </Badge>
                          ) : (
                            <Badge
                              variant="destructive"
                              className="flex items-center gap-1 w-fit bg-red-100 text-red-800"
                            >
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
              <div className="h-full flex items-center justify-center text-slate-500">
                No parsed data available for this document.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
