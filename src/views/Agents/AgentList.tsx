import React, { useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { Agent } from "./types";
import { columns } from "./AgentsColumn";
import { useGetAgentsQuery } from "@/services/RtkQueryService";
import { useAppSelector } from "@/store";

const AgentList: React.FC = () => {
  const { token } = useAppSelector((state) => state.auth);

  // RTK Query hook - automatically caches data and won't refetch on navigation
  // Only refetches on page refresh or when cache expires (1 hour)
  const { data, isLoading, error, refetch }: any = useGetAgentsQuery(
    undefined,
    {
      // Skip query if no token (user not logged in)
      skip: !token,
    }
  );

  console.log(data, "Data Visiblitliyt");

  const handleRowSelectionChange = (selectedRows: Agent[]) => {
    console.log("Selected rows:", selectedRows);
    // Handle row selection change
  };

  return (
    <div className="rounded-lg overflow-hidden">
      <DataTable
        data={data?.data || []}
        columns={columns}
        enableRowSelection={true}
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
