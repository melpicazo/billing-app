import { useBillingContext } from "@/components/contexts";
import phrases from "@/shared/phrases.json";
import { formatMoney, formatPercent } from "@/shared/utils";
import { DollarCircle, StatsUpSquare, PercentageCircle } from "iconoir-react";
import { RefAttributes, SVGProps } from "react";

export interface KeyMetric {
  id: string;
  title: string;
  description: string;
  value: string | undefined;
  Icon: React.ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

export const useKeyMetrics = (): KeyMetric[] => {
  const { firmTotals } = useBillingContext();

  const keyMetrics: KeyMetric[] = [
    {
      id: "totalRevenue",
      title: phrases.overview.keyMetrics.cards.totalRevenue.title,
      description: phrases.overview.keyMetrics.cards.totalRevenue.description,
      value: formatMoney(firmTotals?.firm_revenue_cad),
      Icon: DollarCircle,
    },
    {
      id: "totalAUM",
      title: phrases.overview.keyMetrics.cards.totalAUM.title,
      description: phrases.overview.keyMetrics.cards.totalAUM.description,
      value: formatMoney(firmTotals?.firm_aum_cad),
      Icon: StatsUpSquare,
    },
    {
      id: "averageFeeRate",
      title: phrases.overview.keyMetrics.cards.averageFeeRate.title,
      description: phrases.overview.keyMetrics.cards.averageFeeRate.description,
      value: formatPercent(firmTotals?.firm_average_fee_rate),
      Icon: PercentageCircle,
    },
  ];

  return keyMetrics;
};
