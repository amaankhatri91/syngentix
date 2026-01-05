import { useEffect } from "react";
import { Edge, Node } from "reactflow";
import { CustomNodeData } from "@/views/WorkflowEditor/type";

interface UseDeleteKeyHandlerOptions {
  edges?: Edge[];
  nodes?: Node<CustomNodeData>[];
  onDeleteEdge?: (edgeId: string, workflowId: string) => void;
  onDeleteNode?: (nodeIds: string[], workflowId: string) => void;
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
 *   onDeleteNode: (nodeIds, workflowId) => {
 *     emit("node:delete_bulk", { workflow_id: workflowId, ids: nodeIds });
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

      // Check for selected nodes if no edge is selected
      if (nodes && onDeleteNode) {
        const selectedNodes = nodes.filter((node) => node.selected);
        if (selectedNodes.length > 0) {
          event.preventDefault();
          event.stopPropagation();
          const selectedNodeIds = selectedNodes.map((node) => node.id);
          onDeleteNode(selectedNodeIds, workflowId);
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
