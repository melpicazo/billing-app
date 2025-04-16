import { FileUpload, LoadingSpinner } from "@/components/ui";
import { useBillingContext } from "@/components/contexts";
import { KeyMetrics } from "./components/KeyMetrics";
import { Dashboard } from "./components/Dashboard";
import phrases from "@/shared/phrases.json";
export const Overview = () => {
  const { hasData, firmTotalsError, isLoadingFirmTotals } = useBillingContext();

  if (firmTotalsError) {
    return (
      <div className="p-4 text-red-500">
        Error loading firm totals: {firmTotalsError.message}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-8">
      {isLoadingFirmTotals ? (
        <div className="flex justify-center gap-4 items-center h-full">
          <LoadingSpinner /> {phrases.globals.loading}
        </div>
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
