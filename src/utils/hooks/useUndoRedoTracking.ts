/**
 * Shared module for tracking undo/redo actions
 * Prevents socket echo events from creating duplicate history entries
 */

/**
 * Track undo/redo actions to prevent echo events from creating history
 * Key format: "eventType:identifier" (e.g., "node:created:node123")
 */
const undoRedoActionSignatures = new Set<string>();

/**
 * Create a signature for an undo/redo action to track it
 */
export const createActionSignature = (
  eventType: string,
  identifier: string | string[]
): string => {
  const ids = Array.isArray(identifier)
    ? [...identifier].sort().join(",")
    : identifier;
  return `${eventType}:${ids}`;
};

/**
 * Check if a socket event is from an undo/redo action
 */
export const isUndoRedoAction = (
  eventType: string,
  identifier: string | string[]
): boolean => {
  const signature = createActionSignature(eventType, identifier);
  return undoRedoActionSignatures.has(signature);
};

/**
 * Mark an action as undo/redo (called before emitting socket event)
 */
export const markAsUndoRedoAction = (
  eventType: string,
  identifier: string | string[]
): void => {
  const signature = createActionSignature(eventType, identifier);
  undoRedoActionSignatures.add(signature);
  setTimeout(() => {
    undoRedoActionSignatures.delete(signature);
  }, 5000);
};

