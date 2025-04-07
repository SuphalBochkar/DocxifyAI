"use client";

import { useState, useEffect } from "react";
import { DocumentList } from "@/components/Document/DocumentList";
import { ChatInterface } from "@/components/Agent/ChatInterface";
import { DocumentViewer } from "@/components/Document/DocumentViewer";
import { Badge } from "@/components/ui/badge";
import type { Document, ChatMessage } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function Agent() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);

  useEffect(() => {
    if (selectedDocument) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `Hello! I'm your document assistant. I can help you find information in "${selectedDocument.name}". What would you like to know?`,
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
        const response = await fetch("http://localhost:8080/api/v1/records");
        const data = await response.json();
        const docData = data.data || data.documents || data;

        const formattedDocuments: Document[] = docData.map((doc: any) => ({
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
        // Add some sample documents for demo purposes
        setDocuments([
          {
            id: "1",
            name: "Invoice-2023-001.pdf",
            url: "https://example.com/sample.pdf",
            size: 1024 * 1024 * 2.5, // 2.5MB
            type: "application/pdf",
            uploadedAt: "2023-05-15T10:30:00Z",
            parsedData: {
              invoiceNumber: "INV-2023-001",
              date: "2023-05-10",
              dueDate: "2023-06-10",
              totalAmount: 1250.5,
              customerName: "Acme Corporation",
              customerEmail: "billing@acme.com",
              taxAmount: null,
            },
          },
          {
            id: "2",
            name: "Contract-2023-Q2.pdf",
            url: "https://example.com/sample2.pdf",
            size: 1024 * 1024 * 3.7, // 3.7MB
            type: "application/pdf",
            uploadedAt: "2023-04-20T14:15:00Z",
            parsedData: {
              contractNumber: "CT-2023-Q2-001",
              startDate: "2023-04-01",
              endDate: "2023-06-30",
              clientName: "TechSolutions Inc.",
              serviceType: "Software Development",
              totalValue: 25000,
              paymentTerms: null,
            },
          },
        ]);
      } finally {
        setIsLoadingDocuments(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleSelectDocument = (document: Document) => {
    setSelectedDocument(document);
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      // API call to delete document
      // await fetch(`http://localhost:5000/api/documents/${documentId}`, {
      //   method: 'DELETE',
      // });

      // Update local state
      setDocuments(documents.filter((doc) => doc.id !== documentId));

      // Reset selected document if it was deleted
      if (selectedDocument?.id === documentId) {
        setSelectedDocument(null);
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedDocument) return;

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // In a real app, you would send the message to your backend API
      // const response = await fetch("http://localhost:5000/api/chat", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     documentId: selectedDocument.id,
      //     message: content,
      //   }),
      // });
      // const data = await response.json();

      // Simulate API response delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate AI response based on the document and user query
      let aiResponse = "";

      if (
        content.toLowerCase().includes("invoice") ||
        content.toLowerCase().includes("number")
      ) {
        aiResponse = `I found the invoice number in the document: ${
          selectedDocument.parsedData?.invoiceNumber || "INV-2023-001"
        }`;
      } else if (
        content.toLowerCase().includes("date") ||
        content.toLowerCase().includes("when")
      ) {
        aiResponse = `The document date is ${
          selectedDocument.parsedData?.date || "2023-05-10"
        }`;
      } else if (
        content.toLowerCase().includes("amount") ||
        content.toLowerCase().includes("total") ||
        content.toLowerCase().includes("cost")
      ) {
        aiResponse = `The total amount is $${
          selectedDocument.parsedData?.totalAmount || "1,250.50"
        }`;
      } else if (content.toLowerCase().includes("missing")) {
        const missingFields = Object.entries(selectedDocument.parsedData || {})
          .filter(([_, value]) => value === null)
          .map(([key]) => key);

        if (missingFields.length > 0) {
          aiResponse = `I found the following missing fields in the document: ${missingFields.join(
            ", "
          )}`;
        } else {
          aiResponse = "I didn't find any missing fields in this document.";
        }
      } else {
        aiResponse =
          "I've analyzed the document and can help you find specific information. Try asking about invoice numbers, dates, amounts, or missing fields.";
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-slate-800">
                Document AI Agent
              </h1>
              <Badge className="px-3 py-1 bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors">
                Intelligent Document Processing
              </Badge>
            </div>
          </div>

          {/* Main Content Area */}
          {isLoadingDocuments ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-800 mx-auto" />
                <p className="text-slate-600 text-lg">
                  Loading your documents...
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
              {/* Document List - 3 columns */}
              <div className="lg:col-span-3 h-full">
                <DocumentList
                  documents={documents}
                  onSelectDocument={handleSelectDocument}
                  onDeleteDocument={handleDeleteDocument}
                  selectedDocumentId={selectedDocument?.id}
                />
              </div>

              {/* Chat and Document Viewer - 9 columns */}
              <div className="lg:col-span-9 h-full flex flex-col gap-6">
                <div className="flex-1 min-h-0">
                  <ChatInterface
                    messages={messages.map((msg) => ({
                      ...msg,
                      timestamp: new Date(msg.timestamp).getTime(),
                    }))}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                  />
                </div>
                <div className="flex-1 min-h-0">
                  <DocumentViewer document={selectedDocument} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
