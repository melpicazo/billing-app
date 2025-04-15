import { EmptyState } from "@/components/ui";
import { useBillingContext } from "@/components/contexts";
import { Table } from "@/components/visuals";
import { useAssetsTable } from "./useAssetsTable";

export const Assets = () => {
  const { hasData } = useBillingContext();
  const { table, isLoading, error } = useAssetsTable();

  if (!hasData) return <EmptyState />;

  return (
    <div className="flex flex-col gap-8">
      <Table
        table={table}
        isLoading={isLoading}
        error={error}
        emptyMessage="No assets found."
      />
    </div>
  );
};
