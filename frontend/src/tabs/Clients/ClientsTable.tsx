import { flexRender } from "@tanstack/react-table";
import { Modal } from "@/components/ui/Modal";
import { useClientPortfolios } from "@/api/queries";
import { cn, formatMoney, formatPercent } from "@/shared/utils";
import { useClientsTable } from "./useClientsTable";

export function ClientsTable() {
  const { table, selectedClient, setSelectedClient, isLoading, error } =
    useClientsTable();

  const { data: portfolios = [], isLoading: isLoadingPortfolios } =
    useClientPortfolios(selectedClient?.client_id ?? null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-600">
        Error loading client data. Please try again later.
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full bg-white">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  return (
                    <th
                      key={header.id}
                      className={cn(
                        "border-b px-4 py-2 text-left font-heading font-medium whitespace-nowrap select-none",
                        canSort ? "cursor-pointer" : "cursor-default"
                      )}
                      onClick={
                        canSort
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                    >
                      <div
                        className={cn("flex items-center gap-2", {
                          "hover:text-blue-600 transition-all duration-300":
                            canSort,
                        })}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {canSort && (
                          <span className="inline-block w-4">
                            {{
                              asc: "↑",
                              desc: "↓",
                            }[header.column.getIsSorted() as string] ?? ""}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cn("px-4 py-2 whitespace-nowrap", {
                      "text-center": cell.id.includes("details"),
                    })}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!selectedClient}
        onClose={() => setSelectedClient(null)}
        title={selectedClient?.client_name + " Details"}
      >
        {selectedClient && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Client Summary</h3>
              <div className="mt-2 space-y-2">
                <div className="rounded-md bg-gray-50 p-2">
                  <p>Client ID: {selectedClient.external_client_id}</p>
                  <p>Total AUM: {formatMoney(selectedClient.total_aum_cad)}</p>
                  <p>
                    Total Fees: {formatMoney(selectedClient.total_fees_cad)}
                  </p>
                  <p>
                    Effective Fee Rate:{" "}
                    {formatPercent(selectedClient.effective_fee_rate)}
                  </p>
                  <p>Number of Portfolios: {selectedClient.num_portfolios}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold">Portfolios</h3>
              <div className="mt-2">
                {isLoadingPortfolios ? (
                  <div className="flex items-center justify-center h-24">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {portfolios.map((portfolio) => (
                      <div
                        key={portfolio.portfolio_id}
                        className="rounded-md bg-gray-50 p-2"
                      >
                        <p>Portfolio ID: {portfolio.external_portfolio_id}</p>
                        <p>AUM: {formatMoney(portfolio.total_aum_cad)}</p>
                        <p>Fees: {formatMoney(portfolio.total_fees_cad)}</p>
                        <p>
                          Effective Rate:{" "}
                          {formatPercent(portfolio.effective_fee_rate)}
                        </p>
                      </div>
                    ))}
                    {portfolios.length === 0 && (
                      <p className="text-gray-500">
                        No portfolios found for this client.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
