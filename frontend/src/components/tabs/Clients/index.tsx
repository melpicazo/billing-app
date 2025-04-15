import { ClientsTable } from "./ClientsTable";
import { BillingTiers } from "./BillingTiers";
import { useBillingContext } from "@/components/contexts";
import { EmptyState } from "@/components/ui";

export const Clients = () => {
  const { hasData } = useBillingContext();
  if (!hasData) return <EmptyState />;

  return (
    <div className="flex flex-col gap-8">
      <ClientsTable />
      <BillingTiers />
    </div>
  );
};
