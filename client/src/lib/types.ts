export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ParsedField {
  name: string;
  value: string | null;
  status: "found" | "missing";
  confidence?: number;
}

export enum DocumentStatus {
  UPLOADING = "UPLOADING",
  UPLOADED = "UPLOADED",
  PENDING = "PENDING",
  EXTRACTING = "EXTRACTING",
  EXTRACTED = "EXTRACTED",
  PROCESSING = "PROCESSING",
  PROCESSED = "PROCESSED",
  FAILED = "FAILED",
}

export interface GroupedDataItem {
  [key: string]: string | number;
}

export interface GroupedData {
  items?: GroupedDataItem[];
  total?: {
    totalAmount?: string | number;
    amount?: string | number;
  };
}

export interface ExtractedData {
  generalData?: Record<string, string | number | null>;
  groupedData?: GroupedData;
  validationData?: Record<string, unknown>;
  missingData?: Record<string, unknown>;
}

export interface Document {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url?: string;
  content?: string;
  extractedData?: ExtractedData;
  missingData?: Record<string, unknown>;
  validationData?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  IP: string;
  status: DocumentStatus;
}

// export interface Document {
//   id: string;
//   fileName: string;
//   fileType: string;
//   fileSize: number;
//   url: string;
//   status: string;
//   createdAt: string;
//   missingData?: JSON;
//   validationData?: JSON;
//   parsedData?: Record<string, any>;
//   extractedData?: any;
// }

export interface DocumentViewerProps {
  document?: {
    id: string;
    name: string;
    url: string;
    content?: string;
  };
  parsedFields?: ParsedField[];
}
