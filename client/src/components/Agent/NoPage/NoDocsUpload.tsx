import { FileText, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NoDocUploadProps {
  onUpload?: () => void;
}

export function NoRecordsUpload({ onUpload }: NoDocUploadProps) {
  return (
    <Card className="h-full border-slate-200 shadow-lg rounded-xl overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-6 shadow-sm">
          <FileText className="h-10 w-10 text-slate-600" />
        </div>
        <h3 className="text-xl font-medium text-slate-800 mb-2">
          No Documents Available
        </h3>
        <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
          Select a document to start analyzing and extracting information with
          our AI assistant.
        </p>
        {onUpload && (
          <Button
            onClick={onUpload}
            className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
