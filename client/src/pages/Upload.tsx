// src/components/Upload/Upload.tsx

import { useState } from "react";
import DocUpload from "../components/DocUpload";
import { DocumentUpload } from "../components/DocumentUpload";

const Upload = () => {
  return (
    <>
      {/* <DocUpload /> */}
      <DocumentUpload />
    </>
  );

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    alert(`Uploading: ${file.name}`);
  };

  return (
    <div>
      <h1>Upload Page</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default Upload;
