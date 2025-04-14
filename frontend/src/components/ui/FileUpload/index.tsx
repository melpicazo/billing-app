import { useFileUpload } from "./useFileUpload";
import { ArrowRight, WarningCircleSolid } from "iconoir-react";
import phrases from "@/shared/phrases.json";
import { useState } from "react";
import { Modal } from "../Modal";

export const FileUpload = () => {
  const { files, handleFileChange, handleUpload, results, loading } =
    useFileUpload();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="rounded-lg bg-orange-100 p-8 border border-orange-300 border-dashed flex flex-col gap-6">
        <h3 className="text-orange-600 font-extrabold flex items-center gap-2">
          <WarningCircleSolid />
          {phrases.fileUpload.title}
        </h3>
        <p className="text-orange-600">{phrases.fileUpload.description}</p>
        <button
          className="group bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2 w-fit transition-all hover:bg-orange-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {phrases.fileUpload.ctaButton}
          <ArrowRight
            width={16}
            height={16}
            className="group-hover:translate-x-1 transition-all"
          />
        </button>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={phrases.fileUpload.uploadFiles}
        ctaButtonProps={{
          onClick: handleUpload,
          disabled: !files,
          className: `px-4 py-2 rounded-md text-white font-medium
          ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}
          transition-colors duration-200`,
          children: "Upload Files",
        }}
      >
        <div className="mb-4">
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileChange}
            className="mb-2 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
            multiple
          />
        </div>
        {results.length > 0 && (
          <div className="space-y-4">
            <div className="p-3 rounded-md bg-blue-100 text-blue-700 border border-blue-200">
              <div className="font-medium">File Upload Complete</div>
              <div className="text-sm mt-1">
                The file was successfully uploaded to the server. Check
                processing results below.
              </div>
            </div>

            <div className="space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md ${
                    result.status === "error"
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : "bg-green-100 text-green-700 border border-green-200"
                  }`}
                >
                  <div className="font-medium">{result.filename}</div>
                  {result.message && (
                    <div className="text-sm mt-1">{result.message}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
