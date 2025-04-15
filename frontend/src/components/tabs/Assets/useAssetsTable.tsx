import { useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { formatMoney } from "@/shared/utils";
import { useAssets } from "@/api/queries";
import { Asset } from "@/global/types";

const columnHelper = createColumnHelper<Asset>();

export const useAssetsTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { data: assets = [], isLoading, error } = useAssets();

  const columns = [
    columnHelper.accessor("asset_id", {
      header: "Asset ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("external_portfolio_id", {
      header: "Portfolio ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("asset_value", {
      header: "Value",
      cell: (info) => formatMoney(info.getValue()),
    }),
    columnHelper.accessor("currency", {
      header: "Currency",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("date", {
      header: "Date",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
  ];

  const table = useReactTable({
    data: assets,
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
    isLoading,
    error,
  };
};
