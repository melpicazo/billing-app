import { useBillingTiers } from "@/api/queries";
import { LoadingSpinner } from "@/components/ui";
import { Card } from "@/components/ui";
import { formatMoney, formatPercent } from "@/shared/utils";

export const BillingTiers = () => {
  const { data: billingTiers = [], isLoading: isLoadingBillingTiers } =
    useBillingTiers();

  return (
    <div className="flex flex-col gap-8">
      <h2>Billing Tiers</h2>
      <p>
        Note that the billing tier and fee percentages are calculated at the
        Portfolio level (and not client level). This means that the fee rules in
        the tier are applied PER portfolio, not on the client's AUM as a whole.
      </p>
      {isLoadingBillingTiers ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {billingTiers.map((tier, index) => (
            <Card key={tier.id ?? index}>
              <div className="flex flex-col gap-4 h-full">
                <h4 className="font-semibold flex gap-2 items-center text-sky-700">
                  Tier {tier.external_tier_id}
                </h4>
                <div className="flex flex-col flex-1 justify-between gap-2 font-heading">
                  {tier.ranges.map((range) => (
                    <p key={range.id}>
                      {formatMoney(range.portfolio_aum_min, 0)} –{" "}
                      {formatMoney(range.portfolio_aum_max, 0)}:{" "}
                      {formatPercent(range.fee_percentage)}
                    </p>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
