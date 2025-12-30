import WorkflowEditorAction from "./WorkflowEditorAction";
import WorkflowEditorHeader from "./WorkflowEditorHeader";
import WorkflowCanvas from "./WorkflowCanvas";
import { useAppSelector } from "@/store";
import WorkflowNodesList from "./WorkflowNodesList";

const WorkflowEditor = () => {
  const { openNodeList } = useAppSelector((state) => state.workflowEditor);
  
  return (
    <>
      <WorkflowEditorAction />
      <WorkflowEditorHeader />
      <div className="flex flex-col h-[calc(100vh-174px)] overflow-hidden gap-8 lg:flex-row mt-4">
        <div className="lg:w-[100%] w-full">
          <WorkflowCanvas />
        </div>
        <div className="lg:w-[30%] w-full mt-4 lg:mt-0">
          <WorkflowNodesList />
        </div>
        {/* <div className="lg:w-[30%] w-full mt-4 lg:mt-0"> */}
        {/* <AvailableNodesList /> */}
        {/* <WorkflowEditorChat /> */}
        {/* </div> */}
      </div>
    </>
  );
};

export default WorkflowEditor;
