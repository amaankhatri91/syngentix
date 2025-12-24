import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  RowSelectionState,
} from "@tanstack/react-table";
import useTheme from "@/utils/hooks/useTheme";
import { DataTableProps, DataTableColumn, ActionButton } from "./types";
import { HiChevronUp, HiChevronDown } from "react-icons/hi2";
import CheckboxCell from "./CheckboxCell";

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  enableRowSelection = false,
  enableSorting = true,
  enablePagination = false,
  pageSize = 10,
  onRowSelectionChange,
  onSortingChange,
  getRowId,
  className = "",
  emptyMessage = "No data available",
  loading = false,
}: DataTableProps<T>) => {
  const { theme, isDark } = useTheme();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Convert custom columns to TanStack Table columns
  const tableColumns = useMemo<ColumnDef<T>[]>(() => {
    return columns.map((col) => ({
      id: col.id,
      header: col.header,
      accessorKey: col.accessorKey as string,
      meta: {
        align: col.align ?? "left",
      },
      enableSorting: col.enableSorting !== false && enableSorting,
      size: col.size,
      minSize: col.minSize,
      maxSize: col.maxSize,
      cell: ({ row, getValue }) => {
        const value = getValue();
        if (col.cell) {
          return col.cell(value, row.original);
        }
        return value ?? "-";
      },
    }));
  }, [columns, enableSorting]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      rowSelection: enableRowSelection ? rowSelection : undefined,
    },
    enableRowSelection: enableRowSelection,
    onRowSelectionChange: enableRowSelection ? setRowSelection : undefined,
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);
      onSortingChange?.(newSorting);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    initialState: {
      pagination: {
        pageSize,
      },
    },
    getRowId: getRowId,
  });

  // Handle row selection change
  React.useEffect(() => {
    if (enableRowSelection && onRowSelectionChange) {
      const selectedRows = table
        .getSelectedRowModel()
        .rows.map((row) => row.original);
      onRowSelectionChange(selectedRows);
    }
  }, [rowSelection, enableRowSelection, onRowSelectionChange, table]);

  return (
    <div className={`data-table-container ${className}`} data-theme={theme}>
      <div className="overflow-x-auto">
        <table
          className={`w-full border-separate border-spacing-y-1 ${
            isDark ? "bg-[#0c1116]" : "bg-white"
          }`}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                style={
                  !isDark
                    ? {
                        boxShadow: "1px 4px 6px rgba(33, 84, 238, 0.1)",
                      }
                    : undefined
                }
                className={!isDark ? "rounded-lg" : ""}
              >
                {headerGroup.headers.map((header, index) => {
                  const canSort = header.column.getCanSort();
                  const sortDirection = header.column.getIsSorted();
                  const isSelectColumn = header.id === "select";
                  const isFirst = index === 0;
                  const isLast = index === headerGroup.headers.length - 1;
                  const align =
                    (
                      header.column.columnDef.meta as {
                        align?: "left" | "center" | "right";
                      }
                    )?.align ?? "left";
                  const textAlignClass =
                    align === "center"
                      ? "text-center"
                      : align === "right"
                      ? "text-right"
                      : "text-start";
                  const headerJustifyClass =
                    align === "center"
                      ? "justify-center"
                      : align === "right"
                      ? "justify-end"
                      : "justify-start";

                  return (
                    <th
                      key={header.id}
                      className={`px-4 py-2 ${textAlignClass} text-sm font-medium ${
                        isDark ? "text-[#FFFFFF]" : "text-[#162230]"
                      } ${
                        !isDark
                          ? isFirst
                            ? "rounded-tl-lg rounded-bl-lg"
                            : ""
                          : ""
                      } ${
                        !isDark
                          ? isLast
                            ? "rounded-tr-lg rounded-br-lg"
                            : ""
                          : ""
                      }`}
                      style={{
                        width: header.getSize()
                          ? `${header.getSize()}px`
                          : undefined,
                        ...(!isDark
                          ? {
                              borderTop: "1px solid #EEF4FF",
                              borderBottom: "1px solid #EEF4FF",
                              borderLeft: isFirst
                                ? "1px solid #EEF4FF"
                                : "none",
                              borderRight: isLast
                                ? "1px solid #EEF4FF"
                                : "none",
                            }
                          : {}),
                      }}
                    >
                      {header.isPlaceholder ? null : isSelectColumn &&
                        enableRowSelection ? (
                        <CheckboxCell
                          checked={table.getIsAllRowsSelected()}
                          onChange={(checked) => {
                            if (checked) {
                              table.toggleAllRowsSelected(true);
                            } else {
                              table.toggleAllRowsSelected(false);
                            }
                          }}
                        />
                      ) : (
                        <div
                          className={`flex items-center gap-2 ${headerJustifyClass} ${
                            canSort ? "cursor-pointer select-none" : ""
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {canSort && (
                            <span className="flex flex-col">
                              <HiChevronUp
                                className={`w-3 h-3 ${
                                  sortDirection === "asc"
                                    ? isDark
                                      ? "text-purple-400"
                                      : "text-purple-600"
                                    : isDark
                                    ? "text-gray-500"
                                    : "text-gray-400"
                                }`}
                              />
                              <HiChevronDown
                                className={`w-3 h-3 -mt-1 ${
                                  sortDirection === "desc"
                                    ? isDark
                                      ? "text-purple-400"
                                      : "text-purple-600"
                                    : isDark
                                    ? "text-gray-500"
                                    : "text-gray-400"
                                }`}
                              />
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className={`px-4 py-8 text-center ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Loading...
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className={`px-4 py-8 text-center ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => {
                const cells = row.getVisibleCells();
                return (
                  <tr
                    key={row.id}
                    className={`transition-all duration-200 rounded-lg overflow-hidden ${
                      isDark
                        ? "bg-[#0F1724] hover:bg-[#1A2335]"
                        : "bg-white hover:bg-gray-50"
                    } shadow-sm`}
                  >
                    {cells.map((cell, index) => {
                      const isSelectCell = cell.column.id === "select";
                      const isFirst = index === 0;
                      const isLast = index === cells.length - 1;
                      const align =
                        (
                          cell.column.columnDef.meta as {
                            align?: "left" | "center" | "right";
                          }
                        )?.align ?? "left";
                      const textAlignClass =
                        align === "center"
                          ? "text-center"
                          : align === "right"
                          ? "text-right"
                          : "text-start";
                      return (
                        <td
                          key={cell.id}
                          className={`px-4 py-1 text-sm ${textAlignClass} ${
                            isFirst ? "rounded-tl-lg rounded-bl-lg" : ""
                          } ${isLast ? "rounded-tr-lg rounded-br-lg" : ""} ${
                            isDark ? "!text-white" : "!text-gray-700"
                          }`}
                          style={{
                            width: cell.column.getSize()
                              ? `${cell.column.getSize()}px`
                              : undefined,
                            ...(!isDark
                              ? {
                                  borderTop: "1px solid #EEF4FF",
                                  borderBottom: "1px solid #EEF4FF",
                                  borderLeft: isFirst
                                    ? "1px solid #EEF4FF"
                                    : "none",
                                  borderRight: isLast
                                    ? "1px solid #EEF4FF"
                                    : "none",
                                }
                              : {}),
                          }}
                        >
                          {isSelectCell && enableRowSelection ? (
                            <CheckboxCell
                              checked={row.getIsSelected()}
                              onChange={(checked) =>
                                row.toggleSelected(checked)
                              }
                            />
                          ) : (
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {enablePagination && table.getPageCount() > 1 && (
        <div
          className={`flex items-center justify-between px-4 py-3 border-t ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Showing {table.getState().pagination.pageIndex * pageSize + 1} to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * pageSize,
              data.length
            )}{" "}
            of {data.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                table.getCanPreviousPage()
                  ? isDark
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : isDark
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                table.getCanNextPage()
                  ? isDark
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : isDark
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
