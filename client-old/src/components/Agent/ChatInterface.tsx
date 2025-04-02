import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { ChatMessage } from "../../lib/types";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInterface({
  messages,
  onSendMessage,
  isLoading,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-2 ${
              message.role === "assistant" ? "flex-row" : "flex-row-reverse"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-[80%] ${
                message.role === "assistant"
                  ? "bg-gray-100 text-gray-900"
                  : "bg-blue-600 text-white"
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                {message.role === "assistant" ? (
                  <Bot className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {message.role === "assistant" ? "AI Assistant" : "You"}
                </span>
              </div>
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about missing information..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`px-4 py-2 rounded-lg ${
              !input.trim() || isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

// "use client";

// import type React from "react";

// import { useState, useRef, useEffect } from "react";
// import { Send, Loader2 } from "lucide-react";
// import type { ChatMessage } from "../../lib/types";
// import { Button } from "../ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import { Avatar, AvatarFallback } from "../ui/avatar";
// import { cn } from "../../lib/utils";

// interface ChatInterfaceProps {
//   messages: ChatMessage[];
//   onSendMessage: (message: string) => void;
//   isLoading?: boolean;
//   selectedDocument?: { id: string; name: string } | null;
// }

// export function ChatInterface({
//   messages,
//   onSendMessage,
//   isLoading = false,
//   selectedDocument,
// }: ChatInterfaceProps) {
//   const [input, setInput] = useState("");
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLTextAreaElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (input.trim() && !isLoading) {
//       onSendMessage(input.trim());
//       setInput("");
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }
//   };

//   // Auto-resize textarea
//   useEffect(() => {
//     if (inputRef.current) {
//       inputRef.current.style.height = "auto";
//       inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
//     }
//   }, [input]);

//   return (
//     <Card className="flex flex-col h-full border-slate-200 shadow-sm overflow-hidden">
//       <CardHeader className="px-4 py-3 border-b bg-slate-50">
//         <div className="flex items-center justify-between">
//           <CardTitle className="text-lg font-medium text-slate-800">
//             AI Assistant
//           </CardTitle>
//           {selectedDocument && (
//             <div className="text-sm text-slate-500">
//               Document:{" "}
//               <span className="font-medium">{selectedDocument.name}</span>
//             </div>
//           )}
//         </div>
//       </CardHeader>
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={cn(
//               "flex items-start gap-3",
//               message.role === "assistant" ? "" : "justify-end"
//             )}
//           >
//             {message.role === "assistant" && (
//               <Avatar className="h-8 w-8 mt-1">
//                 <AvatarFallback className="bg-blue-100 text-blue-800">
//                   AI
//                 </AvatarFallback>
//               </Avatar>
//             )}
//             <div
//               className={cn(
//                 "rounded-lg px-4 py-2 max-w-[80%] text-sm",
//                 message.role === "assistant"
//                   ? "bg-slate-100 text-slate-800"
//                   : "bg-blue-600 text-white"
//               )}
//             >
//               <div className="mb-1 font-medium">
//                 {message.role === "assistant" ? "AI Assistant" : "You"}
//               </div>
//               <div className="whitespace-pre-wrap">{message.content}</div>
//               <div className="mt-1 text-xs opacity-70">
//                 {new Date(message.timestamp).toLocaleTimeString()}
//               </div>
//             </div>
//             {message.role === "user" && (
//               <Avatar className="h-8 w-8 mt-1">
//                 <AvatarFallback className="bg-slate-200 text-slate-800">
//                   You
//                 </AvatarFallback>
//               </Avatar>
//             )}
//           </div>
//         ))}
//         {isLoading && (
//           <div className="flex items-start gap-3">
//             <Avatar className="h-8 w-8 mt-1">
//               <AvatarFallback className="bg-blue-100 text-blue-800">
//                 AI
//               </AvatarFallback>
//             </Avatar>
//             <div className="rounded-lg px-4 py-3 bg-slate-100 text-slate-800">
//               <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       <CardContent className="p-4 border-t mt-auto">
//         <form onSubmit={handleSubmit} className="flex gap-2">
//           <div className="relative flex-1">
//             <textarea
//               ref={inputRef}
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder={
//                 selectedDocument
//                   ? "Ask about this document..."
//                   : "Select a document to start chatting..."
//               }
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[40px] max-h-[120px]"
//               disabled={isLoading || !selectedDocument}
//               rows={1}
//             />
//           </div>
//           <Button
//             type="submit"
//             disabled={!input.trim() || isLoading || !selectedDocument}
//             className="shrink-0"
//           >
//             {isLoading ? (
//               <Loader2 className="h-5 w-5 animate-spin" />
//             ) : (
//               <Send className="h-5 w-5" />
//             )}
//             <span className="sr-only">Send message</span>
//           </Button>
//         </form>
//         {!selectedDocument && (
//           <p className="text-sm text-slate-500 mt-2 text-center">
//             Please select a document to start a conversation
//           </p>
//         )}
//       </CardContent>
//     </Card>
//   );
// }
