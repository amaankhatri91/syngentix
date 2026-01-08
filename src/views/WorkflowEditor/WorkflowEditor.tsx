import WorkflowEditorAction from "./WorkflowEditorAction";
import WorkflowEditorHeader from "./WorkflowEditorHeader";
import WorkflowCanvas from "./WorkflowCanvas";
import { useAppSelector } from "@/store";
import WorkflowNodesList from "./WorkflowNodesList";
import WorkflowSettings from "./WorkflowSettings";
import { useSocketConnection } from "@/utils/hooks/useSocketConnection";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const WorkflowEditor = () => {
  const { openNodeList } = useAppSelector((state) => state.workflowEditor);
  const { workflowId } = useParams<{ workflowId: string }>();
  const { emit } = useSocketConnection();

  // Room Joining And Socket Connection
  useEffect(() => {
    if (!workflowId) return;
    console.log(workflowId, "Verify workflowId");
    emit("workflow:join", {
      workflow_id: workflowId,
    });
    return () => {
      emit("workflow:leave", {
        workflow_id: workflowId,
      });
    };
  }, [workflowId, emit]);

  return (
    <>
      <WorkflowEditorAction />
      <WorkflowEditorHeader />
      <div className="flex flex-col h-[calc(100vh-174px)] overflow-hidden gap-8 lg:flex-row mt-4">
        {openNodeList && (
          <div className="lg:w-[30%] w-full mt-4 lg:mt-0">
            <WorkflowNodesList />
          </div>
        )}
        <div className="transition-all duration-300 w-[100%]">
          <WorkflowCanvas />
        </div>
        <div className="w-[40%]">
          <WorkflowSettings />
        </div>
      </div>
    </>
  );
};

export default WorkflowEditor;
