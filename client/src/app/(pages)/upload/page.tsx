"use client";

import { useState, useCallback, useEffect } from "react";
import Uploading from "@/components/Upload/Uploading";
import type { ChatMessage, Document } from "@/lib/types";
import { useGetDocumentById } from "@/hooks/useGetDocuemntById";
import { PopupChat } from "@/components/Agent/Chat/PopupChat";

export default function UploadPage() {
  const [documentId, setDocumentId] = useState<string | null>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { loading, error, data, fetchDocument } = useGetDocumentById(
    documentId || undefined
  );

  useEffect(() => {
    if (documentId) {
      fetchDocument();
    }
  }, [documentId, fetchDocument]);

  const handleUploadSuccess = useCallback((document: Document) => {
    setDocumentId(document.id);
    setIsChatOpen(true);
  }, []);

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 sm:px-4 lg:px-6 py-4 w-full">
        <Uploading onUploadSuccess={handleUploadSuccess} />
      </div>

      {data && !loading && !error && (
        <PopupChat
          messages={messages}
          setMessages={setMessages}
          selectedDocument={{
            id: data.id,
            fileName: data.fileName,
            fileType: data.fileType,
            url: data.url || "",
          }}
          setIsLoading={setIsLoading}
          isOpen={isChatOpen}
          onToggleOpen={() => setIsChatOpen(!isChatOpen)}
        />
      )}
    </div>
  );
}

/*
<div className="flex flex-col gap-8">
    <div className="w-full max-w-5xl mx-auto">
    <DocumentUpload onUploadSuccess={handleUploadSuccess} />
    </div>

    <div className="w-full max-w-5xl mx-auto">
    <button
        onClick={() => handleUploadSuccess("67fc1531809c9ca196a02386")}
        className="bg-blue-500 text-white px-4 py-2 rounded"
    >
        Simulate Upload Success
    </button>
    </div>

    {loading && (
    <div className="flex items-center justify-center py-8">
        <div className="text-slate-600">Loading document...</div>
    </div>
    )}

    {error && (
    <div className="flex items-center justify-center py-8">
        <div className="text-red-600">Error: {error}</div>
    </div>
    )}

    {data && !loading && !error && (
    <div className="grid grid-cols-12 gap-6 min-h-[600px]">
        <div className="col-span-12 lg:col-span-7 h-full">
        <DocumentViewer
            document={data}
            isLoading={isLoading}
            onOperationComplete={() => {}}
        />
        </div>

        <div className="col-span-12 lg:col-span-5 h-full">
        <ChatInterface
            messages={messages}
            setMessages={setMessages}
            selectedDocument={{
            id: data.id,
            fileName: data.fileName,
            fileType: data.fileType,
            url: data.url || "",
            }}
            setIsLoading={setIsLoading}
        />
        </div>
    </div>
    )}
</div>

 */
