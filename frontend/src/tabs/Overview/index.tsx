import { FileUpload } from "../../components";

export const Overview = () => {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Data</h2>
        <FileUpload />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
    </>
  );
};
