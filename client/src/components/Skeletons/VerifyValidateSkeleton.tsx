"use client";

import { motion } from "framer-motion";
import {
  CheckCircle,
  ShieldCheck,
  FileText,
  Eye,
  Code,
  Table2,
  GitCompare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VerifyValidateSkeletonProps {
  type: "verify" | "validate";
  document: {
    fileName: string;
    fileType: string;
  };
}

export function VerifyValidateSkeleton({
  type,
  document,
}: VerifyValidateSkeletonProps) {
  const Icon = type === "verify" ? CheckCircle : ShieldCheck;
  const title = type === "verify" ? "Verifying Document" : "Validating Data";
  const description =
    type === "verify"
      ? "Checking document authenticity and integrity..."
      : "Analyzing data structure and content...";

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
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
        <Tabs defaultValue="diff" className="flex-1 flex flex-col h-full">
          <div className="border-b border-slate-200">
            <TabsList className="bg-transparent p-0 h-auto">
              <TabsTrigger
                value="preview"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-800 px-4 py-2 transition-all duration-200"
              >
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                Preview
              </TabsTrigger>
              <TabsTrigger
                value="json"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-800 px-4 py-2 transition-all duration-200"
              >
                <Code className="h-3.5 w-3.5 mr-1.5" />
                JSON
              </TabsTrigger>
              <TabsTrigger
                value="table"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-800 px-4 py-2 transition-all duration-200"
              >
                <Table2 className="h-3.5 w-3.5 mr-1.5" />
                Table View
              </TabsTrigger>
              <TabsTrigger
                value="diff"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-800 px-4 py-2 transition-all duration-200"
              >
                <GitCompare className="h-3.5 w-3.5 mr-1.5" />
                Diff View
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="preview"
            className="flex-1 p-0 m-0 h-full overflow-hidden"
          >
            <div className="h-full w-full flex flex-col items-center justify-center p-8">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-2xl mx-auto"
              >
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          type === "verify"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-amber-100 text-amber-600"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-800">
                          {title}
                        </h3>
                        <p className="text-sm text-slate-500">{description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      {type === "verify" ? (
                        <>
                          <StepSkeleton label="Checking document signature" />
                          <StepSkeleton label="Verifying document integrity" />
                          <StepSkeleton label="Validating document format" />
                        </>
                      ) : (
                        <>
                          <StepSkeleton label="Analyzing data structure" />
                          <StepSkeleton label="Checking field completeness" />
                          <StepSkeleton label="Validating data types" />
                          <StepSkeleton label="Cross-referencing values" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent
            value="json"
            className="flex-1 p-4 m-0 h-full overflow-hidden"
          >
            <div className="h-full w-full flex flex-col items-center justify-center p-8">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-2xl mx-auto"
              >
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          type === "verify"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-amber-100 text-amber-600"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-800">
                          {title}
                        </h3>
                        <p className="text-sm text-slate-500">{description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      {type === "verify" ? (
                        <>
                          <StepSkeleton label="Checking document signature" />
                          <StepSkeleton label="Verifying document integrity" />
                          <StepSkeleton label="Validating document format" />
                        </>
                      ) : (
                        <>
                          <StepSkeleton label="Analyzing data structure" />
                          <StepSkeleton label="Checking field completeness" />
                          <StepSkeleton label="Validating data types" />
                          <StepSkeleton label="Cross-referencing values" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent
            value="table"
            className="flex-1 p-4 m-0 h-full overflow-hidden"
          >
            <div className="h-full w-full flex flex-col items-center justify-center p-8">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-2xl mx-auto"
              >
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          type === "verify"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-amber-100 text-amber-600"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-800">
                          {title}
                        </h3>
                        <p className="text-sm text-slate-500">{description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      {type === "verify" ? (
                        <>
                          <StepSkeleton label="Checking document signature" />
                          <StepSkeleton label="Verifying document integrity" />
                          <StepSkeleton label="Validating document format" />
                        </>
                      ) : (
                        <>
                          <StepSkeleton label="Analyzing data structure" />
                          <StepSkeleton label="Checking field completeness" />
                          <StepSkeleton label="Validating data types" />
                          <StepSkeleton label="Cross-referencing values" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent
            value="diff"
            className="flex-1 p-4 m-0 h-full overflow-hidden"
          >
            <div className="h-full w-full flex flex-col items-center justify-center p-8">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-2xl mx-auto"
              >
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          type === "verify"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-amber-100 text-amber-600"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-800">
                          {title}
                        </h3>
                        <p className="text-sm text-slate-500">{description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      {type === "verify" ? (
                        <>
                          <StepSkeleton label="Checking document signature" />
                          <StepSkeleton label="Verifying document integrity" />
                          <StepSkeleton label="Validating document format" />
                        </>
                      ) : (
                        <>
                          <StepSkeleton label="Analyzing data structure" />
                          <StepSkeleton label="Checking field completeness" />
                          <StepSkeleton label="Validating data types" />
                          <StepSkeleton label="Cross-referencing values" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function StepSkeleton({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-6 w-6 rounded-full bg-slate-100 animate-pulse" />
      <div className="flex-1">
        <div className="h-4 w-48 bg-slate-100 rounded animate-pulse" />
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
}
