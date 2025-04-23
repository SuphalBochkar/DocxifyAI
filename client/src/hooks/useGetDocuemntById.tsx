import { useState, useCallback } from "react";
import { Document } from "@/lib/types";

export const useGetDocumentById = (documentId?: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Document | null>(null);

  const fetchDocument = useCallback(async () => {
    if (!documentId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/records/${documentId}`
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setData({ ...responseData.data });
      setError(null);
    } catch (err) {
      console.error("Error fetching document:", err);
      setError("Failed to fetch document");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  return { loading, error, data, fetchDocument };
};
