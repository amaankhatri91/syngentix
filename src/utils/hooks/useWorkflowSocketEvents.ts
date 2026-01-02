import { useEffect } from "react";
import { useSocketConnection } from "./useSocketConnection";
import { useAppDispatch } from "@/store";
import {
  setNodes,
  addNode,
  setEdges,
} from "@/store/workflowEditor/workflowEditorSlice";
import {
  transformServerNodesToReactFlowNodes,
  transformServerNodeToReactFlowNode,
} from "@/utils/common";
import { toast } from "react-toastify";

/**
 * Custom hook to handle workflow-related socket events
 * Manages workflow:data and node:created events
 */
export const useWorkflowSocketEvents = () => {
  const { on } = useSocketConnection();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Handle workflow:data event - receives full workflow state
    const unsubscribeWorkflowData = on("workflow:data", (data: any) => {
      console.log("📥 workflow:data received:", data);
      // Transform server nodes to ReactFlow nodes format
      if (data?.nodes && Array.isArray(data.nodes)) {
        const transformedNodes = transformServerNodesToReactFlowNodes(
          data.nodes
        );
        dispatch(setNodes(transformedNodes));
      }
      // Handle connections later (for now, just set empty array)
      if (data?.connections && Array.isArray(data.connections)) {
        // TODO: Transform connections to edges when needed
        // dispatch(setEdges(transformedEdges));
      }
    });

    // Handle node:created event - receives newly created node
    const unsubscribeNodeCreated = on("node:created", (data: any) => {
      console.log("✅ node:created response:", data);

      if (data) {
        // Transform the new node to ReactFlow format
        const newNode = transformServerNodeToReactFlowNode(data);

        // Add the new node to Redux state
        dispatch(addNode(newNode));

        toast.success("Node created successfully");
      }
    });

    // Cleanup: unsubscribe from all events
    return () => {
      unsubscribeWorkflowData();
      unsubscribeNodeCreated();
    };
  }, [on, dispatch]);
};

