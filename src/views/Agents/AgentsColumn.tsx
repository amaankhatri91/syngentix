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
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setAgentDailog,
  setDeleteDialog,
  updateAgentStatus,
} from "@/store/agent/agentSlice";
import { useNavigate } from "react-router-dom";
import Redirect from "@/assets/app-icons/Redirect";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import { useRefetchQueries } from "@/utils/hooks/useRefetchQueries";
import { Spinner } from "@material-tailwind/react";

// Wrapper component for Status cell to handle click and API call
const StatusCell: React.FC<{ row: Agent }> = ({ row }) => {
  const dispatch = useAppDispatch();
  const { invalidateAllQueries } = useRefetchQueries();
  const { isUpdatingStatus, updatingAgentId } = useAppSelector(
    (state) => state.agent
  );
  const { isDark } = useTheme();

  const agentId = row.agent_id || row.id;

  // Determine if agent is active - handle both boolean and string status values
  let isActive = false;
  if (typeof row.status === "boolean") {
    isActive = row.status === true;
  } else if (typeof row.status === "string") {
    isActive = row.status.toLowerCase() === "active";
  }

  const isCurrentlyUpdating = isUpdatingStatus && updatingAgentId === agentId;
  const isDisabled = isUpdatingStatus; // Disable all status badges when any update is in progress

  const handleStatusClick = async () => {
    if (isDisabled) return;

    try {
      if (!agentId) {
        showErrorToast("Agent ID is missing");
        return;
      }

      const newStatus = !isActive;
      const response: any = await dispatch(
        updateAgentStatus({
          agentId: agentId,
          status: newStatus,
        })
      ).unwrap();

      if (response?.data?.status === "success") {
        showSuccessToast(
          response?.data?.message || `Agent status updated successfully`
        );
        // Invalidate agents cache to refetch the updated data
        invalidateAllQueries();
      } else {
        showErrorToast(
          response?.data?.message || "Failed to update agent status"
        );
      }
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        error?.data?.message ||
        "Failed to update agent status. Please try again.";
      showErrorToast(errorMessage);
    }
  };

  return (
    <div
      onClick={handleStatusClick}
      className={`inline-block`}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      onKeyDown={(e) => {
        if (isDisabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleStatusClick();
        }
      }}
      aria-label={`Toggle agent status to ${isActive ? "Offline" : "Active"}`}
      aria-disabled={isDisabled}
    >
      {isCurrentlyUpdating ? (
        <div className="flex items-center justify-center">
          <Spinner
            className={`h-5 w-5 ${isDark ? "text-[#AEB9E1]" : "text-gray-500"}`}
          />
        </div>
      ) : (
        <StatusBadge
          status={{
            label: isActive ? "Active" : "Offline",
            variant: isActive ? "active" : "offline",
          }}
        />
      )}
    </div>
  );
};

// Wrapper component for Actions cell to access theme from auth
const ActionsCell: React.FC<{ row: Agent }> = ({ row }) => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  console.log(row, "Verify Row Data");

  // Determine if agent is active - handle both boolean and string status values
  let isActive = false;
  if (typeof row.status === "boolean") {
    isActive = row.status === true;
  } else if (typeof row.status === "string") {
    isActive = row.status.toLowerCase() === "active";
  }

  // Set color based on status: #AEB9E1 when status is false, otherwise use theme default
  const connectivityColor = !isActive ? "#AEB9E1" : undefined;

  return (
    <ActionButtons
      actions={[
        {
          icon: (
            <Redirect
              color={theme === "dark" ? "#FFFFFF" : "#162230"}
              size={18}
            />
          ),
          onClick: (row) => {
            navigate(`/agents/${row?.agent_id}`);
          },
        },
        {
          icon: <Connectivity theme={theme} color={connectivityColor} />,
          onClick: (row) => {
            console.log("Connect clicked for:", row);
            // Handle connect action
          },
        },

        {
          icon: <EditIcon theme={theme} />,
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
        <div
        // onClick={() => navigate(`/agents/${row?.agent_id}`)}
        // className="font-medium text-left"
        >
          {row.name || "-"}
        </div>
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
    cell: (value, row) => {
      return <StatusCell row={row} />;
    },
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
