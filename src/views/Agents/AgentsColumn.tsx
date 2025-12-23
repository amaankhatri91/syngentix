import { ActionButtons, DataTableColumn, StatusBadge } from "@/components/DataTable";
import { HiPaperClip, HiTrash, HiWifi } from "react-icons/hi2";
import { FinancialAgent } from "./type";

export const columns: DataTableColumn<FinancialAgent>[] = [
  {
    id: "select",
    header: "",
    accessorKey: "id",
    enableSorting: false,
    size: 60,
    align: "left",
  },
  {
    id: "name",
    header: "Name",
    accessorKey: "name",
    enableSorting: true,
    size: 200,
    align: "left",
    cell: (value, row) => <span className="font-medium">{row.name}</span>,
  },
  {
    id: "workflows",
    header: "Workflows",
    accessorKey: "workflows",
    enableSorting: true,
    size: 120,
    align: "center",
    cell: (value) => (
      <span className="font-mono">{String(value).padStart(2, "0")}</span>
    ),
  },
  {
    id: "conversations",
    header: "Conversations",
    accessorKey: "conversations",
    enableSorting: true,
    size: 140,
    align: "center",
    cell: (value) => (
      <span className="font-mono">{String(value).padStart(2, "0")}</span>
    ),
  },
  {
    id: "users",
    header: "Users",
    accessorKey: "users",
    enableSorting: true,
    size: 100,
    align: "center",
    cell: (value) => (
      <span className="font-mono">{String(value).padStart(2, "0")}</span>
    ),
  },
  {
    id: "files",
    header: "Files",
    accessorKey: "files",
    enableSorting: true,
    size: 100,
    align: "center",
    cell: (value) => (
      <span className="font-mono">{String(value).padStart(2, "0")}</span>
    ),
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    enableSorting: true,
    size: 120,
    align: "center",
    cell: (value, row) => (
      <StatusBadge
        status={{
          label: row.status === "active" ? "Active" : "Offline",
          variant: row.status === "active" ? "active" : "offline",
        }}
      />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    size: 150,
    align: "center",
    cell: (value, row) => (
      <ActionButtons
        actions={[
          {
            icon: <HiWifi className="w-4 h-4" />,
            label: "Connect",
            onClick: (row) => {
              console.log("Connect clicked for:", row);
              // Handle connect action
            },
            variant: "primary",
          },
          {
            icon: <HiPaperClip className="w-4 h-4" />,
            label: "Link",
            onClick: (row) => {
              console.log("Link clicked for:", row);
              // Handle link action
            },
            variant: "secondary",
          },
          {
            icon: <HiTrash className="w-4 h-4" />,
            label: "Delete",
            onClick: (row) => {
              console.log("Delete clicked for:", row);
              // Handle delete action
            },
            variant: "danger",
          },
        ]}
        row={row}
      />
    ),
  },
];