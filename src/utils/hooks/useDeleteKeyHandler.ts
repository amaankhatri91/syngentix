import { useEffect } from "react";
import { Edge, Node } from "reactflow";
import { CustomNodeData } from "@/views/WorkflowEditor/type";

interface UseDeleteKeyHandlerOptions {
  edges?: Edge[];
  nodes?: Node<CustomNodeData>[];
  onDeleteEdge?: (edgeId: string, workflowId: string) => void;
  onDeleteNode?: (nodeId: string, workflowId: string) => void;
  workflowId?: string;
  enabled?: boolean;
}

/**
 * Custom hook to handle Delete key press for deleting selected edges or nodes
 * @param options - Configuration options for the delete handler
 * @param options.edges - Array of edges to check for selection
 * @param options.nodes - Array of nodes to check for selection
 * @param options.onDeleteEdge - Callback function to handle edge deletion
 * @param options.onDeleteNode - Callback function to handle node deletion
 * @param options.workflowId - Workflow ID required for deletion
 * @param options.enabled - Whether the hook is enabled (default: true)
 *
 * @example
 * ```tsx
 * useDeleteKeyHandler({
 *   edges,
 *   nodes,
 *   onDeleteEdge: (edgeId, workflowId) => {
 *     emit("connection:delete", { workflow_id: workflowId, id: edgeId });
 *   },
 *   onDeleteNode: (nodeId, workflowId) => {
 *     emit("node:delete", { workflow_id: workflowId, id: nodeId });
 *   },
 *   workflowId,
 * });
 * ```
 */
export const useDeleteKeyHandler = ({
  edges,
  nodes,
  onDeleteEdge,
  onDeleteNode,
  workflowId,
  enabled = true,
}: UseDeleteKeyHandlerOptions) => {
  useEffect(() => {
    if (!enabled || !workflowId) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle Delete key (not Backspace)
      if (event.key !== "Delete") return;

      // Check for selected edge first (edges take priority)
      if (edges && onDeleteEdge) {
        const selectedEdge = edges.find((edge) => edge.selected);
        if (selectedEdge) {
          event.preventDefault();
          event.stopPropagation();
          onDeleteEdge(selectedEdge.id, workflowId);
          return;
        }
      }

      // Check for selected node if no edge is selected
      if (nodes && onDeleteNode) {
        const selectedNode = nodes.find((node) => node.selected);
        if (selectedNode) {
          event.preventDefault();
          event.stopPropagation();
          onDeleteNode(selectedNode.id, workflowId);
          return;
        }
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [edges, nodes, onDeleteEdge, onDeleteNode, workflowId, enabled]);
};

export default useDeleteKeyHandler;

