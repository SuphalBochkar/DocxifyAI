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
  AlertCircle,
  Clock,
  Plus,
  Minus,
  RefreshCw,
} from "lucide-react";
import type { Document } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

import { SelectDocViewer } from "@/components/Agent/NoPage/SelectDocViewer";
import { DocViewerSkeleton } from "@/components/Skeletons/DocViewerSkeleton";
import { VerifyValidateSkeleton } from "@/components/Skeletons/VerifyValidateSkeleton";

interface DocumentViewerProps {
  document: Document | null;
  isLoading?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onOperationComplete?: () => void;
}

interface ValidationResponse {
  differences: Array<
    [string, string, string | number, string | number | undefined]
  >;
  extractedData?: unknown;
}

const safeToString = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined) return "N/A";
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
  onOperationComplete,
}: DocumentViewerProps) {
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [isValidating, setIsValidating] = useState(false);
  const [validationData, setValidationData] =
    useState<ValidationResponse | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    if (!document) return;
    setIsVerifying(true);

    // await new Promise((resolve) => setTimeout(resolve, 4000));
    // setIsVerifying(false);
    // onOperationComplete?.();
    // return;

    try {
      const response = await axios.post<ValidationResponse>(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/ops/verify/${document.id}`
      );
      if (response.status !== 200 || !response.data) {
        console.log(response.data);
        return;
      }
      setValidationData(response.data);
      setActiveTab("json");
      onOperationComplete?.();
    } catch (error) {
      console.error("Validation error:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleValidate = async () => {
    if (!document) return;
    setIsValidating(true);

    // await new Promise((resolve) => setTimeout(resolve, 4000));
    // setIsValidating(false);
    // onOperationComplete?.();
    // return;

    try {
      const response = await axios.post<ValidationResponse>(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/ops/validate/${document.id}`
      );
      if (response.status !== 200 || !response.data) {
        console.log(response.data);
        return;
      }

      setValidationData(response.data);
      //   setValidationData({
      //     differences: [
      //       ["+", "totalAmount", 1250.5],
      //       ["~", "invoiceDate", "2023-05-01", "2023-05-10"],
      //       ["+", "taxAmount", 112.55],
      //       ["~", "invoiceNumber", "INV-001", "INV-2023-001"],
      //     ],
      //   });
      setActiveTab("diff");
      //   onOperationComplete?.();
    } catch (error) {
      console.error("Validation error:", error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleValidationUpdate = async (action: "approve" | "reject") => {
    if (!document || !validationData) return;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/ops/validation-update/${document.id}`,
        {
          action,
          validatedData: validationData.extractedData,
        }
      );

      if (response.status === 200) {
        onOperationComplete?.();
        setValidationData(null);
        setActiveTab("table");
      }
    } catch (error) {
      console.error("Error updating validation:", error);
    }
  };

  if (isLoading) return <DocViewerSkeleton />;
  if (!document) return <SelectDocViewer />;

  // Show skeleton during verify/validate operations
  if (isVerifying || isValidating) {
    return (
      <VerifyValidateSkeleton
        type={isVerifying ? "verify" : "validate"}
        document={{
          fileName: document.fileName,
          fileType: document.fileType,
        }}
      />
    );
  }

  const isPdf = document.fileType === "application/pdf";

  return (
    <Card className="border-slate-200 shadow-lg rounded-xl h-full flex flex-col overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      <CardHeader className="px-4 py-3 border-b border-slate-200 shadow-sm bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 max-w-[70%]">
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-2 rounded-lg shadow-sm">
              <FileText className="h-4.5 w-4.5 text-slate-500" />
            </div>
            <div className="flex flex-col">
              <CardTitle className="text-sm font-medium text-slate-800 truncate">
                {document.fileName}
              </CardTitle>
              <Badge
                variant="outline"
                className="text-xs font-normal text-slate-600 mt-0.5 w-fit"
              >
                {document.fileType}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="hidden h-7 bg-blue-600 text-white hover:bg-blue-500 hover:shadow-md hover:scale-[1.02] border-blue-600 shadow-sm transition-all duration-200 text-xs"
              onClick={handleVerify}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <CheckCircle className="h-3 w-3 mr-1" />
              )}
              {isVerifying ? "Verifying..." : "Verify"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 bg-slate-600 text-white hover:bg-slate-500 hover:shadow-md hover:scale-[1.02] border-slate-600 shadow-sm transition-all duration-200 text-xs"
              onClick={handleValidate}
              disabled={isValidating}
            >
              {isValidating ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <ShieldCheck className="h-3 w-3 mr-1" />
              )}
              {isValidating ? "Validating..." : "Validate"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 bg-white hover:bg-slate-50 hover:shadow-sm border-slate-200 shadow-sm transition-all duration-200 text-xs"
              onClick={() => window.open(document.url, "_blank")}
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
            <button
              onClick={onToggleFullscreen}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors shadow-sm border border-slate-200"
              title={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="h-3 w-3 text-slate-500" />
              ) : (
                <Maximize2 className="h-3 w-3 text-slate-500" />
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
          <div className="border-b border-slate-200">
            <TabsList className="bg-slate-100/80 backdrop-blur-lg rounded-full px-2 py-1.5 mx-auto">
              <TabsTrigger
                value="preview"
                className="flex items-center gap-2 px-4 py-1.5 rounded-md transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-blue-800 data-[state=active]:shadow-sm data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:text-blue-800 data-[state=inactive]:hover:bg-white/50"
              >
                <Eye className="h-3.5 w-3.5" />
                <span className="text-sm font-medium">Preview</span>
              </TabsTrigger>

              <TabsTrigger
                value="json"
                className="flex items-center gap-2 px-4 py-1.5 rounded-md transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-blue-800 data-[state=active]:shadow-sm data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:text-blue-800 data-[state=inactive]:hover:bg-white/50"
              >
                <Code className="h-3.5 w-3.5" />
                <span className="text-sm font-medium">JSON</span>
              </TabsTrigger>

              <TabsTrigger
                value="table"
                className="flex items-center gap-2 px-4 py-1.5 rounded-md transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-blue-800 data-[state=active]:shadow-sm data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:text-blue-800 data-[state=inactive]:hover:bg-white/50"
              >
                <Table2 className="h-3.5 w-3.5" />
                <span className="text-sm font-medium">Table View</span>
              </TabsTrigger>

              <TabsTrigger
                value="diff"
                className="flex items-center gap-2 px-4 py-1.5 rounded-md transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-blue-800 data-[state=active]:shadow-sm data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:text-blue-800 data-[state=inactive]:hover:bg-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!validationData}
              >
                <GitCompare className="h-3.5 w-3.5" />
                <span className="text-sm font-medium">Diff View</span>
                {!validationData && (
                  <Badge
                    variant="outline"
                    className="ml-1.5 text-xs bg-white/50 backdrop-blur-sm"
                  >
                    Run validation first
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Preview Tab */}
          <TabsContent
            value="preview"
            className="flex-1 p-0 m-0 h-full overflow-hidden"
          >
            {isPdf ? (
              <div className="h-full w-full overflow-auto bg-gradient-to-b from-slate-50 to-white">
                <object
                  data={document.url}
                  type="application/pdf"
                  className="w-full h-full border-0"
                  title={document.fileName}
                />
              </div>
            ) : (
              <div className="text-center p-8 space-y-4">
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center shadow-sm">
                  <FileText className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-800">
                  Preview not available
                </h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  This file type cannot be previewed directly.
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.open(document.url, "_blank")}
                  className="bg-white hover:bg-slate-50 border-slate-200 shadow-sm mt-2"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in new tab
                </Button>
              </div>
            )}
          </TabsContent>

          {/* JSON Tab */}
          <TabsContent
            value="json"
            className="flex-1 p-4 m-0 h-full overflow-hidden"
          >
            <div className="h-full bg-slate-900 text-slate-50 p-5 rounded-xl overflow-auto shadow-inner">
              <pre className="text-sm font-mono whitespace-pre-wrap break-words">
                {document.extractedData
                  ? JSON.stringify(document.extractedData, null, 2)
                  : "No extracted data available for this document."}
              </pre>
            </div>
          </TabsContent>

          {/* Table Tab */}
          <TabsContent
            value="table"
            className="flex-1 p-4 m-0 h-full overflow-hidden"
          >
            {document.extractedData ? (
              <div className="h-full overflow-auto">
                <div className="space-y-8">
                  {/* General Data Section */}
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
                            <th className="text-left p-2.5 font-medium text-slate-600 text-xs uppercase tracking-wider">
                              Field
                            </th>
                            <th className="text-left p-2.5 font-medium text-slate-600 text-xs uppercase tracking-wider">
                              Value
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {Object.entries(
                            document.extractedData.generalData || {}
                          ).map(([key, value]) => (
                            <tr
                              key={key}
                              className="hover:bg-slate-50/30 transition-colors"
                            >
                              <td className="p-2.5 font-medium text-slate-700 text-sm">
                                {formatKey(key)}
                              </td>
                              <td className="p-2.5">
                                {value === "Missing" ? (
                                  <span className="text-red-500 font-medium text-sm">
                                    Missing
                                  </span>
                                ) : (
                                  <span className="text-slate-600 text-sm">
                                    {safeToString(value)}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Grouped Data Section */}
                  {/* {document.extractedData.groupedData && (
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                        <h3 className="text-lg font-semibold text-slate-800">
                          Grouped Information
                        </h3>
                      </div>
                      {document.extractedData.groupedData.items && (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-slate-50">
                                {Object.keys(
                                  document.extractedData.groupedData.items[0] ||
                                    {}
                                ).map((header) => (
                                  <th
                                    key={header}
                                    className={`p-3 font-medium text-slate-600 text-xs uppercase tracking-wider ${
                                      ["amount", "qty", "rate"].includes(header)
                                        ? "text-right"
                                        : "text-left"
                                    }`}
                                  >
                                    {formatKey(header)}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {document.extractedData.groupedData.items.map(
                                (item: GroupedDataItem, index: number) => (
                                  <tr
                                    key={index}
                                    className="hover:bg-slate-50/50 transition-colors"
                                  >
                                    {Object.entries(item).map(
                                      ([key, value]) => (
                                        <td
                                          key={key}
                                          className={`p-3 ${
                                            ["amount", "qty", "rate"].includes(
                                              key
                                            )
                                              ? "text-right font-medium text-slate-700 text-sm"
                                              : "text-slate-600 text-sm"
                                          }`}
                                        >
                                          {safeToString(value)}
                                        </td>
                                      )
                                    )}
                                  </tr>
                                )
                              )}
                            </tbody>
                            {document.extractedData.groupedData.total && (
                              <tfoot className="bg-slate-50 font-medium">
                                <tr>
                                  <td
                                    colSpan={
                                      Object.keys(
                                        document.extractedData.groupedData
                                          .items[0] || {}
                                      ).length - 1
                                    }
                                    className="p-3 text-right text-slate-700 text-sm"
                                  >
                                    Total:
                                  </td>
                                  <td className="p-3 text-right text-slate-700 text-sm">
                                    {document.extractedData.groupedData.total
                                      .totalAmount ||
                                      document.extractedData.groupedData.total
                                        .amount ||
                                      "N/A"}
                                  </td>
                                </tr>
                              </tfoot>
                            )}
                          </table>
                        </div>
                      )}
                    </div>
                  )} */}

                  {/* Validation Data Section */}
                  {document.extractedData?.validationData &&
                    Object.keys(document.extractedData.validationData).length >
                      0 && (
                      <div className="bg-white rounded-lg shadow-sm border border-amber-100">
                        <div className="px-6 py-4 border-b border-amber-100 bg-amber-50/50">
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center">
                              <Clock className="h-3 w-3 text-amber-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-amber-800">
                              Pending Validation
                            </h3>
                          </div>
                          <p className="text-sm text-amber-600 mt-1">
                            Data exists but requires validation
                          </p>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.keys(
                              document.extractedData.validationData
                            ).map((key: string) => (
                              <div
                                key={key}
                                className="flex items-start gap-3 p-3 bg-amber-50/50 rounded-lg border border-amber-100 hover:bg-amber-50 transition-colors"
                              >
                                <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mt-0.5">
                                  <Clock className="h-3 w-3 text-amber-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-amber-800">
                                    {formatKey(key)}
                                  </p>
                                  <p className="text-sm text-amber-600">
                                    Awaiting validation
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Missing Data Section */}
                  {document.extractedData.missingData &&
                    Object.keys(document.extractedData.missingData).length >
                      0 && (
                      <div className="bg-white rounded-lg shadow-sm border border-red-100">
                        <div className="px-6 py-4 border-b border-red-100 bg-red-50/50">
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center">
                              <AlertCircle className="h-3 w-3 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-red-800">
                              Missing Information
                            </h3>
                          </div>
                          <p className="text-sm text-red-600 mt-1">
                            Required data is not present in the document
                          </p>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.keys(
                              document.extractedData.missingData
                            ).map((key) => (
                              <div
                                key={key}
                                className="flex items-start gap-3 p-3 bg-red-50/50 rounded-lg border border-red-100 hover:bg-red-50 transition-colors"
                              >
                                <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                                  <AlertCircle className="h-3 w-3 text-red-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-red-800">
                                    {formatKey(key)}
                                  </p>
                                  <p className="text-sm text-red-600">
                                    Not found in document
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                <div className="text-center space-y-4">
                  <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center shadow-sm">
                    <FileText className="h-10 w-10 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800">
                    No extracted data available
                  </h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    This document does not have any extracted data to display.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Diff Tab */}
          <TabsContent
            value="diff"
            className="flex-1 p-4 m-0 h-full overflow-hidden"
          >
            {validationData ? (
              <div className="h-full overflow-auto">
                <div className="space-y-4">
                  <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-200">
                    {validationData.differences &&
                    validationData.differences.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-md font-medium text-slate-700">
                            Changes Found ({validationData.differences.length})
                          </h4>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                              onClick={() => handleValidationUpdate("reject")}
                            >
                              Reject
                            </Button>
                            <Button
                              variant="outline"
                              className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                              onClick={() => handleValidationUpdate("approve")}
                            >
                              Approve
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {validationData.differences.map((diff, index) => {
                            const [type, path, oldValue, newValue] = diff;
                            const fieldName = path.split(".").pop() || "";

                            return (
                              <div
                                key={index}
                                className={`p-3 rounded-lg border ${
                                  type === "+"
                                    ? "bg-green-50/50 border-green-200"
                                    : type === "-"
                                    ? "bg-red-50/50 border-red-200"
                                    : "bg-blue-50/50 border-blue-200"
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <div
                                    className={`h-6 w-6 rounded-full flex items-center justify-center ${
                                      type === "+"
                                        ? "bg-green-100 text-green-700"
                                        : type === "-"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-blue-100 text-blue-700"
                                    }`}
                                  >
                                    {type === "+" ? (
                                      <Plus className="h-3.5 w-3.5" />
                                    ) : type === "-" ? (
                                      <Minus className="h-3.5 w-3.5" />
                                    ) : (
                                      <RefreshCw className="h-3.5 w-3.5" />
                                    )}
                                  </div>
                                  <span className="font-medium text-slate-700">
                                    {formatKey(fieldName)}
                                  </span>
                                </div>

                                {type === "~" ? (
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white p-2 rounded border border-slate-200">
                                      <div className="text-xs text-slate-500 mb-1">
                                        Previous Value
                                      </div>
                                      <div className="text-slate-700">
                                        {safeToString(oldValue)}
                                      </div>
                                    </div>
                                    <div className="bg-white p-2 rounded border border-slate-200">
                                      <div className="text-xs text-slate-500 mb-1">
                                        New Value
                                      </div>
                                      <div className="text-slate-700">
                                        {safeToString(newValue)}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="bg-white p-2 rounded border border-slate-200">
                                    <div className="text-xs text-slate-500 mb-1">
                                      {type === "+"
                                        ? "Added Value"
                                        : "Removed Value"}
                                    </div>
                                    <div className="text-slate-700">
                                      {safeToString(
                                        type === "+" ? oldValue : oldValue
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="bg-green-50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-800 mb-2">
                          No Changes Found
                        </h3>
                        <p className="text-slate-600">
                          The document data matches the expected format.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                <div className="text-center space-y-4">
                  <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center shadow-sm">
                    <GitCompare className="h-10 w-10 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800">
                    No validation data available
                  </h3>
                  <p className="text-slate-500 max-w-md mx-auto">
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
