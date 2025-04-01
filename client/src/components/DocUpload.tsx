import { useState } from "react";

const DocUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:3000/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Upload successful: ${data.document.storageUrl}`);
      } else {
        setMessage(`Error: ${data.error || "Upload failed"}`);
      }
    } catch (error) {
      setMessage("Upload failed. Check console for details.");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-4 w-full border p-2 rounded"
        />
        <button
          onClick={handleUpload}
          className={`w-full p-2 rounded text-white ${
            uploading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500"
          }`}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </div>
    </div>
  );
};

export default DocUpload;
