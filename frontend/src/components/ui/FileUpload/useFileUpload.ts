import { useBillingContext } from "@/components/contexts/BillingContext";
import { useState } from "react";

interface UploadResult {
  filename: string;
  status: "success" | "error";
  message?: string;
}

interface UploadResponse {
  error?: string;
  details?: string | UploadResult[];
}

export const useFileUpload = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);
  const { refetchAll } = useBillingContext();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
      setResults([]); // Clear previous results
    }
  };

  const handleUpload = async () => {
    if (!files) return;

    setLoading(true);
    setResults([]);

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data: UploadResponse | UploadResult[] = await response.json();

      if (Array.isArray(data)) {
        setResults(data);
        await refetchAll();
      } else if (data.error) {
        setResults([
          {
            filename: "Upload Error",
            status: "error",
            message: data.error,
          },
        ]);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setResults([
        {
          filename: "Upload Error",
          status: "error",
          message: "Failed to upload files",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  return { files, loading, results, handleFileChange, handleUpload };
};
