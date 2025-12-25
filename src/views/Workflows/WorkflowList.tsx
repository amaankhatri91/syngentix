import React from "react";
import { useParams } from "react-router-dom";
import { useGetWorkflowsQuery } from "@/services/RtkQueryService";
import { useAppSelector, useAppDispatch } from "@/store";
import { setWorkflowDialog } from "@/store/workflow/workflowSlice";
import WorkflowCard from "./WorkflowCard";
import WorkflowSkeleton from "./WorkflowSkeleton";
import useTheme from "@/utils/hooks/useTheme";

const WorkflowList: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const { token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { isDark } = useTheme();

  // RTK Query hook - automatically caches data and won't refetch on navigation
  // Only refetches on page refresh or when cache expires (1 hour)
  const { data, isLoading, error }: any = useGetWorkflowsQuery(agentId || "", {
    // Skip query if no token or no agentId
    skip: !token || !agentId,
  });

  const handleInfo = (id: string) => {
    console.log("Info clicked for workflow:", id);
  };

  const handleEdit = (id: string) => {
    // Find workflow from API data
    const workflow = data?.data?.find((w: any) => w.id === id);
    if (workflow) {
      dispatch(
        setWorkflowDialog({
          workflowDialog: true,
          workflowRow: workflow,
        })
      );
    }
  };

  const handleDownload = (id: string) => {
    console.log("Download clicked for workflow:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete clicked for workflow:", id);
  };

  // Show loading state
  if (isLoading) {
    return <WorkflowSkeleton count={3} />;
  }

  // Show error state
  if (error) {
    return (
      <div className={`text-center py-8 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
        <h3>Error loading workflows</h3>
      </div>
    );
  }

  // Show empty state
  if (!data?.data || data.data.length === 0) {
    return (
      <div className={`text-center py-8 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
        <h3>No data found</h3>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data?.data?.map((workflow: any) => (
        <WorkflowCard
          key={workflow.id}
          workflow={workflow}
          onInfo={handleInfo}
          onEdit={handleEdit}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default WorkflowList;
