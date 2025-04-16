import { useBillingContext } from "@/components/contexts";
import { useState } from "react";
import { type UploadResult } from "@/api/types";
import phrases from "@/shared/phrases.json";
import { uploadFiles } from "@/api/functions";

export const useFileUpload = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);
  const { refetchAll } = useBillingContext();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
      setResults([]);
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
      const data = await uploadFiles(formData);
      setResults(data);
      await refetchAll();
    } catch (err) {
      console.error("Upload error:", err);
      setResults([
        {
          filename: phrases.fileUpload.uploadError,
          status: "error",
          message: phrases.fileUpload.uploadErrorDetails,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetValues = () => {
    setFiles(null);
    setResults([]);
    setLoading(false);
  };

  return {
    files,
    loading,
    results,
    handleFileChange,
    handleUpload,
    resetValues,
  };
};
