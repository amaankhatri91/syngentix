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
  const { openNodeList, openSettings } = useAppSelector(
    (state) => state.workflowEditor
  );
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
      <div>
        <div className="flex flex-col h-[calc(100vh-174px)] overflow-hidden gap-8 lg:flex-row mt-4">
          {openNodeList && (
            <div className="w-[350px] min-w-0 flex-shrink-0">
              <WorkflowNodesList />
            </div>
          )}
          <div className="transition-all duration-300 flex-1 min-w-0">
            <WorkflowCanvas />
          </div>
          {openSettings && (
            <div className="w-[400px] min-w-0 flex-shrink-0">
              <WorkflowSettings />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WorkflowEditor;
