import React from "react";
import WorkflowsAction from "./WorkflowsAction";
import WorkflowList from "./WorkflowList";
import WorkflowDialog from "./WorkflowDialog";
import WorkflowDeleteDialog from "./WorkflowDeleteDailog";

const Workflows: React.FC = () => {
  return (
    <>
      <WorkflowDialog />
      <WorkflowDeleteDialog />
      <WorkflowsAction />
      <WorkflowList />
    </>
  );
};

export default Workflows;
