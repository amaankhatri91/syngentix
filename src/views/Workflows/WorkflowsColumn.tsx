import { DataTableColumn, StatusBadge } from "@/components/DataTable";
import { Workflow } from "./types";
import ViewIcon from "@/assets/app-icons/ViewIcon";
import DownloadIcon from "@/assets/app-icons/DownloadIcon";
import DeleteIcon from "@/assets/app-icons/DeleteIcon";
import useTheme from "@/utils/hooks/useTheme";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setWorkflowDialog,
  setDeleteDialog,
  setDuplicateWorkflowDialog,
  updateWorkflowStatus,
} from "@/store/workflow/workflowSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/Button";
import { CopyIcon, EditIcon } from "@/assets/app-icons";
import { formatDate, formatRelativeTime } from "@/utils/common";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import { useRefetchQueries } from "@/utils/hooks/useRefetchQueries";
import { Spinner } from "@material-tailwind/react";
import TruncatedText from "@/components/TruncatedText";

// Wrapper component for Status cell to handle click and API call
const StatusCell: React.FC<{ row: Workflow }> = ({ row }) => {
  const dispatch = useAppDispatch();
  const { invalidateAllQueries } = useRefetchQueries();
  const { isUpdatingStatus, updatingWorkflowId } = useAppSelector(
    (state) => state.workflow
  );
  const { isDark } = useTheme();

  const workflowId = row.workflow_id || row.id;
  const isActive =
    row.status === true || row.status === "active" || row.isActive === true;
  const isCurrentlyUpdating =
    isUpdatingStatus && updatingWorkflowId === workflowId;
  const isDisabled = isUpdatingStatus; // Disable all status badges when any update is in progress

  const handleStatusClick = async () => {
    if (isDisabled) return;

    try {
      if (!workflowId) {
        showErrorToast("Workflow ID is missing");
        return;
      }

      const newStatus = !isActive;
      const response: any = await dispatch(
        updateWorkflowStatus({
          workflowId: workflowId,
          status: newStatus,
        })
      ).unwrap();

      if (response?.data?.status === "success") {
        showSuccessToast(
          response?.data?.message || `Workflow status updated successfully`
        );
        // Invalidate workflows cache to refetch the updated data
        invalidateAllQueries();
      } else {
        showErrorToast(
          response?.data?.message || "Failed to update workflow status"
        );
      }
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        error?.data?.message ||
        "Failed to update workflow status. Please try again.";
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
      aria-label={`Toggle workflow status to ${
        isActive ? "Offline" : "Active"
      }`}
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

const FlowCell: React.FC<{ row: Workflow }> = ({ row }) => {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();

  const handleGoToFlow = () => {
    navigate(`/agent/${agentId}/workflow/${row?.workflow_id}`, {
      state: {
        workflowTitle: row?.title,
        workflowDescription: row?.description,
        execution_timeout: row?.execution_timeout,
        retry_attempts: row?.retry_attempts,
        concurrency_limit: row?.concurrency_limit,
      },
    });
  };

  return (
    <div className="flex items-center justify-center">
      <Button
        onClick={handleGoToFlow}
        className="!px-4 !py-1 !text-sm !rounded-full text-white !bg-gradient-to-r from-[#9133ea] to-[#2962eb]"
      >
        Go to Flow
      </Button>
    </div>
  );
};

// Wrapper component for Actions cell to access theme and handlers
const ActionsCell: React.FC<{ row: Workflow }> = ({ row }) => {
  const { theme, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();

  const handleGoToFlow = () => {
    navigate(`/agent/${agentId}/workflow/${row?.workflow_id}`, {
      state: {
        workflowTitle: row?.title,
        workflowDescription: row?.description,
        execution_timeout: row?.execution_timeout,
        retry_attempts: row?.retry_attempts,
        concurrency_limit: row?.concurrency_limit,
      },
    });
  };

  const handleEdit = () => {
    dispatch(
      setWorkflowDialog({
        workflowDialog: true,
        workflowRow: row,
      })
    );
  };

  const handleDownload = () => {
    console.log("Download clicked for workflow:", row.id);
  };

  const handleDelete = () => {
    dispatch(
      setDeleteDialog({
        deleteDialog: true,
        deleteWorkflowRow: row,
      })
    );
  };

  const handleDuplicate = () => {
    dispatch(
      setDuplicateWorkflowDialog({
        duplicateWorkflowDialog: true,
        duplicateWorkflowRow: row,
      })
    );
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex items-center gap-1">
        <button
          onClick={handleDuplicate}
          className={`p-1.5 rounded`}
          aria-label="Duplicate"
        >
          <CopyIcon size={18} />
        </button>
        <button
          onClick={handleEdit}
          className={`p-1.5 rounded`}
          aria-label="View"
        >
          <EditIcon theme={theme} height={18} />
        </button>
        <button
          onClick={handleDownload}
          className={`p-1.5 rounded `}
          aria-label="Download"
        >
          <DownloadIcon theme={theme} height={18} />
        </button>
        <button
          onClick={handleDelete}
          className={`p-1.5 rounded `}
          aria-label="Delete"
        >
          <DeleteIcon theme={theme} height={18} />
        </button>
      </div>
    </div>
  );
};

export const columns: DataTableColumn<Workflow>[] = [
  {
    id: "workflowName",
    header: "Workflow Name",
    accessorKey: "title",
    enableSorting: true,
    size: 90,
    align: "left",
    cell: (value, row) => (
      <div className="flex flex-col gap-1">
        <TruncatedText
          text={row.title || "-"}
          maxLength={50}
          className="font-medium text-base"
          as="h3"
          readMoreText="Read more"
          readLessText="Read less"
        />
        <TruncatedText
          text={row.description || "-"}
          maxLength={80}
          className="text-sm text-gray-500 dark:text-[#BDC9F5]"
          readMoreText="Read more"
          readLessText="Read less"
        />
      </div>
    ),
  },
  {
    id: "owner",
    header: "Owner",
    accessorKey: "owner_name",
    enableSorting: true,
    size: 80,
    align: "left",
    cell: (value) => <h5 className="text-sm">{value || "-"}</h5>,
  },
  {
    id: "triggers",
    header: "Triggers",
    accessorKey: "triggers_count",
    enableSorting: true,
    size: 80,
    align: "center",
    cell: (value) => (
      <h5 className="font-mono text-sm">
        {value !== undefined && value !== null
          ? String(value).padStart(2, "0")
          : "00"}
      </h5>
    ),
  },
  {
    id: "actionsCount",
    header: "Actions",
    accessorKey: "actions_count",
    enableSorting: true,
    size: 80,
    align: "center",
    cell: (value) => (
      <h5 className="font-mono text-sm">
        {value !== undefined && value !== null
          ? String(value).padStart(2, "0")
          : "00"}
      </h5>
    ),
  },
  {
    id: "lastRun",
    header: "Last Run",
    accessorKey: "last_run_at",
    enableSorting: true,
    size: 190,
    align: "left",
    cell: (value) => (
      <h5 className="text-sm">{value ? formatRelativeTime(value) : "Never"}</h5>
    ),
  },
  {
    id: "updatedTime",
    header: "Updated Time",
    accessorKey: "updated_at",
    enableSorting: true,
    size: 350,
    align: "left",
    cell: (value) => (
      <h5 className="text-sm">{formatDate(value) || "Oct 24, 10:30 AM"}</h5>
    ),
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
    header: "",
    enableSorting: false,
    size: 320,
    align: "center",
    cell: (value, row) => <FlowCell row={row} />,
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    size: 300,
    align: "center",
    cell: (value, row) => <ActionsCell row={row} />,
  },
];
