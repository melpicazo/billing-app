import { EmptyState } from "@/components/ui";
import { useBillingContext } from "@/components/contexts";
import { DataTable } from "@/components/ui/Table";
import { useAssetsTable } from "./useAssetsTable";

export const Assets = () => {
  const { hasData } = useBillingContext();
  const { table, isLoading, error } = useAssetsTable();

  if (!hasData) return <EmptyState />;

  return (
    <div className="flex flex-col gap-8">
      <DataTable
        table={table}
        isLoading={isLoading}
        error={error}
        emptyMessage="No assets found."
      />
    </div>
  );
};
