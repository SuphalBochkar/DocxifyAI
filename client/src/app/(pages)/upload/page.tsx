import { DocumentUpload } from "@/components/Document/DocumentUpload";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Document Upload
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload your documents for AI-powered processing and analysis. We
            support PDF, DOC, DOCX, and image formats.
          </p>
        </div>
        <DocumentUpload />
      </div>
    </div>
  );
}
