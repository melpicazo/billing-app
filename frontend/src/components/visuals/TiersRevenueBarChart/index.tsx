import { useClientTotals } from "@/api/queries";
import { LoadingSpinner, Card } from "@/components/ui";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import _ from "lodash";
import phrases from "@/shared/phrases.json";
import { getIndexedColor, formatMoney } from "@/shared/utils";

interface StackedData {
  tier: string;
  total: number;
  /* We need to use a dynamic key for the clients because the client names are unknown and unique */
  [key: string]: number | string;
}

export const TiersRevenueBarChart = () => {
  const { data: clientTotals = [], isLoading } = useClientTotals();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  /**
   * Group clients by tier
   * For each client, add the total fee revenue to the tier object
   */
  const stackedData: StackedData[] = _(clientTotals)
    .groupBy("external_tier_id")
    .map((clients, tierId) => {
      const tierData: StackedData = {
        tier: `${phrases.visuals.global.tier} ${tierId}`,
        total: _.sumBy(clients, "total_fees_cad"),
      };
      clients.forEach((client) => {
        tierData[client.client_name] = client.total_fees_cad;
      });
      return tierData;
    })
    .sortBy("tier")
    .value();

  /* Get unique client names for the bar labels */
  const clientNames = _(clientTotals).map("client_name").uniq().value();

  return (
    <Card>
      <div className="flex flex-col gap-6 md:gap-4 font-heading">
        <h4 className="font-semibold flex gap-2 items-center text-sky-700">
          {phrases.visuals.tiersRevenueBarChart.title}
        </h4>
        <div className="h-[350px] md:h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stackedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tier" className="text-sm" />
              <YAxis
                tickFormatter={(value) => formatMoney(value, 0)}
                className="text-sm"
                width={80}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatMoney(value),
                  name,
                ]}
                labelStyle={{ color: "black" }}
                wrapperClassName="bg-white p-3 rounded-md shadow-md border border-gray-200"
              />
              <Legend />
              {clientNames.map((clientName, index) => (
                <Bar
                  key={clientName}
                  dataKey={clientName}
                  stackId="revenue"
                  fill={getIndexedColor(index)}
                  className="transition-all duration-200 cursor-pointer"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
