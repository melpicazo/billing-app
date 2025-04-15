import { ClientsTable } from "./ClientsTable";
import { BillingTiers } from "./BillingTiers";
import { useBillingContext } from "@/components/contexts/BillingContext";

export const Clients = () => {
  const { hasData } = useBillingContext();
  if (!hasData) {
    return (
      <div className="flex flex-col gap-8">
        Looks like you have no data uploaded! Please go back to the Overview tab
        to import your data.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <ClientsTable />
      <BillingTiers />
    </div>
  );
};
