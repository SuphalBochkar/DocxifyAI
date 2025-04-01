export interface Document {
  id: string;
  name: string;
  content: string;
  uploadedAt: string;
}

export interface ParsedField {
  name: string;
  value: string | null;
  status: "found" | "missing";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface DocumentViewerProps {
  document?: Document;
  parsedFields: ParsedField[];
}

export interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}
