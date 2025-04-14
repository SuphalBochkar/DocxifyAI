import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FileText } from "lucide-react";

export function DocViewerSkeleton() {
  return (
    <Card className="border-slate-200 shadow-lg rounded-xl h-full flex flex-col overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      <CardHeader className="px-5 py-4 border-b border-slate-200 shadow-sm bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 max-w-[70%]">
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-2.5 rounded-lg shadow-sm">
              <FileText className="h-5 w-5 text-slate-500" />
            </div>
            <div className="flex flex-col">
              <div className="h-5 w-48 rounded-md bg-gradient-to-r from-slate-100 to-slate-200 animate-pulse" />
              <div className="h-3 w-24 rounded-md bg-gradient-to-r from-slate-100 to-slate-200 animate-pulse mt-1" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-20 rounded-lg bg-gradient-to-r from-slate-100 to-slate-200 animate-pulse shadow-sm" />
            <div className="h-8 w-20 rounded-lg bg-gradient-to-r from-slate-100 to-slate-200 animate-pulse shadow-sm" />
            <div className="h-8 w-20 rounded-lg bg-gradient-to-r from-slate-100 to-slate-200 animate-pulse shadow-sm" />
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse shadow-sm" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
        <div className="border-b border-slate-200">
          <div className="flex items-center gap-4 px-5 py-3">
            <div className="h-9 w-28 rounded-lg bg-gradient-to-r from-slate-100 to-slate-200 animate-pulse shadow-sm" />
            <div className="h-9 w-28 rounded-lg bg-gradient-to-r from-slate-100 to-slate-200 animate-pulse shadow-sm" />
            <div className="h-9 w-28 rounded-lg bg-gradient-to-r from-slate-100 to-slate-200 animate-pulse shadow-sm" />
            <div className="h-9 w-28 rounded-lg bg-gradient-to-r from-slate-100 to-slate-200 animate-pulse shadow-sm" />
          </div>
        </div>
        <div className="flex-1 p-6 overflow-auto">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse shadow-sm" />
              <div className="space-y-2.5">
                <div className="h-5 w-56 rounded-md bg-gradient-to-r from-slate-100 to-slate-200 animate-pulse" />
                <div className="h-4 w-40 rounded-md bg-gradient-to-r from-slate-100 to-slate-200 animate-pulse" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 w-full rounded-md bg-gradient-to-r from-slate-100 to-slate-200 animate-pulse" />
              <div className="h-4 w-5/6 rounded-md bg-gradient-to-r from-slate-100 to-slate-200 animate-pulse" />
              <div className="h-4 w-4/6 rounded-md bg-gradient-to-r from-slate-100 to-slate-200 animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="h-4 w-full rounded-md bg-gradient-to-r from-slate-100 to-slate-200 animate-pulse" />
              <div className="h-4 w-5/6 rounded-md bg-gradient-to-r from-slate-100 to-slate-200 animate-pulse" />
              <div className="h-4 w-4/6 rounded-md bg-gradient-to-r from-slate-100 to-slate-200 animate-pulse" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
