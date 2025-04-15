import { ClientsTable } from "./ClientsTable";
import { BillingTiers } from "./BillingTiers";
import { useBillingContext } from "@/components/contexts/BillingContext";
import { EmptyState } from "@/components";
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
