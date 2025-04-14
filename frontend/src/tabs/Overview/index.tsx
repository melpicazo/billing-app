import { FileUpload } from "@/components";
import phrases from "@/shared/phrases.json";
import { useBillingContext } from "@/components";
import { useKeyMetrics } from "./useKeyMetrics";
import { Card } from "@/components/ui/Card";
export const Overview = () => {
  const { hasData, statusError, isLoadingStatus } = useBillingContext();
  const keyMetrics = useKeyMetrics();

  if (statusError) {
    return (
      <div className="p-4 text-red-500">
        Error loading system status: {statusError.message}
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <div className="container-default-spacing flex flex-col gap-4 border-b border-gray-200 bg-white shadow-sm">
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
              <div className="container-default-spacing flex flex-col gap-8">
                <h2>Key Metrics</h2>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  {keyMetrics.map((metric) => {
                    if (!metric.value) return;
                    return (
                      <Card key={metric.id}>
                        <div className="flex flex-col gap-4">
                          <h4 className="font-semibold flex gap-2 items-center text-yellow-700">
                            <metric.Icon className="w-5 h-5 shrink-0 stroke-2" />{" "}
                            {metric.title}
                          </h4>
                          <div className="flex flex-col gap-2">
                            <p className="text-sm">{metric.description}</p>
                            <p className="text-lg tracking-wider">
                              {metric.value}
                            </p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
