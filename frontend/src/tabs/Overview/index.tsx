import { FileUpload } from "@/components";
import phrases from "@/shared/phrases.json";
import { useBillingContext } from "@/components";

export const Overview = () => {
  const { hasData, statusError, isLoadingStatus, firmTotals } =
    useBillingContext();
  console.log(firmTotals);
  if (statusError) {
    return (
      <div className="p-4 text-red-500">
        Error loading system status: {statusError.message}
      </div>
    );
  }
  return (
    <div className="container-default-spacing flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1>{phrases.overview.title}</h1>
        <p>{phrases.overview.description}</p>
      </div>

      <div>
        {isLoadingStatus ? (
          "Loading..."
        ) : (
          <>
            <FileUpload />
            {hasData && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="h-48 rounded-lg border-2 border-dashed border-gray-300 p-4">
                  <p className="text-center text-gray-500">Revenue Overview</p>
                </div>
                <div className="h-48 rounded-lg border-2 border-dashed border-gray-300 p-4">
                  <p className="text-center text-gray-500">
                    Client Distribution
                  </p>
                </div>
                <div className="h-48 rounded-lg border-2 border-dashed border-gray-300 p-4">
                  <p className="text-center text-gray-500">
                    Geographic Analysis
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
