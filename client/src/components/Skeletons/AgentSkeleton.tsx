import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AgentSkeleton() {
  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100 w-full h-full">
      <div className="max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-6 py-4">
        <div className="flex flex-col h-[calc(100vh-9rem)] overflow-hidden">
          <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
            {/* Document List Skeleton - 3 columns (25%) */}
            <div className="col-span-3 h-full overflow-hidden">
              <Card className="border-slate-200 shadow-lg rounded-xl h-full flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b shadow-sm">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-lg bg-slate-200" />
                    <Skeleton className="h-6 w-24 bg-slate-200" />
                  </div>
                  <Skeleton className="h-8 w-24 bg-slate-200 rounded-lg" />
                </div>
                <div className="flex flex-col flex-1 min-h-0">
                  <div className="p-3 border-b">
                    <Skeleton className="w-full h-10 bg-slate-200 rounded-xl" />
                  </div>

                  <div className="flex-1 overflow-y-auto min-h-0">
                    <div className="divide-y">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="p-4">
                          <div className="flex flex-col gap-2">
                            {/* Document header with name and actions */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <Skeleton className="h-10 w-10 rounded-xl bg-slate-200 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <Skeleton className="h-5 w-3/4 bg-slate-200 mb-2" />
                                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                                    <Skeleton className="h-5 w-20 bg-slate-200 rounded-full" />
                                    <Skeleton className="h-5 w-28 bg-slate-200 rounded-full" />
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <Skeleton className="h-5 w-16 bg-slate-200 rounded-full" />
                                <Skeleton className="h-7 w-7 rounded-xl bg-slate-200" />
                              </div>
                            </div>

                            {/* Document details */}
                            <div className="grid grid-cols-3 gap-3 pl-12">
                              <div className="flex items-center gap-1.5">
                                <Skeleton className="h-3.5 w-3.5 bg-slate-200" />
                                <Skeleton className="h-3 w-16 bg-slate-200" />
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Skeleton className="h-3.5 w-3.5 bg-slate-200" />
                                <Skeleton className="h-3 w-20 bg-slate-200" />
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Skeleton className="h-3.5 w-3.5 bg-slate-200" />
                                <Skeleton className="h-3 w-16 bg-slate-200" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Document Viewer Skeleton - 6 columns (50%) */}
            <div className="col-span-6 h-full overflow-hidden">
              <Card className="border-slate-200 shadow-lg rounded-xl h-full flex flex-col">
                <CardHeader className="px-4 py-3 border-b bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 max-w-[70%]">
                      <Skeleton className="h-6 w-48 bg-slate-200" />
                      <Skeleton className="h-5 w-20 bg-slate-200 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-20 bg-slate-200 rounded-md" />
                      <Skeleton className="h-8 w-24 bg-slate-200 rounded-md" />
                      <Skeleton className="h-8 w-24 bg-slate-200 rounded-md" />
                      <Skeleton className="h-8 w-8 bg-slate-200 rounded-lg" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                  <div className="border-b">
                    <div className="flex bg-transparent p-0 h-auto">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="px-4 py-2">
                          <Skeleton className="h-5 w-16 bg-slate-200" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 p-4 bg-gradient-to-b from-slate-50 to-white">
                    <div className="h-full w-full flex items-center justify-center">
                      <Skeleton className="h-64 w-64 bg-slate-200 rounded-lg" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat Interface Skeleton - 3 columns (25%) */}
            <div className="col-span-3 h-full flex flex-col overflow-hidden">
              <Card className="flex flex-col h-full border-slate-200 shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="px-5 py-4 border-b bg-slate-50 flex items-center">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full bg-slate-200" />
                    <Skeleton className="h-6 w-32 bg-slate-200" />
                  </div>
                </CardHeader>
                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-slate-50 to-white">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 max-w-[85%]"
                    >
                      <Skeleton className="h-9 w-9 rounded-full bg-slate-200 flex-shrink-0" />
                      <div className="rounded-xl px-4 py-3 text-sm shadow-sm bg-white border border-slate-200">
                        <Skeleton className="h-4 w-24 bg-slate-200 mb-2" />
                        <Skeleton className="h-4 w-full bg-slate-200 mb-1" />
                        <Skeleton className="h-4 w-3/4 bg-slate-200 mb-1" />
                        <Skeleton className="h-3 w-16 bg-slate-200 mt-2 ml-auto" />
                      </div>
                    </div>
                  ))}
                </div>
                <CardContent className="p-4 border-t bg-white">
                  <div className="flex gap-3">
                    <Skeleton className="flex-1 h-10 bg-slate-200 rounded-xl" />
                    <Skeleton className="h-10 w-10 bg-slate-200 rounded-xl" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
