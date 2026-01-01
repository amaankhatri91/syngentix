import React, { useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { Agent } from "./types";
import { columns } from "./AgentsColumn";
import { useGetAgentsQuery } from "@/services/RtkQueryService";
import { useAppSelector } from "@/store";

const AgentList: React.FC = () => {
  const { token, workspace } = useAppSelector((state) => state.auth);
  const { data, isLoading }: any = useGetAgentsQuery(workspace?.id, {
    skip: !token || !workspace?.id,
  });

  const handleRowSelectionChange = (selectedRows: Agent[]) => {
    console.log("Selected rows:", selectedRows);
    // Handle row selection change
  };

  return (
    <div className="rounded-lg overflow-hidden">
      <DataTable
        data={data?.data || []}
        columns={columns}
        enableRowSelection={false}
        enableSorting={true}
        enablePagination={false}
        onRowSelectionChange={handleRowSelectionChange}
        getRowId={(row) => row.id}
        emptyMessage="No agents found"
        loading={isLoading}
      />
    </div>
  );
};

export default AgentList;
