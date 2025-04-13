"use client";

import { useState, useEffect } from "react";
import { DocumentList } from "@/components/Agent/Document/DocumentList";
import { ChatInterface } from "@/components/Agent/Chat/ChatInterface";
import { DocumentViewer } from "@/components/Agent/Document/DocumentViewer";
import { NoRecordsUpload } from "@/components/Agent/NoPage/NoDocsUpload";
import type { Document, ChatMessage } from "@/lib/types";
import { DocumentStatus } from "@/lib/types";
import { AgentSkeleton } from "@/components/Skeletons/AgentSkeleton";
import { useRouter } from "next/navigation";
import { SelectDocChat } from "@/components/Agent/NoPage/SelectDocChat";

export default function Agent() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [isLoadingDocumentDetails, setIsLoadingDocumentDetails] =
    useState(false);
  const [isFullscreenViewer, setIsFullscreenViewer] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoadingDocuments(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/records`
        );
        const data = await response.json();
        const docData = data.data || data.documents || data;

        console.log("Fetched documents:", docData);

        const formattedDocuments: Document[] = docData.map((doc: Document) => ({
          id: doc.id || String(Math.random()),
          fileName: doc.fileName || "Unnamed Document",
          fileType: doc.fileType || "application/pdf",
          fileSize: doc.fileSize || 0,
          url: doc.url || "#",
          status: doc.status || DocumentStatus.PENDING,
          createdAt: doc.createdAt || new Date().toISOString(),
          missingData: doc.missingData || {},
          validationData: doc.validationData || {},
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
            status: DocumentStatus.PROCESSED,
            createdAt: "2023-05-15T10:30:00Z",
            updatedAt: "2023-05-15T10:30:00Z",
            IP: "127.0.0.1",
            missingData: {},
            validationData: {},
          },
          {
            id: "2",
            fileName: "Contract-2023-Q2.pdf",
            fileType: "application/pdf",
            fileSize: 1024 * 1024 * 3.7, // 3.7MB
            url: "https://example.com/sample2.pdf",
            status: DocumentStatus.PROCESSED,
            createdAt: "2023-04-20T14:15:00Z",
            updatedAt: "2023-04-20T14:15:00Z",
            IP: "127.0.0.1",
            missingData: {},
            validationData: {},
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
      // Clear the messages when a new document is selected
      setMessages([]);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/records/${document.id}`
      );
      const data = await response.json();

      setSelectedDocument({
        ...document,
        ...data.data,
        extractedData: data.data.extractedData || document.extractedData,
        missingData: data.data.missingData || document.missingData,
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
        setMessages([]);
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const toggleFullscreenViewer = () => {
    setIsFullscreenViewer(!isFullscreenViewer);
  };

  const handleUpload = () => {
    router.push("/upload");
  };

  if (isLoadingDocuments) return <AgentSkeleton />;

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-6 py-4">
        <div className="flex flex-col h-[calc(100vh-9rem)] overflow-hidden">
          <div
            className={`flex-1 grid ${
              isFullscreenViewer ? "grid-cols-1" : "grid-cols-12"
            } gap-4 min-h-0`}
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
                  <NoRecordsUpload onUpload={handleUpload} />
                )}
              </div>
            )}

            {/* Document Viewer - ~5.4 columns (45%) */}
            <div
              className={`${
                isFullscreenViewer ? "col-span-12" : "col-span-5 md:col-span-6"
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
              <div className="col-span-4 md:col-span-3 h-full flex flex-col overflow-hidden">
                {selectedDocument ? (
                  <ChatInterface
                    messages={messages.map((msg) => ({
                      ...msg,
                      timestamp: new Date(msg.timestamp).toISOString(),
                    }))}
                    selectedDocument={{
                      ...selectedDocument,
                      url: selectedDocument.url || "#",
                    }}
                    setMessages={setMessages}
                    setIsLoading={setIsLoadingDocumentDetails}
                    key={selectedDocument.id}
                  />
                ) : (
                  <SelectDocChat />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
