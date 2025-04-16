import {
  ClientTiersPieChart,
  TiersRevenueBarChart,
} from "@/components/visuals";
import phrases from "@/shared/phrases.json";

export const Dashboard = () => {
  return (
    <div className="flex flex-col gap-8">
      <h2>{phrases.overview.dashboard.title}</h2>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ClientTiersPieChart />
        <TiersRevenueBarChart />
      </div>
    </div>
  );
};
