import { useState } from "react";
import { FiUpload, FiFile, FiX } from "react-icons/fi";

const DocumentPreview = () => {
  const [docUrl, setDocUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocUrl(e.target.value);
    setIsLoading(true);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FiFile className="w-6 h-6" />
              Document Preview
            </h2>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* URL Input Section */}
            <div className="relative mb-6">
              <div className="flex items-center gap-2 mb-2">
                <FiUpload className="w-5 h-5 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">
                  Document URL
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter document URL to preview"
                  value={docUrl}
                  onChange={handleUrlChange}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                {docUrl && (
                  <button
                    onClick={() => setDocUrl("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Preview Section */}
            <div className="relative bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              )}
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(
                  docUrl
                )}&embedded=true`}
                className="w-full h-[600px]"
                title="Document Preview"
                onLoad={handleIframeLoad}
              />
            </div>

            {/* Empty State */}
            {!docUrl && (
              <div className="text-center py-12">
                <FiFile className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">
                  Enter a document URL to preview
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
