export interface Document {
  id: string;
  name: string;
  content?: string; // Optional because it's not in every document
  url?: string; // Optional because it's not in every document
  size?: number; // Optional because it's not in every document
  type?: string; // Optional because it's not in every document
  uploadedAt: string;
  parsedData?: Record<string, any>; // Optional for parsed data if available
}

export interface ParsedField {
  name: string;
  value: string | null;
  status: "found" | "missing";
  confidence?: number; // Optional, only present if available
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface DocumentViewerProps {
  document?: Document; // Optional, because it may not always be passed
  parsedFields?: ParsedField[]; // Optional, can be undefined or missing
}

export interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean; // Optional
}
