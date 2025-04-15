import { useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { InfoCircle } from "iconoir-react";
import { useClientTotals } from "@/api/queries";
import { formatMoney, formatPercent } from "@/shared/utils";
import { ClientTotals } from "@/global/types";
import phrases from "@/shared/phrases.json";

const columnHelper = createColumnHelper<ClientTotals>();

export const useClientsTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedClient, setSelectedClient] = useState<ClientTotals | null>(
    null
  );

  const { data: clientTotals = [], isLoading, error } = useClientTotals();

  const columns = [
    columnHelper.accessor("external_client_id", {
      header: phrases.clients.table.clientId,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("external_tier_id", {
      header: phrases.clients.table.tierId,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("client_name", {
      header: phrases.clients.table.name,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("total_aum_cad", {
      header: phrases.clients.table.totalAum,
      cell: (info) => formatMoney(info.getValue()),
    }),
    columnHelper.accessor("total_fees_cad", {
      header: phrases.clients.table.totalFees,
      cell: (info) => formatMoney(info.getValue()),
    }),
    columnHelper.accessor("effective_fee_rate", {
      header: phrases.clients.table.averageFeeRate,
      cell: (info) => formatPercent(info.getValue()),
    }),
    columnHelper.display({
      id: "details",
      header: phrases.clients.table.additionalInfo,
      enableSorting: false,
      cell: (info) => (
        <button
          className="p-2 hover:bg-blue-100 rounded-full justify-center transition-all duration-300"
          onClick={() => setSelectedClient(info.row.original)}
        >
          <InfoCircle className="h-5 w-5" />
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

  return {
    table,
    selectedClient,
    setSelectedClient,
    isLoading,
    error,
  };
};
