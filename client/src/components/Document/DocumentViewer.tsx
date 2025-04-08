"use client";

import { useState } from "react";
import {
  Eye,
  Code,
  Table2,
  Download,
  ExternalLink,
  FileText,
  CheckCircle,
  ShieldCheck,
  Loader2,
  Maximize2,
  Minimize2,
  GitCompare,
} from "lucide-react";
import type { Document } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DocumentViewerProps {
  document: Document | null;
  isLoading?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const safeToString = (value: unknown): string => {
  if (value === null || value === undefined) return "N/A";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
};

const formatKey = (key: string): string => {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function DocumentViewer({
  document,
  isLoading = false,
  isFullscreen = false,
  onToggleFullscreen,
}: DocumentViewerProps) {
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [isValidating, setIsValidating] = useState(false);
  const [validationData, setValidationData] = useState<{
    message: string;
    differences: Array<[string, string, any, any?]>;
  } | null>(null);

  const handleValidate = async () => {
    if (!document) return;

    setIsValidating(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      //   const response = await axios.post(
      //     `http://localhost:8080/api/v1/agent/validate/${document.id}`
      //   );
      //   if (response.status !== 200) {
      //     console.log(response.data);
      //     return;
      //   }
      //   setValidationData(response.data);

      setValidationData({
        message: "Document validated successfully",
        differences: [
          ["+", "totalAmount", 1250.5],
          ["~", "invoiceDate", "2023-05-01", "2023-05-10"],
          ["+", "taxAmount", 112.55],
          ["~", "invoiceNumber", "INV-001", "INV-2023-001"],
        ],
      });

      setActiveTab("diff");
    } catch (error) {
      console.error("Validation error:", error);
    } finally {
      setIsValidating(false);
    }
  };

  console.log("Validation Data", validationData);

  if (isLoading) {
    return (
      <Card className="border-slate-200 shadow-lg rounded-xl h-full flex flex-col">
        <CardHeader className="px-4 py-3 border-b bg-gradient-to-r from-blue-800 to-blue-900 flex items-center justify-center">
          <CardTitle className="text-lg font-bold text-white">
            Document Viewer
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-800 mx-auto" />
            <p className="text-slate-600 text-lg">
              Loading document details...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

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

  const isPdf = document.fileType === "application/pdf";

  return (
    <Card className="border-slate-200 shadow-lg rounded-xl h-full flex flex-col">
      <CardHeader className="px-4 py-3 border-b bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-[70%]">
            <CardTitle className="text-lg font-medium text-slate-800 truncate">
              {document.fileName}
            </CardTitle>
            <Badge
              variant="outline"
              className="text-xs font-normal text-slate-600"
            >
              {document.fileType}
            </Badge>
          </div>
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
              onClick={handleValidate}
              disabled={isValidating}
            >
              {isValidating ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4 mr-1" />
              )}
              {isValidating ? "Validating..." : "Validate"}
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
            <button
              onClick={onToggleFullscreen}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4 text-slate-500" />
              ) : (
                <Maximize2 className="h-4 w-4 text-slate-500" />
              )}
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col h-full"
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
              <TabsTrigger
                value="diff"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-800 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 transition-all duration-200"
                disabled={!validationData}
              >
                <GitCompare className="h-4 w-4 mr-2" />
                Diff View
                {!validationData && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    Run validation first
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="preview"
            className="flex-1 p-0 m-0 h-full overflow-hidden"
          >
            <div className="h-full w-full overflow-auto bg-gradient-to-b from-slate-50 to-white">
              {isPdf ? (
                <iframe
                  src={`https://docs.google.com/gview?url=${document.url}&embedded=true`}
                  className="w-full h-full border-0"
                  title={document.fileName}
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

          <TabsContent
            value="json"
            className="flex-1 p-4 m-0 h-full overflow-hidden"
          >
            <div className="h-full bg-slate-900 text-slate-50 p-4 rounded-xl overflow-auto">
              <pre className="text-sm font-mono whitespace-pre-wrap break-words">
                {document.extractedData
                  ? JSON.stringify(document.extractedData, null, 2)
                  : "No extracted data available for this document."}
              </pre>
            </div>
          </TabsContent>

          <TabsContent
            value="table"
            className="flex-1 p-4 m-0 h-full overflow-hidden"
          >
            {document.extractedData ? (
              <div className="h-full overflow-auto">
                <div className="space-y-6 max-w-full">
                  {Object.entries(document.extractedData).map(
                    ([section, data]) => (
                      <div
                        key={section}
                        className="bg-white rounded-lg shadow-sm p-4 w-full"
                      >
                        <h3 className="text-lg font-semibold text-slate-800 mb-3">
                          {formatKey(section)}
                        </h3>
                        {typeof data === "object" && data !== null ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            {Object.entries(data).map(([key, value]) => (
                              <div key={key} className="break-words w-full">
                                <p className="text-sm font-medium text-slate-500 mb-1">
                                  {formatKey(key)}
                                </p>
                                {typeof value === "object" && value !== null ? (
                                  <div className="mt-2 space-y-2 bg-slate-50 p-3 rounded-md w-full">
                                    {Object.entries(value).map(
                                      ([subKey, subValue]) => (
                                        <div
                                          key={subKey}
                                          className="flex flex-col sm:flex-row sm:justify-between gap-1 w-full"
                                        >
                                          <span className="text-sm font-medium text-slate-600">
                                            {formatKey(subKey)}:
                                          </span>
                                          <span className="text-sm text-slate-800 break-words">
                                            {safeToString(subValue)}
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-slate-800 break-words">
                                    {safeToString(value)}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-slate-800 break-words">
                            {safeToString(data)}
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                No extracted data available for this document.
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="diff"
            className="flex-1 p-4 m-0 h-full overflow-hidden"
          >
            {validationData ? (
              <div className="h-full overflow-auto">
                <div className="space-y-4">
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    {validationData.differences &&
                    validationData.differences.length > 0 ? (
                      <div className="space-y-4">
                        <h4 className="text-md font-medium text-slate-700">
                          Differences Found ({validationData.differences.length}
                          )
                        </h4>
                        <div className="space-y-2">
                          {validationData.differences.map((diff, index) => {
                            const [type, path, oldValue, newValue] = diff;
                            return (
                              <div
                                key={index}
                                className={`p-3 rounded-md ${
                                  type === "+"
                                    ? "bg-green-50 border border-green-200"
                                    : type === "-"
                                    ? "bg-red-50 border border-red-200"
                                    : "bg-yellow-50 border border-yellow-200"
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span
                                    className={`text-xs font-medium px-2 py-0.5 rounded ${
                                      type === "+"
                                        ? "bg-green-200 text-green-800"
                                        : type === "-"
                                        ? "bg-red-200 text-red-800"
                                        : "bg-yellow-200 text-yellow-800"
                                    }`}
                                  >
                                    {type === "+"
                                      ? "Added"
                                      : type === "-"
                                      ? "Removed"
                                      : "Changed"}
                                  </span>
                                  <span className="text-sm font-medium text-slate-700">
                                    {path}
                                  </span>
                                </div>
                                {type === "~" ? (
                                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                    <div className="bg-white p-2 rounded border border-red-100">
                                      <span className="text-red-600 font-medium">
                                        Old:{" "}
                                      </span>
                                      <span className="text-slate-700">
                                        {safeToString(oldValue)}
                                      </span>
                                    </div>
                                    <div className="bg-white p-2 rounded border border-green-100">
                                      <span className="text-green-600 font-medium">
                                        New:{" "}
                                      </span>
                                      <span className="text-slate-700">
                                        {safeToString(newValue)}
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="bg-white p-2 rounded border mt-2 text-sm">
                                    <span
                                      className={`font-medium ${
                                        type === "+"
                                          ? "text-green-600"
                                          : "text-red-600"
                                      }`}
                                    >
                                      {type === "+" ? "Value: " : "Was: "}
                                    </span>
                                    <span className="text-slate-700">
                                      {safeToString(
                                        type === "+" ? newValue : oldValue
                                      )}
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-50 p-4 rounded-md border border-green-200">
                        <p className="text-green-800 font-medium">
                          No differences found
                        </p>
                        <p className="text-green-700 text-sm mt-1">
                          The document data is consistent with the expected
                          format.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                <div className="text-center space-y-4">
                  <GitCompare className="h-16 w-16 text-slate-300 mx-auto" />
                  <h3 className="text-lg font-medium text-slate-800">
                    No validation data available
                  </h3>
                  <p className="text-slate-500 max-w-md">
                    Click the &quot;Validate&quot; button to compare the
                    document data with the expected format.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
