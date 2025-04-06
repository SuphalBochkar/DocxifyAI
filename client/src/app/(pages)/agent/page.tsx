"use client";

import { useState, useEffect } from "react";
import { DocumentList } from "@/components/Document/DocumentList";
import { ChatInterface } from "@/components/Agent/ChatInterface";
import { DocumentViewer } from "@/components/Document/DocumentViewer";
import type { Document, ChatMessage } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function Agent() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);

  useEffect(() => {
    if (selectedDocument) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `Hello! I'm your document assistant. I can help you find missing information in "${selectedDocument.name}". What would you like to know?`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } else {
      setMessages([]);
    }
  }, [selectedDocument]);

  // Fetch documents from API
  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoadingDocuments(true);
      try {
        const response = await fetch("http://localhost:5000/api/documents");
        const data = await response.json();

        const formattedDocuments: Document[] = data.map((doc: any) => ({
          id: doc.id || String(Math.random()),
          name: doc.name || "Unnamed Document",
          url: doc.url || "#",
          size: doc.size || 0,
          type: doc.type || "application/pdf",
          uploadedAt: doc.uploadedAt || new Date().toISOString(),
          parsedData: doc.parsedData || null,
        }));

        setDocuments(formattedDocuments);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setIsLoadingDocuments(false);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      {/* Header */}
     

      {isLoadingDocuments ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar: Document List */}
          <div className="w-1/3 bg-white shadow-lg p-4 overflow-y-auto">
            <DocumentList
              documents={documents}
              onSelectDocument={setSelectedDocument}
              selectedDocumentId={selectedDocument?.id}
            />
          </div>

          {/* Main Content */}
          <div className="w-3/4 flex flex-col p-4 gap-4">
            Document Viewer
            <div className="flex-1 bg-white shadow-lg p-4 rounded-lg overflow-y-auto">
              <DocumentViewer document={selectedDocument} />
            </div>

            {/* Chat Interface */}
            <div className="h-1/3 bg-white shadow-lg p-4 rounded-lg flex flex-col">
              <ChatInterface
                messages={messages}
                onSendMessage={() => {}}
                isLoading={isLoading}
                selectedDocument={
                  selectedDocument ? { id: selectedDocument.id, name: selectedDocument.name } : null
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
