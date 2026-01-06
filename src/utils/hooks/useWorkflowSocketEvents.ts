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
import { Node } from "reactflow";
import { CustomNodeData } from "@/views/WorkflowEditor/type";

/**
 * Transform server note data to ReactFlow Node format
 * @param noteData - Note data from server
 * @returns ReactFlow Node with CustomNodeData
 */
const transformServerNoteToReactFlowNode = (
  noteData: any
): Node<CustomNodeData> => {
  return {
    id: noteData.id,
    type: "note", // Use "note" type for WorkflowNoteNode
    position: noteData.position || { x: 0, y: 0 },
    data: {
      label: noteData.content || noteData.title || "",
      nodeType: "text",
      dotColor: "#94A3B8", // Default gray
      borderColor: "from-gray-500 to-gray-600", // Default
    } as CustomNodeData,
  };
};

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
      console.log(data, "Verify Nodes Data & connections");

      // Collect all nodes (regular nodes + notes)
      const allNodes: Node<CustomNodeData>[] = [];
      // Transform and add regular nodes
      if (data?.nodes && Array.isArray(data.nodes)) {
        const transformedNodes = transformServerNodesToReactFlowNodes(
          data.nodes
        );
        allNodes.push(...transformedNodes);
      }
      // Transform and add notes
      if (data?.notes && Array.isArray(data.notes)) {
        const transformedNotes = data.notes.map((note: any) =>
          transformServerNoteToReactFlowNode(note)
        );
        allNodes.push(...transformedNotes);
        console.log("📝 Notes transformed and added:", transformedNotes.length);
      }

      // Set all nodes together (regular nodes + notes)
      if (allNodes.length > 0) {
        dispatch(setNodes(allNodes));
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

    // Handle note:created event - receives newly created sticky note
    const unsubscribeNoteCreated = on("note:created", (data: any) => {
      console.log("📝 note:created response:", data);
      if (data && data.data) {
        const noteNode = transformServerNoteToReactFlowNode(data.data);
        dispatch(addNode(noteNode));
        console.log("✅ Sticky note added to workflow:", noteNode.id);
      }
      // Show toast message based on status
      if (data?.status === "success") {
        toast.success(data?.message || "Note added successfully");
      } else {
        toast.error(data?.message || "Failed to add note");
      }
    });

    // Handle note:deleted event - receives deleted note confirmation
    const unsubscribeNoteDeleted = on("note:deleted", (data: any) => {
      console.log("🗑️ note:deleted response:", data);
      if (data && data.id) {
        // Remove the deleted note from Redux state
        const noteExists = nodesRef.current.some((node) => node.id === data.id);
        if (noteExists) {
          const updatedNodes = nodesRef.current.filter(
            (node) => node.id !== data.id
          );
          dispatch(updateNodes(updatedNodes));
          console.log("✅ Note removed from workflow:", data.id);
        }
      }
      // Show toast message based on status
      if (data?.status === "success") {
        toast.success(data?.message || "Note deleted successfully");
      } else {
        toast.error(data?.message || "Failed to delete note");
      }
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
      console.log("node deleted", data);

      // Show toast message first (always show, regardless of data structure)
      // Remove toastId to ensure toast always shows
      if (data?.status === "success") {
        toast.success(data?.message || "Nodes deleted successfully");
      } else if (data?.status === "error" || data?.status === "failed") {
        toast.error(data?.message || "Failed to delete nodes");
      } else {
        // If no status or unknown status, show success toast with message
        toast.success(data?.message || "Nodes deleted successfully");
      }

      // Handle node removal if ids are provided
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
      unsubscribeNoteCreated();
      unsubscribeNoteDeleted();
      unsubscribeConnectionCreated();
      unsubscribeConnectionDeleted();
      unsubscribeNodesDeletedBulk();
    };
  }, [on, dispatch]);
};
