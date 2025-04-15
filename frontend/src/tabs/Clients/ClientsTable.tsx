import { useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { InfoCircle } from "iconoir-react";
import { Modal } from "@/components/ui/Modal";
import { useClientTotals, useClientPortfolios } from "@/api/queries";
import { formatMoney, formatPercent } from "@/shared/utils";
import { ClientTotals } from "@/global/types";

const columnHelper = createColumnHelper<ClientTotals>();

export function ClientsTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedClient, setSelectedClient] = useState<ClientTotals | null>(
    null
  );

  const { data: clientTotals = [], isLoading, error } = useClientTotals();
  const { data: portfolios = [], isLoading: isLoadingPortfolios } =
    useClientPortfolios(selectedClient?.client_id ?? null);

  const columns = [
    columnHelper.accessor("external_client_id", {
      header: "Client ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("client_name", {
      header: "Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("total_aum_cad", {
      header: "Total AUM",
      cell: (info) => formatMoney(info.getValue()),
    }),
    columnHelper.accessor("total_fees_cad", {
      header: "Total Fees",
      cell: (info) => formatMoney(info.getValue()),
    }),
    columnHelper.accessor("effective_fee_rate", {
      header: "Effective Rate",
      cell: (info) => formatPercent(info.getValue()),
    }),
    columnHelper.accessor("num_portfolios", {
      header: "Portfolios",
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: "actions",
      header: "Info",
      cell: (info) => (
        <button
          className="p-2 hover:bg-gray-100 rounded-full"
          onClick={() => setSelectedClient(info.row.original)}
        >
          <InfoCircle className="h-4 w-4" />
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: clientTotals,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

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
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-b px-4 py-2 text-left font-medium"
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ cursor: "pointer" }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: " ↑",
                      desc: " ↓",
                    }[header.column.getIsSorted() as string] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
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
