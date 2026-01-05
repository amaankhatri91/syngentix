import { useEffect, useRef } from "react";
import { useSocketConnection } from "./useSocketConnection";
import { useAppDispatch } from "@/store";
import {
  setNodes,
  addNode,
  setEdges,
} from "@/store/workflowEditor/workflowEditorSlice";
import { useAppSelector } from "@/store";
import { addEdge } from "reactflow";
import {
  transformServerNodesToReactFlowNodes,
  transformServerNodeToReactFlowNode,
  transformServerConnectionsToReactFlowEdges,
  transformServerConnectionToReactFlowEdge,
} from "@/utils/common";
import { toast } from "react-toastify";

/**
 * Custom hook to handle workflow-related socket events
 * Manages workflow:data and node:created events
 */
export const useWorkflowSocketEvents = () => {
  const { on } = useSocketConnection();
  const dispatch = useAppDispatch();
  const { edges } = useAppSelector((state) => state.workflowEditor);
  const edgesRef = useRef(edges);

  // Keep edgesRef in sync with edges
  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  // We Can Set the connections
  useEffect(() => {
    const unsubscribeWorkflowData = on("workflow:data", (data: any) => {
      if (data?.nodes && Array.isArray(data.nodes)) {
        const transformedNodes = transformServerNodesToReactFlowNodes(
          data.nodes
        );
        dispatch(setNodes(transformedNodes));
      }
      if (data?.connections && Array.isArray(data.connections)) {
        const transformedEdges = transformServerConnectionsToReactFlowEdges(
          data.connections
        );
        dispatch(setEdges(transformedEdges));
        console.log("🔗 Connections transformed and set:", transformedEdges);
      }
    });

    // Handle node:created event - receives newly created node
    const unsubscribeNodeCreated = on("node:created", (data: any) => {
      dispatch(addNode(transformServerNodeToReactFlowNode(data?.data)));
      console.log(data, "Node Created Response");
      data?.status === "success"
        ? toast.success(data?.message || "Node created successfully")
        : toast.error(data?.message || "Failed to created node");
    });

    const unsubscribeConnectionCreated = on(
      "connection:created",
      (data: any) => {
        console.log("🔗 connection:created response:", data);
        if (data && data.data) {
          const newEdge = transformServerConnectionToReactFlowEdge(data.data);
          const updatedEdges = addEdge(newEdge, edgesRef.current);
          dispatch(setEdges(updatedEdges));
          if (data.status === "success") {
            toast.success(data.message || "Connection created successfully");
          } else {
            toast.error(data.message || "Failed to create connection");
          }
        }
      }
    );

    const unsubscribeConnectionDeleted = on(
      "connection:deleted",
      (data: any) => {
        if (data && data.id) {
          const edgeExists = edgesRef.current.some(
            (edge) => edge.id === data.id
          );
          if (edgeExists) {
            const updatedEdges = edgesRef.current.filter(
              (edge) => edge.id !== data.id
            );
            dispatch(setEdges(updatedEdges));
            console.log("✅ Connection removed from server:", data.id);
          }
          if (data.status === "success") {
            toast.success(data.message || "Connection deleted successfully");
          } else {
            toast.error(data.message || "Failed to delete connection");
          }
        }
      }
    );

    // Cleanup: unsubscribe from all events
    return () => {
      unsubscribeWorkflowData();
      unsubscribeNodeCreated();
      unsubscribeConnectionCreated();
      unsubscribeConnectionDeleted();
    };
  }, [on, dispatch]);
};
