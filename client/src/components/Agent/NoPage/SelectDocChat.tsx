import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export function SelectDocChat() {
  return (
    <Card className="h-full border-slate-200 shadow-lg rounded-xl overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      <CardHeader className="px-5 py-4 border-b border-slate-200 shadow-sm bg-white">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-2.5 rounded-lg shadow-sm">
            <MessageSquare className="h-5 w-5 text-slate-600" />
          </div>
          <div className="flex flex-col">
            <CardTitle className="text-base font-medium text-slate-800">
              Chat Interface
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Interact with AI assistant
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center p-8 min-h-[calc(100%-4rem)]">
        <div className="text-center space-y-5 max-w-sm mx-auto">
          <div className="relative mx-auto w-fit">
            <div className="absolute inset-0 bg-slate-400/10 blur-xl rounded-full"></div>
            <div className="relative w-20 h-20 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-sm border border-slate-200/50">
              <MessageSquare className="h-10 w-10 text-slate-600" />
            </div>
          </div>
          <div className="space-y-2.5">
            <h3 className="text-lg font-medium text-slate-800">
              No Active Chat
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-[15rem] mx-auto">
              Select a document to begin analyzing and chatting with our AI
              assistant
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
