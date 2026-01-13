import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  undo as undoAction,
  redo as redoAction,
  selectCanUndo,
  selectCanRedo,
  selectUndoStack,
  selectRedoStack,
  HistoryEntry,
} from "@/store/workflowEditor/workflowEditorSlice";
import { useSocketConnection } from "./useSocketConnection";
import { useParams } from "react-router-dom";
import { markAsUndoRedoAction } from "./useUndoRedoTracking";

/**
 * Hook to handle undo/redo functionality
 * 
 * CRITICAL BEHAVIOR:
 * - Undo/Redo state updates IMMEDIATELY and SYNCHRONOUSLY
 * - Socket events are emitted AFTER state update (side effects)
 * - Socket echo events will NOT create new history entries (handled in useWorkflowSocketEvents)
 */
export const useUndoRedo = () => {
  const dispatch = useAppDispatch();
  const { emit } = useSocketConnection();
  const { workflowId } = useParams<{ workflowId: string }>();

  const canUndo = useAppSelector(selectCanUndo);
  const canRedo = useAppSelector(selectCanRedo);
  const undoStack = useAppSelector(selectUndoStack);
  const redoStack = useAppSelector(selectRedoStack);

  /**
   * Maps history action types to socket event names and payload builders
   */
  const executeHistoryAction = useCallback(
    (entry: HistoryEntry, isUndo: boolean) => {
      const { actionType, payload, inversePayload } = entry;
      const actionPayload = isUndo ? inversePayload : payload;

      switch (actionType) {
        case "NODE_CREATE":
          if (isUndo) {
            markAsUndoRedoAction("node:deleted", [payload.id]);
            emit("node:delete", {
              workflow_id: workflowId,
              id: payload.id,
            });
          } else {
            // Redo: Create the node
            markAsUndoRedoAction("node:created", payload.id);
            emit("node:create", {
              workflow_id: workflowId,
              ...payload,
            });
          }
          break;

        case "NODE_UPDATE":
          // For update, both undo and redo use node:update
          const nodeId = actionPayload.node_id || actionPayload.id;
          markAsUndoRedoAction("node:updated", nodeId);
          emit("node:update", {
            workflow_id: workflowId,
            node_id: nodeId,
            ...actionPayload,
          });
          break;

        case "NODE_DELETE":
          if (isUndo) {
            const nodeSnapshot = inversePayload.nodeSnapshot || inversePayload;
            markAsUndoRedoAction("node:created", nodeSnapshot?.id || inversePayload.id);
            emit("node:create", {
              workflow_id: workflowId,
              ...nodeSnapshot,
            });
          } else {
            markAsUndoRedoAction("node:deleted", [payload.id]);
            emit("node:delete", {
              workflow_id: workflowId,
              id: payload.id,
            });
          }
          break;

        case "NODE_DELETE_BULK":
          if (isUndo) {
            // Undo: Recreate all deleted nodes (inversePayload contains array of node snapshots)
            if (Array.isArray(inversePayload.nodes)) {
              inversePayload.nodes.forEach((node: any) => {
                markAsUndoRedoAction("node:created", node.id);
                emit("node:create", {
                  workflow_id: workflowId,
                  ...node,
                });
              });
            }
          } else {
            // Redo: Delete nodes again
            markAsUndoRedoAction("node:deleted", payload.ids);
            emit("node:delete_bulk", {
              workflow_id: workflowId,
              ids: payload.ids,
            });
          }
          break;

        case "NOTE_CREATE":
          if (isUndo) {
            // Undo: Delete the note
            markAsUndoRedoAction("note:deleted", payload.id);
            emit("note:delete", {
              workflow_id: workflowId,
              id: payload.id,
            });
          } else {
            // Redo: Create the note
            markAsUndoRedoAction("note:created", payload.id);
            emit("note:create", {
              workflow_id: workflowId,
              ...payload,
            });
          }
          break;

        case "NOTE_UPDATE":
          // For update, both undo and redo use note:update
          markAsUndoRedoAction("note:updated", actionPayload.id);
          emit("note:update", {
            workflow_id: workflowId,
            id: actionPayload.id,
            ...actionPayload,
          });
          break;

        case "NOTE_DELETE":
          if (isUndo) {
            // Undo: Recreate the note (inversePayload contains full note snapshot)
            const noteSnapshot = inversePayload.noteSnapshot || inversePayload;
            markAsUndoRedoAction("note:created", noteSnapshot?.id || inversePayload.id);
            emit("note:create", {
              workflow_id: workflowId,
              ...noteSnapshot,
            });
          } else {
            // Redo: Delete the note
            markAsUndoRedoAction("note:deleted", payload.id);
            emit("note:delete", {
              workflow_id: workflowId,
              id: payload.id,
            });
          }
          break;

        case "PIN_ADD":
          if (isUndo) {
            // Undo: Delete the pin
            markAsUndoRedoAction("pin:deleted", `${payload.node_id}:${payload.pin.id}`);
            emit("pin:delete", {
              workflow_id: workflowId,
              node_id: payload.node_id,
              pin_collection: payload.pin_collection,
              pin_id: payload.pin.id,
            });
          } else {
            // Redo: Add the pin
            markAsUndoRedoAction("pin:added", `${payload.node_id}:${payload.pin.id}`);
            emit("pin:add", {
              workflow_id: workflowId,
              node_id: payload.node_id,
              pin_collection: payload.pin_collection,
              pin: payload.pin,
            });
          }
          break;

        case "PIN_UPDATE":
          // For update, both undo and redo use pin:update
          markAsUndoRedoAction("pin:updated", `${actionPayload.node_id}:${actionPayload.pin.id}`);
          emit("pin:update", {
            workflow_id: workflowId,
            node_id: actionPayload.node_id,
            pin_collection: actionPayload.pin_collection,
            pin: actionPayload.pin,
          });
          break;

        case "PIN_DELETE":
          if (isUndo) {
            // Undo: Recreate the pin (inversePayload contains full pin snapshot)
            const pinSnapshot = inversePayload.pinSnapshot || inversePayload.pin;
            const pinId = pinSnapshot?.id || inversePayload.pin_id;
            markAsUndoRedoAction("pin:added", `${inversePayload.node_id}:${pinId}`);
            emit("pin:add", {
              workflow_id: workflowId,
              node_id: inversePayload.node_id,
              pin_collection: inversePayload.pin_collection,
              pin: pinSnapshot,
            });
          } else {
            // Redo: Delete the pin
            markAsUndoRedoAction("pin:deleted", `${payload.node_id}:${payload.pin_id}`);
            emit("pin:delete", {
              workflow_id: workflowId,
              node_id: payload.node_id,
              pin_collection: payload.pin_collection,
              pin_id: payload.pin_id,
            });
          }
          break;

        case "CONNECTION_CREATE":
          if (isUndo) {
            markAsUndoRedoAction("connection:deleted", payload.id);
            emit("connection:delete", {
              workflow_id: workflowId,
              id: payload.id,
            });
          } else {
            markAsUndoRedoAction("connection:created", payload.id);
            emit("connection:create", {
              workflow_id: workflowId,
              source: payload.source,
              target: payload.target,
              sourceHandle: payload.sourceHandle,
              targetHandle: payload.targetHandle,
            });
          }
          break;

        case "CONNECTION_DELETE":
          if (isUndo) {
            const connectionSignature = `${inversePayload.source}-${inversePayload.sourceHandle}-${inversePayload.target}-${inversePayload.targetHandle}`;
            markAsUndoRedoAction("connection:created", connectionSignature);
            emit("connection:create", {
              workflow_id: workflowId,
              source: inversePayload.source,
              target: inversePayload.target,
              sourceHandle: inversePayload.sourceHandle,
              targetHandle: inversePayload.targetHandle,
            });
          } else {
            markAsUndoRedoAction("connection:deleted", payload.id);
            emit("connection:delete", {
              workflow_id: workflowId,
              id: payload.id,
            });
          }
          break;
      }
    },
    [emit, workflowId]
  );

  /**
   * Handle undo action
   * 1. Update Redux state IMMEDIATELY (pop from undoStack, push to redoStack)
   * 2. Emit inverse socket event (side effect)
   */
  const handleUndo = useCallback(() => {
    if (!canUndo || undoStack.length === 0) {
      return;
    }

    const lastAction = undoStack[undoStack.length - 1];

    dispatch(undoAction());

    executeHistoryAction(lastAction, true);
  }, [canUndo, undoStack, dispatch, executeHistoryAction]);

  /**
   * Handle redo action
   * 1. Update Redux state IMMEDIATELY (pop from redoStack, push to undoStack)
   * 2. Emit original socket event (side effect)
   */
  const handleRedo = useCallback(() => {
    if (!canRedo || redoStack.length === 0) {
      return;
    }

    const lastAction = redoStack[redoStack.length - 1];

    dispatch(redoAction());

    executeHistoryAction(lastAction, false);
  }, [canRedo, redoStack, dispatch, executeHistoryAction]);

  return {
    canUndo,
    canRedo,
    handleUndo,
    handleRedo,
  };
};

