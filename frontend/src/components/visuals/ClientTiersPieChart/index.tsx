import { useClientTotals } from "@/api/queries";
import { LoadingSpinner, Card } from "@/components/ui";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  TooltipProps,
} from "recharts";
import _ from "lodash";
import phrases from "@/shared/phrases.json";
import { getIndexedColor } from "@/shared/utils";

interface CustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

interface ChartData {
  name: string;
  value: number;
  percentage: number;
  clients: string[];
}

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: CustomizedLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-sm"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const renderTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload || !payload[0]) return null;
  const data = payload[0].payload as ChartData;
  return (
    <div className="bg-white p-3 rounded-md shadow-md border border-gray-200">
      <p className="font-medium mb-1">{data.name}</p>
      <p className="text-sm text-gray-600 mb-2">
        {data.value} {phrases.visuals.global.clients} •{" "}
        {data.percentage.toFixed(1)}%
      </p>
      <div className="text-xs text-gray-500 max-h-[100px] overflow-y-auto">
        {data.clients.map((client, i) => (
          <div key={i}>{client}</div>
        ))}
      </div>
    </div>
  );
};

const renderLegend = (data: ChartData[]) => {
  return (value: string) => {
    const item = data.find((d) => d.name === value);
    if (!item) return value;

    return (
      <span className="flex items-center gap-2 text-gray-700">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{
            backgroundColor: getIndexedColor(
              data.findIndex((d) => d.name === value)
            ),
          }}
        />
        <span className="font-medium">{value}</span>
        <span className="text-sm text-gray-500">
          {item.value} client(s) • {item.percentage.toFixed(1)}%
        </span>
      </span>
    );
  };
};

export const ClientTiersPieChart = () => {
  const { data: clientTotals = [], isLoading } = useClientTotals();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  /**
   * Group clients by tier ID
   * Then calculate the percentage of clients in each tier
   */
  const totalClients = clientTotals.length;
  const data: ChartData[] = _(clientTotals)
    .groupBy("external_tier_id")
    .map((clients, tierId) => ({
      name: `${phrases.visuals.global.tier} ${tierId}`,
      value: clients.length,
      percentage: (clients.length / totalClients) * 100,
      clients: clients.map((c) => c.client_name),
    }))
    .sortBy("name")
    .value();

  return (
    <Card>
      <div className="flex flex-col gap-6 md:gap-4 font-heading">
        <h4 className="font-semibold flex gap-2 items-center text-sky-700">
          {phrases.visuals.clientTiersPieChart.title}
        </h4>
        <div className="h-[350px] md:h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                cx="50%"
                cy="45%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius="85%"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={getIndexedColor(index)}
                    className="transition-all duration-200 hover:opacity-80 cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip content={renderTooltip} />
              <Legend
                verticalAlign="bottom"
                align="center"
                iconSize={0}
                formatter={renderLegend(data)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
