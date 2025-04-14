import "./App.css";
import { FileUpload } from "./components/FileUpload";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Revenue Analytics
              </h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          {/* File Upload Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Upload Data
            </h2>
            <FileUpload />
          </div>

          {/* Dashboard Placeholder */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* We'll add dashboard components here */}
            <div className="h-48 rounded-lg border-2 border-dashed border-gray-300 p-4">
              <p className="text-center text-gray-500">Revenue Overview</p>
            </div>
            <div className="h-48 rounded-lg border-2 border-dashed border-gray-300 p-4">
              <p className="text-center text-gray-500">Client Distribution</p>
            </div>
            <div className="h-48 rounded-lg border-2 border-dashed border-gray-300 p-4">
              <p className="text-center text-gray-500">Geographic Analysis</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
