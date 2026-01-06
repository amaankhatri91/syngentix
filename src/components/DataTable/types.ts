import { ColumnDef, SortingState, RowSelectionState } from "@tanstack/react-table";
import { ReactNode } from "react";

export interface StatusBadge {
  label: string;
  variant: "active" | "offline" | "custom";
  color?: string;
}

export interface ActionButton {
  icon: ReactNode;
  label?: string;
  onClick: (row: any) => void;
  variant?: "primary" | "secondary" | "danger";
}

export interface DataTableColumn<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (value: any, row: T) => ReactNode;
  align?: "left" | "center" | "right";
  enableSorting?: boolean;
  enableResizing?: boolean;
  size?: number;
  minSize?: number;
  maxSize?: number;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  enableRowSelection?: boolean;
  rowSelection?: boolean;
  enableSorting?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  onRowSelectionChange?: (selectedRows: T[]) => void;
  onSortingChange?: (sorting: SortingState) => void;
  getRowId?: (row: T) => string;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
}

export interface TableActionColumn<T> {
  actions: ActionButton[];
  header?: string;
}



