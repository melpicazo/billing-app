import { flexRender, type Table } from "@tanstack/react-table";
import { cn } from "@/shared/utils";
import { LoadingSpinner } from "@/components";

interface DataTableProps<T> {
  table: Table<T>;
  isLoading?: boolean;
  error?: Error | null;
  emptyMessage?: string;
}

export function DataTable<T>({
  table,
  isLoading = false,
  error = null,
  emptyMessage = "No data available",
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-600">
        Error loading data. Please try again later.
      </div>
    );
  }

  if (table.getRowModel().rows.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
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
                    "text-center": cell.column.id.includes("actions"),
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
  );
}
