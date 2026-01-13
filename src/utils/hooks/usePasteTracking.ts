/**
 * Shared module for tracking paste operations
 * Tracks node creation during paste and maps old IDs to new IDs
 */

import { Edge, Node } from "reactflow";
import { CustomNodeData } from "@/views/WorkflowEditor/type";

export interface PasteInfo {
  oldToNewIdMap: Map<string, string>;
  edgesToCreate: Edge[];
  originalNodeIds: string[];
  isCut: boolean;
  expectedNodeCount: number;
  createdNodeCount: number;
  nodePositions: Map<string, { x: number; y: number; type: string }>;
  connectionsCreated: boolean;
  workflowId: string; // Store workflowId for connection creation
  onComplete?: () => void; // Callback to show summary toast when paste completes
}

/**
 * Store pending paste operation
 */
let pendingPasteInfo: PasteInfo | null = null;

/**
 * Set pending paste operation info
 */
export const setPendingPasteInfo = (info: PasteInfo | null): void => {
  pendingPasteInfo = info;
  console.log("📋 [PASTE TRACKING] Set pending paste info:", {
    expectedNodeCount: info?.expectedNodeCount,
    edgesToCreate: info?.edgesToCreate.length,
  });
};

/**
 * Get pending paste operation info
 */
export const getPendingPasteInfo = (): PasteInfo | null => {
  return pendingPasteInfo;
};

/**
 * Check if a node creation is part of a paste operation
 */
export const isPasteOperation = (): boolean => {
  return pendingPasteInfo !== null;
};

/**
 * Check if a connection creation is part of a paste operation
 */
export const isConnectionPartOfPaste = (sourceId: string, targetId: string): boolean => {
  if (!pendingPasteInfo) return false;
  
  // Check if both source and target are in the oldToNewIdMap (meaning they're part of paste)
  const sourceIsPaste = Array.from(pendingPasteInfo.oldToNewIdMap.values()).includes(sourceId);
  const targetIsPaste = Array.from(pendingPasteInfo.oldToNewIdMap.values()).includes(targetId);
  
  return sourceIsPaste && targetIsPaste;
};

/**
 * Try to match a created node to a pending paste operation
 * Returns the old node ID if matched, null otherwise
 */
export const matchNodeToPaste = (
  newNode: Node<CustomNodeData>,
  nodeData: any
): string | null => {
  if (!pendingPasteInfo) return null;

  // Try to match by position and type
  for (const [oldNodeId, expectedPos] of pendingPasteInfo.nodePositions.entries()) {
    const tolerance = 10;
    const positionMatch =
      Math.abs(newNode.position.x - expectedPos.x) < tolerance &&
      Math.abs(newNode.position.y - expectedPos.y) < tolerance;
    const typeMatch = newNode.type === expectedPos.type || nodeData?.type === expectedPos.type;

    if (positionMatch && typeMatch) {
      // Check if this node hasn't been matched yet
      if (!pendingPasteInfo.oldToNewIdMap.has(oldNodeId)) {
        pendingPasteInfo.oldToNewIdMap.set(oldNodeId, newNode.id);
        pendingPasteInfo.createdNodeCount++;
        console.log("✅ [PASTE TRACKING] Matched node:", {
          oldId: oldNodeId,
          newId: newNode.id,
          createdCount: pendingPasteInfo.createdNodeCount,
          expectedCount: pendingPasteInfo.expectedNodeCount,
        });
        return oldNodeId;
      }
    }
  }

  return null;
};

/**
 * Check if all nodes are created and create connections if ready
 */
export const checkAndCreateConnections = (
  emit: (event: string, payload: any) => void
): void => {
  if (!pendingPasteInfo) return;

  const { createdNodeCount, expectedNodeCount, edgesToCreate, connectionsCreated, oldToNewIdMap, workflowId } =
    pendingPasteInfo;

  // Check if all nodes are created
  if (
    createdNodeCount >= expectedNodeCount &&
    edgesToCreate.length > 0 &&
    !connectionsCreated &&
    oldToNewIdMap.size === expectedNodeCount
  ) {
    // Mark as created to prevent duplicates
    pendingPasteInfo.connectionsCreated = true;

    console.log("🔗 [PASTE TRACKING] Creating connections:", {
      edgesToCreate: edgesToCreate.length,
      oldToNewMap: Array.from(oldToNewIdMap.entries()),
    });

    // Create connections
    edgesToCreate.forEach((edge, index) => {
      const newSourceId = oldToNewIdMap.get(edge.source);
      const newTargetId = oldToNewIdMap.get(edge.target);

      if (newSourceId && newTargetId) {
        setTimeout(() => {
          console.log("🔗 [PASTE TRACKING] Creating connection:", {
            oldSource: edge.source,
            oldTarget: edge.target,
            newSource: newSourceId,
            newTarget: newTargetId,
          });
          emit("connection:create", {
            workflow_id: workflowId,
            source: newSourceId,
            target: newTargetId,
            sourceHandle: edge.sourceHandle || "",
            targetHandle: edge.targetHandle || "",
          });
        }, index * 100); // Stagger connection creation
      } else {
        console.warn("⚠️ [PASTE TRACKING] Could not map connection:", {
          edge,
          newSourceId,
          newTargetId,
        });
      }
    });

    // Clear paste info after connections are created and show summary toast
    setTimeout(() => {
      // Show summary toast if callback is provided
      if (pendingPasteInfo && pendingPasteInfo.onComplete) {
        pendingPasteInfo.onComplete();
      }
      setPendingPasteInfo(null);
      console.log("✅ [PASTE TRACKING] Paste operation completed");
    }, edgesToCreate.length * 100 + 500);
  }
};

