import { useClientsTable } from "./useClientsTable";
import { ClientDetailsModal } from "./ClientDetailsModal";
import { DataTable } from "@/components/ui/Table";

export function ClientsTable() {
  const { table, selectedClient, setSelectedClient, isLoading, error } =
    useClientsTable();

  return (
    <>
      <DataTable
        table={table}
        isLoading={isLoading}
        error={error}
        emptyMessage="No clients found."
      />
      <ClientDetailsModal
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
      />
    </>
  );
}
