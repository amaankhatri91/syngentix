import {
  ActionButtons,
  DataTableColumn,
  StatusBadge,
} from "@/components/DataTable";
import { Agent } from "./types";
import Connectivity from "@/assets/app-icons/Connectivity";
import EditIcon from "@/assets/app-icons/EditIcon";
import DeleteIcon from "@/assets/app-icons/DeleteIcon";
import useTheme from "@/utils/hooks/useTheme";
import React from "react";
import { useAppDispatch } from "@/store";
import { setAgentDailog, setDeleteDialog } from "@/store/agent/agentSlice";
import { useNavigate } from "react-router-dom";

// Wrapper component for Actions cell to access theme from auth
const ActionsCell: React.FC<{ row: Agent }> = ({ row }) => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  console.log(row, "Verify Row Data");

  return (
    <ActionButtons
      actions={[
        {
          icon: <Connectivity theme={theme} />,
          label: "Connect",
          onClick: (row) => {
            console.log("Connect clicked for:", row);
            // Handle connect action
          },
        },
        {
          icon: <EditIcon theme={theme} />,
          label: "Link",
          onClick: (row) => {
            console.log("Link clicked for:", row);
            // Handle link action
            dispatch(
              setAgentDailog({
                agentDailog: true,
                agentRow: row,
              })
            );
          },
        },
        {
          icon: <DeleteIcon theme={theme} />,
          label: "Delete",
          onClick: (row) => {
            dispatch(
              setDeleteDialog({
                deleteDialog: true,
                deleteAgentRow: row,
              })
            );
          },
        },
      ]}
      row={row}
    />
  );
};

export const columns: DataTableColumn<Agent>[] = [
  {
    id: "select",
    header: "",
    accessorKey: "id",
    enableSorting: false,
    size: 5,
    align: "left",
  },
  {
    id: "name",
    header: "Name",
    accessorKey: "name",
    enableSorting: true,
    size: 200,
    align: "left",
    cell: (value, row) => {
      const navigate = useNavigate();
      return (
        <button
          onClick={() => navigate(`/agents/${row?.agent_id}`)}
          className="font-medium text-left"
        >
          {row.name || "-"}
        </button>
      );
    },
  },
  {
    id: "description",
    header: "Description",
    accessorKey: "description",
    enableSorting: true,
    size: 300,
    align: "left",
    cell: (value) => <h5 className="text-sm">{value || "-"}</h5>,
  },
  {
    id: "workflows",
    header: "Workflows",
    accessorKey: "workflows",
    enableSorting: true,
    size: 120,
    align: "center",
    cell: (value) => (
      <h5 className="font-mono">{Array.isArray(value) ? value.length : "-"}</h5>
    ),
  },
  {
    id: "users",
    header: "Users",
    accessorKey: "users",
    enableSorting: true,
    size: 100,
    align: "center",
    cell: (value) => <h5 className="font-mono">{"-"}</h5>,
  },
  {
    id: "files",
    header: "Files",
    accessorKey: "files",
    enableSorting: true,
    size: 100,
    align: "center",
    cell: (value) => <h5 className="font-mono">{"-"}</h5>,
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
          label: row.status !== "active" ? "Active" : "Offline",
          variant: row.status !== "active" ? "active" : "offline",
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
    cell: (value, row) => <ActionsCell row={row} />,
  },
];
