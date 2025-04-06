"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { cn } from "../../lib/utils";

interface ChatInterfaceProps {
  messages: { id: string; role: "assistant" | "user"; content: string; timestamp: number }[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInterface({ messages, onSendMessage, isLoading = false }: ChatInterfaceProps) {
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
    <Card className="flex flex-col h-full border-gray-200 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="px-5 py-4 border-b bg-blue-600 text-white flex items-center">
        <CardTitle className="text-lg font-semibold">AI Assistant</CardTitle>
      </CardHeader>
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div key={message.id} className={cn("flex items-start gap-3", message.role === "assistant" ? "" : "justify-end")}>            
            {message.role === "assistant" && (
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-blue-800 text-white">🤖</AvatarFallback>
              </Avatar>
            )}
            <div className={cn(
              "rounded-lg px-4 py-3 max-w-[75%] text-sm shadow-md",
              message.role === "assistant" ? "bg-white text-gray-900 border border-gray-300" : "bg-blue-600 text-white"
            )}>
              <div className="font-semibold mb-1">{message.role === "assistant" ? "AI Assistant" : "You"}</div>
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div className="mt-1 text-xs text-gray-500 text-right">{new Date(message.timestamp).toLocaleTimeString()}</div>
            </div>
            {message.role === "user" && (
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-blue-800 text-white">👤</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-blue-800 text-white">🤖</AvatarFallback>
            </Avatar>
            <div className="rounded-lg px-4 py-3 bg-white border border-gray-300 text-gray-900 shadow-md">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none min-h-[40px] max-h-[100px]"
            disabled={isLoading}
            rows={1}
          />
          <Button type="submit" disabled={!input.trim() || isLoading} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2">
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
