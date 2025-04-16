import { cn } from "@/shared/utils";
import { Modal } from "../Modal";
import { useFileUpload } from "./useFileUpload";
import phrases from "@/shared/phrases.json";
import { type UploadResult } from "@/api/types";
import { CheckCircleSolid, XmarkCircleSolid } from "iconoir-react";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FileUploadModal = ({ isOpen, onClose }: FileUploadModalProps) => {
  const {
    files,
    handleFileChange,
    handleUpload,
    results,
    loading,
    resetValues,
  } = useFileUpload();

  const handleClose = () => {
    resetValues();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={phrases.fileUpload.uploadFiles}
      ctaButtonProps={{
        onClick: handleUpload,
        disabled: !files || loading || results.length > 0,
        className: cn(
          "px-4 py-2 rounded-md text-white font-medium transition-all duration-200",
          loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        ),
        children: loading
          ? phrases.fileUpload.uploading
          : phrases.fileUpload.uploadFiles,
      }}
    >
      <div className="mb-4">
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileChange}
          className="mb-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 
            file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          multiple
        />
      </div>
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="p-3 rounded-md bg-blue-100 text-blue-700 border border-blue-200">
            <div className="font-medium">File Upload Complete</div>
            <div className="text-sm mt-1">
              {phrases.fileUpload.uploadSuccessMessage}
            </div>
          </div>
          <div className="space-y-2">
            {results.map((result: UploadResult, index) => (
              <div
                key={index}
                className={`p-3 rounded-md ${
                  result.status === "error"
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : "bg-green-100 text-green-700 border border-green-200"
                }`}
              >
                <div className="font-medium flex items-center gap-2">
                  {result.filename}
                  {result.status === "error" ? (
                    <XmarkCircleSolid className="w-4 h-4" />
                  ) : (
                    <CheckCircleSolid className="w-4 h-4" />
                  )}
                </div>
                {result.message && (
                  <div className="text-sm mt-1">{result.message}</div>
                )}
                {result.skippedRows && result.skippedRows.length > 0 && (
                  <div className="text-sm mt-1 text-amber-700">
                    <div className="font-medium">
                      {phrases.fileUpload.skipped} {result.skippedRows.length}{" "}
                      {phrases.fileUpload.rows}:
                    </div>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {result.skippedRows.map((row, i) => (
                        <li key={i}>{row}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
};
