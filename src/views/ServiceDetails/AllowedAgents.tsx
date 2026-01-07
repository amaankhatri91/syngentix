import React, { useMemo } from "react";
import useTheme from "@/utils/hooks/useTheme";
import {
  DataTable,
  StatusBadge,
  DataTableColumn,
} from "@/components/DataTable";
import DeleteIcon from "@/assets/app-icons/DeleteIcon";

interface AllowedAgent {
  id: string;
  name: string;
  status: "active" | "offline";
}

interface AllowedAgentsProps {
  onRemoveAgent?: (agentId: string) => void;
}

const AllowedAgents: React.FC<AllowedAgentsProps> = ({ onRemoveAgent }) => {
  const { isDark } = useTheme();

  const agentsData = useMemo<AllowedAgent[]>(
    () => [
      {
        id: "1",
        name: "Financial Agent",
        status: "active",
      },
      {
        id: "2",
        name: "Financial Agent",
        status: "offline",
      },
    ],
    []
  );

  const columns = useMemo<DataTableColumn<AllowedAgent>[]>(
    () => [
      {
        id: "name",
        header: "Name",
        accessorKey: "name",
        enableSorting: true,
        align: "left",
        cell: (value) => (
          <span
            className={`text-sm font-medium ${
              isDark ? "text-white" : "text-[#162230]"
            }`}
          >
            {value as string}
          </span>
        ),
      },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        enableSorting: true,
        align: "right",
        cell: (_value, row) => (
          <div className="flex justify-end w-full pr-2">
            <StatusBadge
              status={{
                label: row.status === "active" ? "Active" : "Offline",
                variant: row.status,
              }}
            />
          </div>
        ),
      },
      {
        id: "action",
        header: "Action",
        enableSorting: false,
        align: "right",
        cell: (_value, row) => (
          <div className="flex justify-end w-full pr-2">
            <button
              onClick={() => onRemoveAgent?.(row.id)}
              className="p-1 rounded hover:opacity-80 transition-opacity"
              aria-label="Delete"
            >
              <DeleteIcon color="#F54960" height={18} />
            </button>
          </div>
        ),
      }
      
    ],
    [isDark, onRemoveAgent]
  );

  return (
    <>
      <h2
        className={`text-xl font-semibold mb-6 ${
          isDark ? "text-white" : "text-[#162230]"
        }`}
      >
        Allowed Agents
      </h2>

      <DataTable
        data={agentsData}
        columns={columns}
        enableSorting={true}
        getRowId={(row) => row.id}
        emptyMessage="No agents found"
      />
    </>
  );
};

export default AllowedAgents;
