import React, { useMemo } from "react";
import {
  DataTable,
  StatusBadge,
  ActionButtons,
  DataTableColumn,
} from "@/components/DataTable";
import { HiSignal, HiPaperClip, HiTrash, HiWifi } from "react-icons/hi2";
import { FinancialAgent } from "./type";
import { sampleAgents } from "./AgentsData";
import { columns } from "./AgentsColumn";

const Agents: React.FC = () => {
  const handleRowSelectionChange = (selectedRows: FinancialAgent[]) => {
    console.log("Selected rows:", selectedRows);
    // Handle row selection change
  };

  return (
    <div>
      <div className="rounded-lg overflow-hidden">
        <DataTable
          data={sampleAgents}
          columns={columns}
          enableRowSelection={true}
          enableSorting={true}
          enablePagination={false}
          onRowSelectionChange={handleRowSelectionChange}
          getRowId={(row) => row.id}
          emptyMessage="No agents found"
        />
      </div>
    </div>
  );
};

export default Agents;
