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

export const FileUpload = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);

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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Upload Billing Files</h2>

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
        <p className="text-sm text-gray-600 mb-2">
          Upload a single Excel file containing all data, or four CSV files for
          clients, portfolios, assets, and billing tiers.
        </p>
        <button
          onClick={handleUpload}
          disabled={!files || loading}
          className={`px-4 py-2 rounded-md text-white font-medium
            ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}
            transition-colors duration-200`}
        >
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Uploading...
            </span>
          ) : (
            "Upload Files"
          )}
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="p-3 rounded-md bg-blue-100 text-blue-700 border border-blue-200">
            <div className="font-medium">File Upload Complete</div>
            <div className="text-sm mt-1">
              The file was successfully uploaded to the server. Check processing
              results below.
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
    </div>
  );
};
