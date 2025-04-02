export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface ParsedField {
  name: string
  value: string | null
  status: "found" | "missing"
  confidence?: number
}

export interface Document {
  id: string
  name: string
  url: string
  size: number
  type: string
  uploadedAt: string
  parsedData?: Record<string, any>
}

export interface DocumentViewerProps {
  document?: {
    id: string
    name: string
    url: string
    content?: string
    parsedData?: Record<string, any>
  }
  parsedFields?: ParsedField[]
}

