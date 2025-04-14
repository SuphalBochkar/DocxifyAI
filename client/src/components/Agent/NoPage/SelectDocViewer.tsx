import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export function SelectDocViewer() {
  return (
    <Card className="border-slate-200 shadow-lg rounded-xl h-full flex flex-col overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      <CardHeader className="px-5 py-4 border-b border-slate-200 shadow-sm bg-white">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-2.5 rounded-lg shadow-sm">
            <FileText className="h-5 w-5 text-slate-600" />
          </div>
          <div className="flex flex-col">
            <CardTitle className="text-base font-medium text-slate-800">
              Document Viewer
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Preview and analyze documents
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-5 max-w-sm">
          <div className="relative mx-auto">
            <div className="absolute inset-0 bg-slate-400/10 blur-xl rounded-full"></div>
            <div className="relative w-20 h-20 mx-auto rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-sm border border-slate-200/50">
              <FileText className="h-10 w-10 text-slate-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-slate-800">
              No Document Selected
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Choose a document from the list to view its contents and analyze
              the extracted data
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
