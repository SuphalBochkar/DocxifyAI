import { DocumentUpload } from "@/components/Document/DocumentUpload";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* <div className="text-center mb-12">
        
        </div> */}
        <DocumentUpload />
      </div>
    </div>
  );
}
