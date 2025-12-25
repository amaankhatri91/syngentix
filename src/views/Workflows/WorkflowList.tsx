import React from "react";
import { useParams } from "react-router-dom";
import { useGetWorkflowsQuery } from "@/services/RtkQueryService";
import { useAppSelector, useAppDispatch } from "@/store";
import { setWorkflowDialog } from "@/store/workflow/workflowSlice";
import WorkflowCard from "./WorkflowCard";
import { dummyWorkflows } from "./dummyData";

const WorkflowList: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const { token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // RTK Query hook - automatically caches data and won't refetch on navigation
  // Only refetches on page refresh or when cache expires (1 hour)
  const { data, isLoading, error }: any = useGetWorkflowsQuery(agentId || "", {
    // Skip query if no token or no agentId
    skip: !token || !agentId,
  });

  console.log(data, "Please Log the data over here anyhow");

  console.log(data, "Workflows Data");

  const handleInfo = (id: string) => {
    console.log("Info clicked for workflow:", id);
  };

  const handleEdit = (id: string) => {
    // Find workflow from dummy data (will be replaced with API data later)
    const workflow = dummyWorkflows.find((w) => w.id === id);
    if (workflow) {
      dispatch(
        setWorkflowDialog({
          workflowDialog: true,
          workflowRow: workflow,
        })
      );
    }
    // TODO: When using API data, find from data.data array
    // const workflow = data?.data?.find((w: any) => w.id === id);
  };

  const handleDownload = (id: string) => {
    console.log("Download clicked for workflow:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete clicked for workflow:", id);
  };

  // // Show loading state
  // if (isLoading) {
  //   return <div>Loading workflows...</div>;
  // }

  // // Show error state
  // if (error) {
  //   return <div>Error loading workflows</div>;
  // }

  // // Show empty state
  // if (!data?.data || data.data.length === 0) {
  //   return <div>No workflows found</div>;
  // }

  return (
    // <div className="space-y-3">
    //   {data?.data?.map((workflow: any) => (
    //     <WorkflowCard
    //       key={workflow.id}
    //       workflow={workflow}
    //       onInfo={handleInfo}
    //       onEdit={handleEdit}
    //       onDownload={handleDownload}
    //       onDelete={handleDelete}
    //     />
    //   ))}
    // </div>

    <div className="space-y-3">
      {dummyWorkflows?.map((workflow) => (
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
