import { ClientsTable } from "./ClientsTable";
import { BillingTiers } from "./BillingTiers";
export const Clients = () => {
  return (
    <div className="flex flex-col gap-8">
      <ClientsTable />
      <BillingTiers />
    </div>
  );
};
