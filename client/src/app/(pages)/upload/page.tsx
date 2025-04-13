import { DocumentUpload } from "@/components/Upload/DocumentUpload";

export default function UploadPage() {
  return (
    <div className="flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <div className="flex-1 flex items-center justify-center p-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl">
          <DocumentUpload />
        </div>
      </div>
    </div>
  );
}
