import { useEffect, useRef } from "react";
import { useSocketConnection } from "./useSocketConnection";
import { useAppDispatch } from "@/store";
import {
  setNodes,
  addNode,
  setEdges,
  updateNodes,
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
  const { edges, nodes } = useAppSelector((state) => state.workflowEditor);
  const edgesRef = useRef(edges);
  const nodesRef = useRef(nodes);

  // Keep edgesRef in sync with edges
  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  // Keep nodesRef in sync with nodes
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  // Track processed bulk deletions to prevent duplicate toasts
  const processedDeletionsRef = useRef<Set<string>>(new Set());

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

    // Handle node:deleted_bulk event - receives bulk deleted nodes response
    const unsubscribeNodesDeletedBulk = on("node:deleted_bulk", (data: any) => {
      console.log("🗑️ node:deleted_bulk response:", data);

      if (data && data.ids && Array.isArray(data.ids)) {
        // Create a unique key from sorted node IDs to track this deletion
        const deletionKey = data.ids.sort().join(",");

        // Check if we've already processed this deletion
        if (processedDeletionsRef.current.has(deletionKey)) {
          console.log(
            "⚠️ Duplicate node:deleted_bulk event ignored:",
            deletionKey
          );
          return;
        }

        // Mark this deletion as processed
        processedDeletionsRef.current.add(deletionKey);

        // Remove the deleted nodes from Redux state
        const updatedNodes = nodesRef.current.filter(
          (node) => !data.ids.includes(node.id)
        );
        dispatch(updateNodes(updatedNodes));
        console.log("✅ Nodes removed from server:", data.ids);

        // Show toast with server message (only once)
        // Use a unique toastId to prevent duplicate toasts
        const toastId = `node-deleted-bulk-${deletionKey}`;
        if (data.status === "success") {
          toast.success(data.message || "Nodes deleted successfully", {
            toastId,
          });
        } else {
          toast.error(data.message || "Failed to delete nodes", {
            toastId,
          });
        }

        // Clean up the processed key after a delay to allow for retries if needed
        setTimeout(() => {
          processedDeletionsRef.current.delete(deletionKey);
        }, 5000);
      }
    });

    // Cleanup: unsubscribe from all events
    return () => {
      unsubscribeWorkflowData();
      unsubscribeNodeCreated();
      unsubscribeConnectionCreated();
      unsubscribeConnectionDeleted();
      unsubscribeNodesDeletedBulk();
    };
  }, [on, dispatch]);
};
