import { useState } from "react";

const Mydocs = () => {
  const [docUrl, setDocUrl] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Document Viewer</h2>
        <input
          type="text"
          placeholder="Enter document URL"
          value={docUrl}
          onChange={(e) => setDocUrl(e.target.value)}
          className="mb-4 w-full border p-2 rounded"
        />
        <iframe
          src={`https://docs.google.com/gview?url=${encodeURIComponent(
            docUrl
          )}&embedded=true`}
          className="w-full h-60 border rounded"
          title="Document Preview"
        />
      </div>
    </div>
  );
};

export default Mydocs;
