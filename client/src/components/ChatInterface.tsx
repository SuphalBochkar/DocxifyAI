import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { ChatMessage } from "../lib/types";

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
