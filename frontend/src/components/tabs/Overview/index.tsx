import { FileUpload } from "@/components/ui";
import { useBillingContext } from "@/components/contexts";
import { KeyMetrics } from "./components/KeyMetrics";
import { Dashboard } from "./components/Dashboard";

export const Overview = () => {
  const { hasData, statusError, isLoadingStatus } = useBillingContext();

  if (statusError) {
    return (
      <div className="p-4 text-red-500">
        Error loading system status: {statusError.message}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-8">
      {isLoadingStatus ? (
        "Loading..."
      ) : (
        <div className="flex flex-col gap-10">
          <FileUpload />
          {hasData && (
            <>
              <KeyMetrics />
              <Dashboard />
            </>
          )}
        </div>
      )}
    </div>
  );
};
