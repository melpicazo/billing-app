import { useClientsTable } from "../useClientsTable";
import { ClientDetailsModal } from "./ClientDetailsModal";
import { Table } from "@/components/ui";

export function ClientsTable() {
  const { table, selectedClient, setSelectedClient, isLoading, error } =
    useClientsTable();

  return (
    <>
      <Table
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
