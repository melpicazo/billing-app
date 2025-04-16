import { useKeyMetrics } from "../useKeyMetrics";
import { Card } from "@/components/ui";
import phrases from "@/shared/phrases.json";

export const KeyMetrics = () => {
  const keyMetrics = useKeyMetrics();
  return (
    <div className="flex flex-col gap-8">
      <h2>{phrases.overview.keyMetrics.title}</h2>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {keyMetrics.map((metric) => {
          if (!metric.value) return;
          return (
            <Card key={metric.id}>
              <div className="flex flex-col gap-4 h-full">
                <h4 className="font-semibold flex gap-2 items-center text-sky-700">
                  <metric.Icon className="w-5 h-5 shrink-0 stroke-2" />{" "}
                  {metric.title}
                </h4>
                <div className="flex flex-col flex-1 justify-between gap-2">
                  <p className="text-sm">{metric.description}</p>
                  <p className="text-xl font-heading tracking-wider text-emerald-600">
                    {metric.value}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
