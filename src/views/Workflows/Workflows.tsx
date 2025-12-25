import React from "react";
import WorkflowsAction from "./WorkflowsAction";
import WorkflowList from "./WorkflowList";
import WorkflowDialog from "./WorkflowDialog";

const Workflows: React.FC = () => {
  return (
    <>
      <WorkflowDialog />
      <WorkflowsAction />
      <WorkflowList />
    </>
  );
};

export default Workflows;

