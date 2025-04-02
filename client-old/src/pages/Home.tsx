// src/components/Home.tsx

import { FileText, Bot, Upload } from "lucide-react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          Docxify
        </h1>
        <p className="text-xl text-blue-600 font-semibold mb-4">
          Advanced AI Doc Reader
        </p>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Extract, analyze, and retrieve missing information from your documents
          with our advanced AI assistant.
        </p>
      </div>

      <div className="mt-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center">
              <Upload className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="mt-4 text-xl font-medium text-gray-900">
              Upload Documents
            </h3>
            <p className="mt-2 text-gray-500">
              Easily upload your documents in various formats including PDF,
              DOC, and DOCX.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center">
              <FileText className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="mt-4 text-xl font-medium text-gray-900">
              Smart Extraction
            </h3>
            <p className="mt-2 text-gray-500">
              Our AI automatically extracts and structures important information
              from your documents.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center">
              <Bot className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="mt-4 text-xl font-medium text-gray-900">
              AI Assistant
            </h3>
            <p className="mt-2 text-gray-500">
              Chat with our AI to find missing information or get insights about
              your documents.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <Link
          to="/upload"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Get Started
          <Upload className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}

export default Home;
