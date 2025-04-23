"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Loader2,
  Bot,
  User,
  X,
  Minimize2,
  Maximize2,
  MessageSquare,
} from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface PopupChatProps {
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  selectedDocument: {
    id: string;
    fileName: string;
    fileType: string;
    url: string;
  } | null;
  setIsLoading: (isLoading: boolean) => void;
  isOpen?: boolean;
  onToggleOpen?: () => void;
}

export function PopupChat({
  messages,
  setMessages,
  selectedDocument,
  setIsLoading,
  isOpen = false,
  onToggleOpen,
}: PopupChatProps) {
  const [input, setInput] = useState("");
  const [isLoading, setLocalLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [assistantId, setAssistantId] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const initializingRef = useRef(false);
  const currentDocumentRef = useRef<string | null>(null);

  useEffect(() => {
    // console.log("State updated:", {
    //   threadId,
    //   assistantId,
    //   isLoading,
    //   currentDocument: currentDocumentRef.current,
    // });
  }, [threadId, assistantId, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(
        inputRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [input]);

  // Handle clicks outside the chat to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatRef.current &&
        !chatRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        onToggleOpen?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggleOpen]);

  const initializeChat = useCallback(async () => {
    // Prevent initialization if already in progress or no document
    if (!selectedDocument || initializingRef.current) return;

    // Prevent re-initialization for same document
    if (currentDocumentRef.current === selectedDocument.id) return;

    initializingRef.current = true;
    currentDocumentRef.current = selectedDocument.id;

    try {
      setLocalLoading(true);

      // Set welcome message immediately
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `Hello! I'm your document assistant. I can help you analyze "${selectedDocument.fileName}". What would you like to know?`,
          timestamp: new Date().toISOString(),
        },
      ]);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/chat/thread`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentId: selectedDocument.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to initialize chat");
      }

      const data = await response.json();

      // Update states with the new thread and assistant IDs
      setThreadId(data.threadId);
      setAssistantId(data.assistantId);
    } catch (error) {
      console.error("Error initializing chat:", error);
      setMessages([
        {
          id: "error",
          role: "assistant",
          content:
            "Sorry, I couldn't initialize the chat. Please try again later.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLocalLoading(false);
      initializingRef.current = false;
    }
  }, [selectedDocument, setMessages]);

  useEffect(() => {
    // Reset state when no document is selected
    if (!selectedDocument) {
      setThreadId(null);
      setAssistantId(null);
      currentDocumentRef.current = null;
      setMessages([]);
      return;
    }

    // Initialize chat for new document
    if (selectedDocument.id !== currentDocumentRef.current) {
      setThreadId(null);
      setAssistantId(null);
      initializeChat();
    }
  }, [selectedDocument, initializeChat, setMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !input.trim() ||
      isLoading ||
      !threadId ||
      !assistantId ||
      !selectedDocument
    ) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    // Add user message immediately
    setMessages([...messages, userMessage]);
    setInput("");
    setLocalLoading(true);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/chat/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentId: selectedDocument.id,
            message: input.trim(),
            threadId,
            assistantId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      // Add assistant's response
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant" as const,
        content: data.response,
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, userMessage, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message
      const errorMessage: ChatMessage = {
        id: "error",
        role: "assistant" as const,
        content:
          "Sorry, I couldn't process your message. Please try again later.",
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, userMessage, errorMessage]);
    } finally {
      setLocalLoading(false);
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const getCorrectFormatText = (message: ChatMessage) => {
    if (message.role === "assistant" && message.content.startsWith("```json")) {
      try {
        // Extract JSON content between the backticks
        const jsonContent = message.content.replace(
          /```json\n([\s\S]*?)```/g,
          "$1"
        );
        const parsedJson = JSON.parse(jsonContent);

        return (
          <div className="bg-slate-50 rounded-md p-3 border border-slate-200">
            <div className="text-xs text-slate-500 mb-1 font-mono">
              JSON Response
            </div>
            <div className="font-mono text-sm">
              {Object.entries(parsedJson).map(([key, value], index) => (
                <div key={index} className="flex items-start mb-1 last:mb-0">
                  <span className="text-blue-600 mr-2">{key}:</span>
                  <span className="text-slate-800 font-medium">
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }

    return <div className="whitespace-pre-wrap">{message.content}</div>;
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggleOpen}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-700 hover:to-blue-800 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 z-50"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={chatRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "fixed bottom-6 right-6 z-50 w-[480px] shadow-2xl rounded-xl overflow-hidden",
            isMinimized ? "h-16" : "h-[700px]"
          )}
        >
          <Card className="h-full flex flex-col border-slate-200 shadow-lg rounded-xl overflow-hidden bg-gradient-to-b from-slate-50 to-white">
            <CardHeader className="px-4 py-3 border-b border-slate-200 bg-white/80 backdrop-blur-sm flex flex-row items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="bg-gradient-to-br from-blue-800 to-blue-900 p-2 rounded-lg shadow-sm">
                  <Bot className="h-4.5 w-4.5 text-white" />
                </div>
                <CardTitle className="text-sm font-medium text-slate-800">
                  AI Assistant
                </CardTitle>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-slate-100"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  {isMinimized ? (
                    <Maximize2 className="h-4 w-4 text-slate-600" />
                  ) : (
                    <Minimize2 className="h-4 w-4 text-slate-600" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-slate-100"
                  onClick={onToggleOpen}
                >
                  <X className="h-4 w-4 text-slate-600" />
                </Button>
              </div>
            </CardHeader>

            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50/50 to-white">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={cn(
                        "flex items-start gap-3",
                        message.role === "assistant"
                          ? "max-w-[85%]"
                          : "ml-auto max-w-[85%] flex-row-reverse"
                      )}
                    >
                      {message.role === "assistant" && (
                        <div className="bg-gradient-to-br from-blue-800 to-blue-900 p-2 rounded-lg shadow-sm flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "rounded-xl px-4 py-3 text-sm shadow-sm transition-all duration-200",
                          message.role === "assistant"
                            ? "bg-white text-slate-800 border border-slate-200"
                            : "bg-gradient-to-r from-blue-800 to-blue-900 text-white"
                        )}
                      >
                        <div
                          className={`font-medium mb-1.5 text-xs uppercase tracking-wider ${
                            message.role === "assistant"
                              ? "text-slate-600"
                              : "text-slate-100"
                          }`}
                        >
                          {message.role === "assistant"
                            ? "AI Assistant"
                            : "You"}
                        </div>
                        {getCorrectFormatText(message)}
                        <div
                          className={`mt-2 text-xs text-right ${
                            message.role === "assistant"
                              ? "text-slate-600"
                              : "text-slate-100"
                          }`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      {message.role === "user" && (
                        <div className="bg-gradient-to-br from-blue-800 to-blue-900 p-2 rounded-lg shadow-sm flex-shrink-0">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-start gap-3 max-w-[85%]"
                    >
                      <div className="bg-gradient-to-br from-blue-800 to-blue-900 p-2 rounded-lg shadow-sm flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="rounded-xl px-4 py-3 bg-white border border-slate-200 text-slate-800 shadow-sm">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-blue-800" />
                          <span className="text-sm text-slate-600">
                            Thinking...
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <CardContent className="p-4 border-t border-slate-200 bg-white/80 backdrop-blur-sm">
                  <form onSubmit={handleSubmit} className="flex gap-3">
                    <div className="relative flex-1">
                      <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about the document..."
                        className="w-full min-h-[48px] max-h-[160px] px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-transparent resize-none transition-all duration-200 bg-slate-50/50 pr-12 overflow-auto outline-none shadow-sm text-sm text-slate-800 placeholder:text-slate-400"
                        disabled={isLoading || !threadId || !assistantId}
                        rows={1}
                        style={{ scrollbarWidth: "none" }}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={
                        !input.trim() || isLoading || !threadId || !assistantId
                      }
                      className="bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-800 text-white rounded-xl p-3 transition-all duration-200 flex-shrink-0 shadow-sm hover:shadow-md h-[48px] w-[48px]"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </Button>
                  </form>
                </CardContent>
              </>
            )}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
