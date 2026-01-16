/**
 * Shared module for tracking connection deletions
 * Captures connection snapshots before optimistic updates
 */

import { Edge } from "reactflow";

/**
 * Store pending connection deletions (captured before optimistic update)
 * Key: connectionId, Value: connection snapshot
 */
const pendingConnectionDeletions = new Map<string, Edge>();

/**
 * Store a connection snapshot before it's deleted optimistically
 * This allows the socket handler to access it later for history recording
 */
export const storeConnectionSnapshot = (connectionId: string, edge: Edge): void => {
  pendingConnectionDeletions.set(connectionId, edge);
  console.log("📸 [TRACKING] Stored connection snapshot:", {
    connectionId,
    edge: {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
    },
  });
  
  // Auto-remove after 10 seconds to prevent memory leaks
  setTimeout(() => {
    pendingConnectionDeletions.delete(connectionId);
    console.log("🗑️ [TRACKING] Auto-removed connection snapshot:", connectionId);
  }, 10000);
};

/**
 * Retrieve a connection snapshot for a deleted connection
 * Returns undefined if not found
 */
export const getConnectionSnapshot = (connectionId: string): Edge | undefined => {
  const snapshot = pendingConnectionDeletions.get(connectionId);
  if (snapshot) {
    console.log("📸 [TRACKING] Retrieved connection snapshot:", {
      connectionId,
      found: true,
    });
    // Remove after retrieval
    pendingConnectionDeletions.delete(connectionId);
  } else {
    console.log("📸 [TRACKING] Connection snapshot not found:", {
      connectionId,
      availableIds: Array.from(pendingConnectionDeletions.keys()),
    });
  }
  return snapshot;
};


