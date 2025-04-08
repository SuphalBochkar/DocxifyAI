"use client";
import { useState, useEffect } from "react";
import { DocumentList } from "@/components/Document/DocumentList";
import { ChatInterface } from "@/components/Agent/ChatInterface";
import { DocumentViewer } from "@/components/Document/DocumentViewer";
import type { Document, ChatMessage } from "@/lib/types";
import { Loader2, FileSearch, FileText, MessageSquare } from "lucide-react";

export default function Agent() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [isLoadingDocumentDetails, setIsLoadingDocumentDetails] =
    useState(false);
  const [isFullscreenViewer, setIsFullscreenViewer] = useState(false);

  useEffect(() => {
    if (selectedDocument) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `Hello! I'm your document assistant. I can help you find information in "${selectedDocument.fileName}". What would you like to know?`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } else {
      setMessages([]);
    }
  }, [selectedDocument]);

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoadingDocuments(true);
      try {
        const response = await fetch("http://localhost:8080/api/v1/records");
        const data = await response.json();
        const docData = data.data || data.documents || data;

        console.log("Fetched documents:", docData);

        const formattedDocuments: Document[] = docData.map((doc: Document) => ({
          id: doc.id || String(Math.random()),
          fileName: doc.fileName || "Unnamed Document",
          fileType: doc.fileType || "application/pdf",
          fileSize: doc.fileSize || 0,
          url: doc.url || "#",
          status: doc.status || "pending",
          createdAt: doc.createdAt || new Date().toISOString(),
        }));

        setDocuments(formattedDocuments);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setDocuments([
          {
            id: "1",
            fileName: "Invoice-2023-001.pdf",
            fileType: "application/pdf",
            fileSize: 1024 * 1024 * 2.5, // 2.5MB
            url: "https://example.com/sample.pdf",
            status: "processed",
            createdAt: "2023-05-15T10:30:00Z",
            parsedData: {
              invoiceNumber: "INV-2023-001",
              date: "2023-05-10",
              totalAmount: 1250.5,
              missingFields: ["customerName", "address"],
            },
          },
          {
            id: "2",
            fileName: "Contract-2023-Q2.pdf",
            fileType: "application/pdf",
            fileSize: 1024 * 1024 * 3.7, // 3.7MB
            url: "https://example.com/sample2.pdf",
            status: "processed",
            createdAt: "2023-04-20T14:15:00Z",
            parsedData: {
              invoiceNumber: null,
              date: "2023-04-20",
              totalAmount: null,
              missingFields: ["signature", "witness"],
            },
          },
        ]);
      } finally {
        setIsLoadingDocuments(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleSelectDocument = async (document: Document) => {
    setIsLoadingDocumentDetails(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/records/${document.id}`
      );
      const data = await response.json();
      setSelectedDocument({
        ...document,
        ...data.data,
        extractedData: data.data.extractedData || document.extractedData,
      });
    } catch (error) {
      console.error("Error fetching document details:", error);
      setSelectedDocument(document);
    } finally {
      setIsLoadingDocumentDetails(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      // API call to delete document (commented for now)
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
          .filter(([, value]) => value === null)
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

  const toggleFullscreenViewer = () => {
    setIsFullscreenViewer(!isFullscreenViewer);
  };

  const NoDocumentSelected = () => (
    <div className="flex flex-col items-center justify-center h-full text-slate-500">
      <FileSearch className="h-16 w-16 mb-4 text-slate-300" />
      <p className="text-lg font-medium">No document selected</p>
      <p className="mt-2 text-sm text-center">
        Select a document from the list to view it here
      </p>
    </div>
  );

  const EmptyDocumentList = () => (
    <div className="flex flex-col items-center justify-center h-full text-slate-500">
      <FileText className="h-16 w-16 mb-4 text-slate-300" />
      <p className="text-lg font-medium">No documents available</p>
      <p className="mt-2 text-sm text-center">
        Upload documents to start analyzing
      </p>
    </div>
  );

  const NoSelectedDocumentChat = () => (
    <div className="flex flex-col items-center justify-center h-full text-slate-500">
      <MessageSquare className="h-16 w-16 mb-4 text-slate-300" />
      <p className="text-lg font-medium">Select a document first</p>
      <p className="mt-2 text-sm text-center">
        Choose a document to start the conversation
      </p>
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col h-[calc(100vh-9rem)] overflow-hidden">
          {/* Header Section */}
          {/* <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-slate-800">
                Document AI Agent
              </h1>
              <Badge className="px-3 py-1 bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors">
                Intelligent Document Processing
              </Badge>
            </div>
          </div> */}

          {/* Main Content Area */}
          {isLoadingDocuments ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-3">
                <Loader2 className="h-10 w-10 animate-spin text-blue-800 mx-auto" />
                <p className="text-slate-600">Loading your documents...</p>
              </div>
            </div>
          ) : (
            <div
              className={`flex-1 grid ${
                isFullscreenViewer ? "grid-cols-1" : "grid-cols-12"
              } gap-6 min-h-0`}
            >
              {/* Document List - 3 columns (25%) */}
              {!isFullscreenViewer && (
                <div className="col-span-3 h-full overflow-hidden">
                  {documents.length > 0 ? (
                    <DocumentList
                      documents={documents}
                      onSelectDocument={handleSelectDocument}
                      onDeleteDocument={handleDeleteDocument}
                      selectedDocumentId={selectedDocument?.id}
                    />
                  ) : (
                    <EmptyDocumentList />
                  )}
                </div>
              )}

              {/* Document Viewer - ~5.4 columns (45%) */}
              <div
                className={`${
                  isFullscreenViewer ? "col-span-12" : "col-span-6"
                } h-full overflow-hidden`}
              >
                <DocumentViewer
                  document={selectedDocument}
                  isLoading={isLoadingDocumentDetails}
                  isFullscreen={isFullscreenViewer}
                  onToggleFullscreen={toggleFullscreenViewer}
                />
              </div>

              {/* Chat Interface - ~3.6 columns (30%) */}
              {!isFullscreenViewer && (
                <div className="col-span-3 h-full flex flex-col overflow-hidden">
                  {selectedDocument ? (
                    <ChatInterface
                      messages={messages.map((msg) => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp).getTime(),
                      }))}
                      onSendMessage={handleSendMessage}
                      isLoading={isLoading}
                    />
                  ) : (
                    <NoSelectedDocumentChat />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
