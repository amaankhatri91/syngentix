import WorkflowEditorAction from "./WorkflowEditorAction";
import WorkflowEditorHeader from "./WorkflowEditorHeader";
import WorkflowCanvas from "./WorkflowCanvas";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  setDatabaseDialogOpen,
  setSelectedNode,
} from "@/store/workflowEditor/workflowEditorSlice";
import WorkflowNodesList from "./WorkflowNodesList";
import WorkflowSettings from "./WorkflowSettings";
import { useSocketConnection } from "@/utils/hooks/useSocketConnection";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import DatabaseNodeDialog from "./DatabaseNodeDialog";
import { useGetNodesQuery } from "@/services/RtkQueryService";

const WorkflowEditor = () => {
  const { openNodeList, openSettings, databaseDialogOpen, selectedNode } =
    useAppSelector((state) => state.workflowEditor);

  const dispatch = useAppDispatch();
  const { workflowId } = useParams<{ workflowId: string }>();
  const { emit } = useSocketConnection();
  const { data, isLoading, error } = useGetNodesQuery();

  const handleCloseDatabaseDialog = () => {
    dispatch(setDatabaseDialogOpen(false));
    dispatch(setSelectedNode(null));
  };

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
      <DatabaseNodeDialog
        open={databaseDialogOpen}
        handler={handleCloseDatabaseDialog}
        nodesData={data}
        nodesLoading={isLoading}
        nodesError={error}
        selectedNode={selectedNode}
        workflowId={workflowId}
      />
      <div>
        <div className="flex flex-col h-[calc(100vh-174px)] overflow-hidden gap-8 lg:flex-row mt-4">
          {openNodeList && (
            <div className="w-[350px] min-w-0 flex-shrink-0">
              <WorkflowNodesList
                nodesData={data}
                nodesLoading={isLoading}
                nodesError={error}
              />
            </div>
          )}
          <div className="transition-all duration-300 flex-1 min-w-0">
            <WorkflowCanvas nodesData={data} />
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
