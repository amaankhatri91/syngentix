import React from "react";
import WorkflowsAction from "./WorkflowsAction";
import WorkflowList from "./WorkflowList";
import WorkflowDialog from "./WorkflowDialog";
import WorkflowDeleteDialog from "./WorkflowDeleteDailog";
import WorkflowDuplicateDialog from "./WorkflowDuplicateDialog";

const Workflows: React.FC = () => {
  return (
    <>
      <WorkflowDialog />
      <WorkflowDeleteDialog />
      <WorkflowDuplicateDialog />
      <WorkflowsAction />
      <WorkflowList />
    </>
  );
};

export default Workflows;
