import WorkflowEditorAction from "./WorkflowEditorAction";
import WorkflowEditorChat from "./WorkflowEditorChat";
import WorkflowEditorHeader from "./WorkflowEditorHeader";
import WorkflowCanvas from "./WorkflowCanvas";

const WorkflowEditor = () => {
  return (
    <>
      <WorkflowEditorAction />
      <WorkflowEditorHeader />
      <div className="flex flex-col lg:flex-row mt-4">
        <div className="lg:w-[100%] w-full">
          <WorkflowCanvas />
        </div>
        {/* <div className="lg:w-[30%] w-full mt-4 lg:mt-0"> */}
          {/* <WorkFlowNodes /> */}
          {/* <WorkflowEditorChat /> */}
        {/* </div> */}
      </div>
    </>
  );
};

export default WorkflowEditor;
