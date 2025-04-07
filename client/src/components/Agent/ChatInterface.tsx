"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { cn } from "../../lib/utils";

interface ChatInterfaceProps {
  messages: {
    id: string;
    role: "assistant" | "user";
    content: string;
    timestamp: number;
  }[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInterface({
  messages,
  onSendMessage,
  isLoading = false,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <Card className="flex flex-col h-full border-slate-200 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="px-5 py-4 border-b bg-gradient-to-r from-blue-800 to-blue-900 text-white flex items-center">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-900 text-white">
              🤖
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-lg font-semibold">AI Assistant</CardTitle>
        </div>
      </CardHeader>
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-slate-50 to-white">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-start gap-3 max-w-[85%]",
              message.role === "assistant" ? "" : "ml-auto"
            )}
          >
            {message.role === "assistant" && (
              <Avatar className="h-9 w-9 flex-shrink-0">
                <AvatarFallback className="bg-blue-800 text-white">
                  🤖
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                "rounded-xl px-4 py-3 text-sm shadow-sm",
                message.role === "assistant"
                  ? "bg-white text-gray-900 border border-slate-200"
                  : "bg-blue-800 text-white"
              )}
            >
              <div className="font-semibold mb-1">
                {message.role === "assistant" ? "AI Assistant" : "You"}
              </div>
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div className="mt-1 text-xs text-gray-500 text-right">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
            {message.role === "user" && (
              <Avatar className="h-9 w-9 flex-shrink-0">
                <AvatarFallback className="bg-blue-800 text-white">
                  👤
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3 max-w-[85%]">
            <Avatar className="h-9 w-9 flex-shrink-0">
              <AvatarFallback className="bg-blue-800 text-white">
                🤖
              </AvatarFallback>
            </Avatar>
            <div className="rounded-xl px-4 py-3 bg-white border border-slate-200 text-gray-900 shadow-sm">
              <Loader2 className="h-5 w-5 animate-spin text-blue-800" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <CardContent className="p-4 border-t bg-white">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about missing information..."
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-transparent resize-none min-h-[40px] max-h-[100px] transition-all duration-200"
            disabled={isLoading}
            rows={1}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-blue-800 hover:bg-blue-900 text-white rounded-xl p-2 transition-colors duration-200 flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
