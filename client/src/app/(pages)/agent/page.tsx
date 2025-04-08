"use client";
import { useState, useEffect } from "react";
import { DocumentList } from "@/components/Document/DocumentList";
import { ChatInterface } from "@/components/Agent/ChatInterface";
import { DocumentViewer } from "@/components/Document/DocumentViewer";
import { Badge } from "@/components/ui/badge";
import type { Document, ChatMessage } from "@/lib/types";
import { Loader2, FileText, MessageSquare, Eye, FileSearch, Maximize2 } from "lucide-react";

const SAMPLE_DOCUMENTS: Document[] = [
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
];

// Generate AI response based on content and document
const generateAIResponse = (content: string, document: Document): string => {
  const { parsedData } = document;
  
  if (content.toLowerCase().includes("invoice") || content.toLowerCase().includes("number")) {
    return `I found the invoice number in the document: ${parsedData?.invoiceNumber || "INV-2023-001"}`;
  } 
  
  if (content.toLowerCase().includes("date") || content.toLowerCase().includes("when")) {
    return `The document date is ${parsedData?.date || "2023-05-10"}`;
  } 
  
  if (["amount", "total", "cost"].some(term => content.toLowerCase().includes(term))) {
    return `The total amount is $${parsedData?.totalAmount || "1,250.50"}`;
  } 
  
  if (content.toLowerCase().includes("missing")) {
    const missingFields = Object.entries(parsedData || {})
      .filter(([_, value]) => value === null)
      .map(([key]) => key);

    return missingFields.length > 0
      ? `I found the following missing fields in the document: ${missingFields.join(", ")}`
      : "I didn't find any missing fields in this document.";
  }
  
  return "I've analyzed the document and can help you find specific information. Try asking about invoice numbers, dates, amounts, or missing fields.";
};

export default function Agent() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [isFullscreenViewer, setIsFullscreenViewer] = useState(false);

  // Reset messages when document changes
  useEffect(() => {
    if (!selectedDocument) {
      setMessages([]);
      return;
    }

    setMessages([{
      id: "welcome",
      role: "assistant",
      content: `Hello! I'm your document assistant. I can help you find information in "${selectedDocument.name}". What would you like to know?`,
      timestamp: new Date().toISOString(),
    }]);
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
        // Use sample documents for demo purposes
        setDocuments(SAMPLE_DOCUMENTS);
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

      const aiResponse = generateAIResponse(content, selectedDocument);
      
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
        content: "Sorry, I encountered an error processing your request. Please try again.",
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
    <div className=" bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col h-[calc(100vh-3rem)]">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
            </div>
          </div>

          {/* Main Content Area */}
          {isLoadingDocuments ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-3">
                <Loader2 className="h-10 w-10 animate-spin text-blue-800 mx-auto" />
                <p className="text-slate-600">
                  Loading your documents...
                </p>
              </div>
            </div>
          ) : isFullscreenViewer && selectedDocument ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between bg-white rounded-t-lg p-3 border-b border-slate-100">
                <div className="flex items-center">
                  <Eye className="h-5 w-5 text-slate-500 mr-2" />
                  <h2 className="text-base font-semibold text-slate-800">
                    {selectedDocument.name}
                  </h2>
                </div>
                <button
                  onClick={toggleFullscreenViewer}
                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Exit fullscreen"
                >
                  <Maximize2 className="h-5 w-5 text-slate-500" />
                </button>
              </div>
              <div className="flex-1 bg-white rounded-b-lg p-4 overflow-auto shadow-sm">
                <DocumentViewer document={selectedDocument} />
              </div>
            </div>
          ) : (
            <div className="flex-1 grid grid-cols-10 gap-4 min-h-0">
              {/* Document List - 3/10 width */}
              <div className="col-span-3 h-full">
                <div className="bg-white rounded-lg shadow-sm h-full flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-slate-100">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-slate-500 mr-2" />
                      {/* <h2 className="text-base font-semibold text-slate-800">Document List</h2> */}
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    {documents.length > 0 ? (
                      <div className="h-full overflow-y-auto p-3">
                        <DocumentList
                          documents={documents}
                          onSelectDocument={handleSelectDocument}
                          onDeleteDocument={handleDeleteDocument}
                          selectedDocumentId={selectedDocument?.id}
                        />
                      </div>
                    ) : (
                      <EmptyDocumentList />
                    )}
                  </div>
                </div>
              </div>

              {/* Document Viewer - 4/10 width in the middle */}
              <div className="col-span-4 h-full">
                <div className="bg-white rounded-lg shadow-sm h-full flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Eye className="h-5 w-5 text-slate-500 mr-2" />
                        <h2 className="text-base font-semibold text-slate-800">Document Preview</h2>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedDocument && (
                          <>
                            <Badge variant="outline" className="text-xs font-normal text-slate-600">
                              {selectedDocument.name}
                            </Badge>
                            <button
                              onClick={toggleFullscreenViewer}
                              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                              title="View fullscreen"
                            >
                              <Maximize2 className="h-4 w-4 text-slate-500" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 bg-slate-50 overflow-hidden">
                    {selectedDocument ? (
                      <div className="h-full overflow-auto p-4 border border-slate-100 bg-white m-4 rounded-lg shadow-sm">
                        <DocumentViewer document={selectedDocument} />
                      </div>
                    ) : (
                      <NoDocumentSelected />
                    )}
                  </div>
                </div>
              </div>

              {/* Chat Interface - 3/10 width */}
              <div className="col-span-3 h-full">
                <div className="bg-white rounded-lg shadow-sm h-full flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-slate-100">
                    <div className="flex items-center">
                      <MessageSquare className="h-5 w-5 text-slate-500 mr-2" />
                      <h2 className="text-base font-semibold text-slate-800">AI Assistant</h2>
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
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
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}