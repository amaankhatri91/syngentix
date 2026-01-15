import { useEffect, useRef } from "react";
import { useSocketConnection } from "./useSocketConnection";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setNodes,
  addNode,
  setEdges,
  updateNodes,
  setNodeList,
  setSelectedNode,
  pushHistoryAction,
  clearHistory,
  updateLastRedoStackEntry,
  HistoryEntry,
  HistoryActionType,
} from "@/store/workflowEditor/workflowEditorSlice";
import { addEdge, Node, Edge } from "reactflow";
import {
  transformServerNodesToReactFlowNodes,
  transformServerNodeToReactFlowNode,
  transformServerConnectionsToReactFlowEdges,
  transformServerConnectionToReactFlowEdge,
} from "@/utils/common";
import { toast } from "react-toastify";
import { CustomNodeData } from "@/views/WorkflowEditor/type";
import { isUndoRedoAction } from "./useUndoRedoTracking";
import { getConnectionSnapshot } from "./useConnectionDeletionTracking";
import {
  matchNodeToPaste,
  checkAndCreateConnections,
  isPasteOperation,
  isConnectionPartOfPaste,
} from "./usePasteTracking";

const transformServerNoteToReactFlowNode = (
  noteData: any
): Node<CustomNodeData> => {
  console.log("🔄 [TRANSFORM NOTE] Transforming server note data:", {
    id: noteData.id,
    label: noteData.label,
    width: noteData.width,
    height: noteData.height,
    fullData: noteData,
  });

  const transformed = {
    id: noteData.id,
    type: "note",
    position: noteData.position || { x: 0, y: 0 },
    data: {
      label: noteData.label || noteData.content || noteData.title || "",
      nodeType: "text",
      dotColor: "#94A3B8",
      borderColor: "from-gray-500 to-gray-600",
      width: noteData.width,
      height: noteData.height,
    } as CustomNodeData,
  };

  console.log("✅ [TRANSFORM NOTE] Transformed node data:", {
    id: transformed.id,
    data: transformed.data,
  });

  return transformed;
};

export const useWorkflowSocketEvents = () => {
  const { on, emit } = useSocketConnection();
  const dispatch = useAppDispatch();

  const { edges, nodes, nodeList, selectedNode, redoStack } = useAppSelector(
    (state) => state.workflowEditor
  );

  const edgesRef = useRef(edges);
  const nodesRef = useRef(nodes);
  const nodeListRef = useRef(nodeList);
  const selectedNodeRef = useRef(selectedNode);
  const redoStackRef = useRef(redoStack);

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    nodeListRef.current = nodeList;
  }, [nodeList]);

  useEffect(() => {
    selectedNodeRef.current = selectedNode;
  }, [selectedNode]);

  useEffect(() => {
    redoStackRef.current = redoStack;
  }, [redoStack]);

  const syncReactFlowNodesFromNodeList = (updatedNodeList: any[]) => {
    const rfNodes = transformServerNodesToReactFlowNodes(updatedNodeList);
    const notes = nodesRef.current.filter((node) => node.type === "note");
    dispatch(setNodes([...rfNodes, ...notes]));
  };

  const syncSelectedNodeIfNeeded = (updatedNodeList: any[], nodeId: string) => {
    if (selectedNodeRef.current?.id === nodeId) {
      const updated = updatedNodeList.find((n) => n.id === nodeId);
      if (updated) {
        dispatch(setSelectedNode(updated));
      }
    }
  };

  const processedDeletionsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const unsubscribeWorkflowData = on("workflow:data", (data: any) => {
      console.log("📥 [WORKFLOW DATA] Initial load data received:", {
        nodesCount: data?.nodes?.length || 0,
        notesCount: data?.notes?.length || 0,
        notes: data?.notes,
      });

      const allNodes: Node<CustomNodeData>[] = [];

      if (Array.isArray(data?.nodes)) {
        allNodes.push(...transformServerNodesToReactFlowNodes(data.nodes));
        dispatch(setNodeList(data.nodes));
      }

      if (Array.isArray(data?.notes)) {
        console.log("📝 [WORKFLOW DATA] Processing notes:", data.notes);
        const transformedNotes = data.notes.map(
          transformServerNoteToReactFlowNode
        );
        console.log("✅ [WORKFLOW DATA] Transformed notes:", transformedNotes);
        allNodes.push(...transformedNotes);
      }

      if (allNodes.length) {
        dispatch(setNodes(allNodes));
      }

      if (Array.isArray(data?.connections)) {
        dispatch(
          setEdges(transformServerConnectionsToReactFlowEdges(data.connections))
        );
      }

      dispatch(clearHistory());
    });

    const unsubscribeNodeCreated = on("node:created", (data: any) => {
      if (data?.status === "success" && data?.data) {
        const nodeId = data.data.id;
        const status = data?.status;
        const isUndoRedo = isUndoRedoAction("node:created", nodeId);

        console.log("🔍 [SOCKET] node:created received:", {
          nodeId,
          isUndoRedo,
          redoStackLength: redoStackRef.current.length,
          lastRedoEntry:
            redoStackRef.current.length > 0
              ? redoStackRef.current[redoStackRef.current.length - 1]
              : null,
        });

        const updatedNodeList = nodeListRef.current
          ? [...nodeListRef.current, data.data]
          : [data.data];

        dispatch(setNodeList(updatedNodeList));
        const reactFlowNode = transformServerNodeToReactFlowNode(data.data);
        dispatch(addNode(reactFlowNode));

        // Check if this node is part of a paste operation
        const matchedOldId = matchNodeToPaste(reactFlowNode, data.data);
        const isPaste = matchedOldId !== null || isPasteOperation();

        if (matchedOldId) {
          // Check and create connections if all nodes are created
          checkAndCreateConnections(emit);
        }

        if (
          isUndoRedo &&
          data?.status === "success" &&
          redoStackRef.current.length > 0
        ) {
          const lastRedoEntry =
            redoStackRef.current[redoStackRef.current.length - 1];
          console.log(
            "🔍 [SOCKET] Checking if we need to update redoStack for node:",
            {
              lastRedoEntryActionType: lastRedoEntry.actionType,
              isNodeDelete: lastRedoEntry.actionType === "NODE_DELETE",
              isNodeDeleteBulk: lastRedoEntry.actionType === "NODE_DELETE_BULK",
              oldId:
                lastRedoEntry.actionType === "NODE_DELETE"
                  ? lastRedoEntry.payload.id
                  : null,
              newId: nodeId,
            }
          );

          if (lastRedoEntry.actionType === "NODE_DELETE") {
            console.log(
              "🔄 [SOCKET] Updating redoStack entry with new node ID:",
              {
                oldId: lastRedoEntry.payload.id,
                newId: nodeId,
                fullEntry: lastRedoEntry,
              }
            );
            dispatch(
              updateLastRedoStackEntry({
                payload: {
                  id: nodeId,
                },
              })
            );
            console.log(
              "✅ [SOCKET] RedoStack entry updated successfully for NODE_DELETE"
            );
          } else if (lastRedoEntry.actionType === "NODE_DELETE_BULK") {
            const oldIds = lastRedoEntry.payload.ids || [];
            const nodeSnapshots = lastRedoEntry.inversePayload.nodes || [];

            const nodeIndex = nodeSnapshots.findIndex(
              (node: any) =>
                node.position?.x === data.data.position?.x &&
                node.position?.y === data.data.position?.y &&
                node.type === data.data.type
            );

            if (nodeIndex >= 0 && nodeIndex < oldIds.length) {
              const oldId = oldIds[nodeIndex];
              const updatedIds = [...oldIds];
              updatedIds[nodeIndex] = nodeId;

              console.log(
                "🔄 [SOCKET] Updating redoStack entry for NODE_DELETE_BULK:",
                {
                  nodeIndex,
                  oldId,
                  newId: nodeId,
                  oldIds,
                  updatedIds,
                }
              );

              dispatch(
                updateLastRedoStackEntry({
                  payload: {
                    ids: updatedIds,
                  },
                })
              );
              console.log(
                "✅ [SOCKET] RedoStack entry updated successfully for NODE_DELETE_BULK"
              );
            }
          }
        } else if (!isUndoRedo) {
          const historyEntry: HistoryEntry = {
            actionType: "NODE_CREATE",
            payload: {
              id: nodeId,
              ...data.data,
            },
            inversePayload: {
              id: nodeId,
            },
          };
          dispatch(pushHistoryAction(historyEntry));
        }

        // Suppress toast if this is part of a paste operation (summary toast will be shown instead)
        if (!isPaste) {
          toast.success(data.message || "Node created successfully");
        }
      } else {
        // Only show error toast if not part of paste (paste errors will be handled separately)
        if (!isPasteOperation()) {
          toast.error(data?.message || "Failed to create node");
        }
      }
    });

    const unsubscribeNodeUpdated = on("node:updated", (data: any) => {
      if (data?.status === "success" && data?.data) {
        const nodeId = data.data.id;
        const isUndoRedo = isUndoRedoAction("node:updated", nodeId);

        const oldNodeSnapshot = nodeListRef.current.find(
          (n: any) => n.id === nodeId
        );

        const updatedNodeList = nodeListRef.current.map((node: any) =>
          node.id === nodeId ? { ...node, ...data.data } : node
        );

        dispatch(setNodeList(updatedNodeList));
        syncReactFlowNodesFromNodeList(updatedNodeList);
        syncSelectedNodeIfNeeded(updatedNodeList, nodeId);

        if (!isUndoRedo && oldNodeSnapshot) {
          const historyEntry: HistoryEntry = {
            actionType: "NODE_UPDATE",
            payload: {
              id: nodeId,
              node_id: nodeId,
              ...data.data,
            },
            inversePayload: {
              id: nodeId,
              node_id: nodeId,
              ...oldNodeSnapshot,
            },
          };
          dispatch(pushHistoryAction(historyEntry));
        }

        toast.success(data?.message || "Node updated successfully");
      } else {
        toast.error(data?.message || "Failed to update node");
      }
    });

    const unsubscribeNoteCreated = on("note:created", (data: any) => {
      if (data?.data) {
        const noteId = data.data.id;
        const isUndoRedo = isUndoRedoAction("note:created", noteId);

        dispatch(addNode(transformServerNoteToReactFlowNode(data.data)));

        if (!isUndoRedo && data?.status === "success") {
          const historyEntry: HistoryEntry = {
            actionType: "NOTE_CREATE",
            payload: {
              id: noteId,
              ...data.data,
            },
            inversePayload: {
              id: noteId,
              noteSnapshot: data.data,
            },
          };
          dispatch(pushHistoryAction(historyEntry));
        }
      }

      data?.status === "success"
        ? toast.success(data?.message || "Note added successfully")
        : toast.error(data?.message || "Failed to add note");
    });

    const unsubscribeNoteDeleted = on("note:deleted", (data: any) => {
      if (data?.id) {
        const noteId = data.id;
        const isUndoRedo = isUndoRedoAction("note:deleted", noteId);

        const noteSnapshot = nodesRef.current.find(
          (node) => node.id === noteId
        );

        dispatch(
          updateNodes(nodesRef.current.filter((node) => node.id !== data.id))
        );

        if (!isUndoRedo && data?.status === "success" && noteSnapshot) {
          const serverNoteData = {
            id: noteSnapshot.id,
            position: noteSnapshot.position,
            label: noteSnapshot.data?.label || "",
            content: noteSnapshot.data?.label || "",
            title: noteSnapshot.data?.label || "",
          };

          const historyEntry: HistoryEntry = {
            actionType: "NOTE_DELETE",
            payload: {
              id: noteId,
            },
            inversePayload: {
              id: noteId,
              noteSnapshot: serverNoteData,
            },
          };
          dispatch(pushHistoryAction(historyEntry));
        }
      }

      data?.status === "success"
        ? toast.success(data?.message || "Note deleted successfully")
        : toast.error(data?.message || "Failed to delete note");
    });

    const unsubscribeNoteUpdated = on("note:updated", (data: any) => {
      console.log(data, "Verify note Data");
      if (data?.data) {
        const noteId = data.data.id;
        const isUndoRedo = isUndoRedoAction("note:updated", noteId);

        const oldNoteSnapshot = nodesRef.current.find((n) => n.id === noteId);

        const updatedNote = transformServerNoteToReactFlowNode(data.data);

        const exists = nodesRef.current.some((n) => n.id === updatedNote.id);

        dispatch(
          exists
            ? updateNodes(
                nodesRef.current.map((n) => {
                  if (n.id === updatedNote.id) {
                    // Merge existing data with updated data to preserve any local state
                    return {
                      ...updatedNote,
                      data: {
                        ...n.data,
                        ...updatedNote.data,
                        // Ensure width and height are updated from server
                        width: updatedNote.data.width ?? n.data.width,
                        height: updatedNote.data.height ?? n.data.height,
                      },
                    };
                  }
                  return n;
                })
              )
            : addNode(updatedNote)
        );

        if (!isUndoRedo && data?.status === "success" && oldNoteSnapshot) {
          const oldServerNoteData = {
            id: oldNoteSnapshot.id,
            position: oldNoteSnapshot.position,
            label: oldNoteSnapshot.data?.label || "",
            content: oldNoteSnapshot.data?.label || "",
            title: oldNoteSnapshot.data?.label || "",
            width: oldNoteSnapshot.data?.width,
            height: oldNoteSnapshot.data?.height,
          };

          const historyEntry: HistoryEntry = {
            actionType: "NOTE_UPDATE",
            payload: {
              id: noteId,
              ...data.data,
            },
            inversePayload: {
              ...oldServerNoteData,
            },
          };
          dispatch(pushHistoryAction(historyEntry));
        }
      }

      data?.status === "success"
        ? toast.success(data?.message || "Note updated successfully")
        : toast.error(data?.message || "Failed to update note");
    });

    const unsubscribeConnectionCreated = on(
      "connection:created",
      (data: any) => {
        const connectionData = data?.data || data;
        const connectionId = connectionData?.id;
        const status = data?.status || data?.data?.status;
        const message = data?.message || data?.data?.message;

        if (!connectionData || !connectionId) {
          return;
        }

        const connectionSignature = `${connectionData.source}-${connectionData.sourceHandle}-${connectionData.target}-${connectionData.targetHandle}`;
        const isUndoRedoById = isUndoRedoAction(
          "connection:created",
          connectionId
        );
        const isUndoRedoBySignature = isUndoRedoAction(
          "connection:created",
          connectionSignature
        );
        const isUndoRedo = isUndoRedoById || isUndoRedoBySignature;

        console.log("🔍 [SOCKET] connection:created received:", {
          connectionId,
          connectionSignature,
          isUndoRedoById,
          isUndoRedoBySignature,
          isUndoRedo,
          redoStackLength: redoStackRef.current.length,
          lastRedoEntry:
            redoStackRef.current.length > 0
              ? redoStackRef.current[redoStackRef.current.length - 1]
              : null,
        });

        const newEdge =
          transformServerConnectionToReactFlowEdge(connectionData);

        const existingEdgeIndex = edgesRef.current.findIndex(
          (e) =>
            e.id === newEdge.id ||
            (e.source === newEdge.source &&
              e.target === newEdge.target &&
              e.sourceHandle === newEdge.sourceHandle &&
              e.targetHandle === newEdge.targetHandle)
        );

        let updatedEdges: Edge[];
        if (existingEdgeIndex >= 0) {
          updatedEdges = [...edgesRef.current];
          updatedEdges[existingEdgeIndex] = newEdge;
        } else {
          updatedEdges = addEdge(newEdge, edgesRef.current);
        }

        dispatch(setEdges(updatedEdges));

        if (
          isUndoRedoBySignature &&
          status === "success" &&
          redoStackRef.current.length > 0
        ) {
          const lastRedoEntry =
            redoStackRef.current[redoStackRef.current.length - 1];
          console.log("🔍 [SOCKET] Checking if we need to update redoStack:", {
            lastRedoEntryActionType: lastRedoEntry.actionType,
            isConnectionDelete:
              lastRedoEntry.actionType === "CONNECTION_DELETE",
            oldId: lastRedoEntry.payload.id,
            newId: connectionId,
          });
          if (lastRedoEntry.actionType === "CONNECTION_DELETE") {
            console.log(
              "🔄 [SOCKET] Updating redoStack entry with new connection ID:",
              {
                oldId: lastRedoEntry.payload.id,
                newId: connectionId,
                fullEntry: lastRedoEntry,
              }
            );
            dispatch(
              updateLastRedoStackEntry({
                payload: {
                  id: connectionId,
                },
              })
            );
            console.log("✅ [SOCKET] RedoStack entry updated successfully");
          }
        } else {
          console.log("⏭️ [SOCKET] Skipping redoStack update:", {
            isUndoRedoBySignature,
            status,
            redoStackLength: redoStackRef.current.length,
            reason: !isUndoRedoBySignature
              ? "not undo/redo by signature"
              : status !== "success"
              ? "status not success"
              : redoStackRef.current.length === 0
              ? "redoStack empty"
              : "unknown",
          });
        }

        if (!isUndoRedo && status === "success") {
          const historyEntry: HistoryEntry = {
            actionType: "CONNECTION_CREATE",
            payload: {
              id: connectionId,
              source: connectionData.source,
              target: connectionData.target,
              sourceHandle: connectionData.sourceHandle,
              targetHandle: connectionData.targetHandle,
            },
            inversePayload: {
              id: connectionId,
              source: connectionData.source,
              target: connectionData.target,
              sourceHandle: connectionData.sourceHandle,
              targetHandle: connectionData.targetHandle,
            },
          };
          dispatch(pushHistoryAction(historyEntry));
        }

        // Check if this connection is part of a paste operation
        const isPasteConnection = isConnectionPartOfPaste(
          connectionData.source,
          connectionData.target
        );

        // Suppress toast if this is part of a paste operation (summary toast will be shown instead)
        if (!isPasteConnection) {
          status === "success"
            ? toast.success(message || "Connection created")
            : toast.error(message || "Failed to create connection");
        }
      }
    );

    const unsubscribeConnectionDeleted = on(
      "connection:deleted",
      (data: any) => {
        const connectionId = data?.id || data?.data?.id;
        const status = data?.status || data?.data?.status;
        const message = data?.message || data?.data?.message;

        if (!connectionId) {
          return;
        }

        const isUndoRedo = isUndoRedoAction("connection:deleted", connectionId);

        const currentEdges = edgesRef.current;

        let connectionSnapshot = currentEdges.find(
          (edge) => edge.id === connectionId
        );

        if (!connectionSnapshot) {
          connectionSnapshot = getConnectionSnapshot(connectionId);
        }

        if (!connectionSnapshot) {
          return;
        }

        const edgeToRemove = currentEdges.find((e) => e.id === connectionId);

        const updatedEdges = currentEdges.filter(
          (edge) => edge.id !== connectionId
        );

        const removedCount = currentEdges.length - updatedEdges.length;

        if (removedCount > 1) {
          return;
        }

        if (updatedEdges.length === 0 && currentEdges.length > 1) {
          return;
        }

        dispatch(setEdges(updatedEdges));

        const condition1 = !isUndoRedo;
        const condition2 = status === "success";
        const condition3 = !!connectionSnapshot;

        if (condition1 && condition2 && condition3) {
          const snapshotForHistory =
            connectionSnapshot ||
            currentEdges.find((edge) => edge.id === connectionId);

          if (snapshotForHistory) {
            const historyEntry: HistoryEntry = {
              actionType: "CONNECTION_DELETE",
              payload: {
                id: connectionId,
              },
              inversePayload: {
                id: connectionId,
                source: snapshotForHistory.source,
                target: snapshotForHistory.target,
                sourceHandle: snapshotForHistory.sourceHandle || "",
                targetHandle: snapshotForHistory.targetHandle || "",
              },
            };
            dispatch(pushHistoryAction(historyEntry));
          }
        }

        if (!isUndoRedo) {
          status === "success"
            ? toast.success(message || "Connection deleted")
            : toast.error(message || "Failed to delete connection");
        }
      }
    );

    const unsubscribeNodesDeletedBulk = on("node:deleted", (data: any) => {
      const status = data?.status || data?.data?.status;
      const message = data?.message || data?.data?.message;

      status === "success"
        ? toast.success(message || "Nodes deleted successfully")
        : toast.error(message || "Failed to delete nodes");

      let nodeIds: string[] = [];
      if (Array.isArray(data?.ids)) {
        nodeIds = data.ids;
      } else if (data?.id) {
        nodeIds = [data.id];
      } else if (Array.isArray(data?.data?.node)) {
        nodeIds = data.data.node;
      } else if (data?.data?.node && typeof data.data.node === "string") {
        nodeIds = [data.data.node];
      } else {
        return;
      }

      if (nodeIds.length === 0) {
        return;
      }

      const key = [...nodeIds].sort().join(",");
      if (processedDeletionsRef.current.has(key)) {
        return;
      }

      const isUndoRedo = isUndoRedoAction("node:deleted", nodeIds);

      processedDeletionsRef.current.add(key);

      const nodeSnapshots = nodeListRef.current.filter((node: any) =>
        nodeIds.includes(node.id)
      );

      const updatedNodes = nodesRef.current.filter(
        (node) => !nodeIds.includes(node.id)
      );
      dispatch(updateNodes(updatedNodes));

      const updatedNodeList = nodeListRef.current.filter(
        (node: any) => !nodeIds.includes(node.id)
      );
      dispatch(setNodeList(updatedNodeList));

      if (!isUndoRedo && status === "success" && nodeSnapshots.length > 0) {
        const isSingleDelete = nodeIds.length === 1;
        const historyEntry: HistoryEntry = {
          actionType: isSingleDelete ? "NODE_DELETE" : "NODE_DELETE_BULK",
          payload: isSingleDelete
            ? {
                id: nodeIds[0],
              }
            : {
                ids: nodeIds,
              },
          inversePayload: isSingleDelete
            ? {
                id: nodeIds[0],
                nodeSnapshot: nodeSnapshots[0],
              }
            : {
                ids: nodeIds,
                nodes: nodeSnapshots,
              },
        };
        dispatch(pushHistoryAction(historyEntry));
      }

      setTimeout(() => processedDeletionsRef.current.delete(key), 5000);
    });

    const unsubscribePinAdded = on("pin:added", (data: any) => {
      if (data?.status !== "success" || !data?.data) {
        toast.error(data?.message || "Failed to add pin");
        return;
      }

      const { node_id, pin_collection, pin } = data.data;
      const pinId = pin.id;
      const isUndoRedo = isUndoRedoAction("pin:added", `${node_id}:${pinId}`);

      const updatedNodeList = nodeListRef.current.map((node: any) =>
        node.id === node_id
          ? {
              ...node,
              data: {
                ...node.data,
                [pin_collection]: [...(node.data?.[pin_collection] || []), pin],
              },
            }
          : node
      );

      dispatch(setNodeList(updatedNodeList));
      syncReactFlowNodesFromNodeList(updatedNodeList);
      syncSelectedNodeIfNeeded(updatedNodeList, node_id);

      if (!isUndoRedo) {
        const historyEntry: HistoryEntry = {
          actionType: "PIN_ADD",
          payload: {
            node_id,
            pin_collection,
            pin,
          },
          inversePayload: {
            node_id,
            pin_collection,
            pin_id: pinId,
            pinSnapshot: pin,
          },
        };
        dispatch(pushHistoryAction(historyEntry));
      }

      toast.success(data?.message || "Pin added successfully");
    });

    const unsubscribePinDeleted = on("pin:deleted", (data: any) => {
      if (data?.status !== "success" || !data?.data) {
        toast.error(data?.message || "Failed to delete pin");
        return;
      }

      const { node_id, pin_collection, pin_id, deleted_connections } =
        data.data;

      const isUndoRedo = isUndoRedoAction(
        "pin:deleted",
        `${node_id}:${pin_id}`
      );

      const node = nodeListRef.current.find((n: any) => n.id === node_id);
      const pinSnapshot = node?.data?.[pin_collection]?.find(
        (p: any) => p.id === pin_id
      );

      const updatedNodeList = nodeListRef.current.map((node: any) =>
        node.id === node_id
          ? {
              ...node,
              data: {
                ...node.data,
                [pin_collection]: node.data?.[pin_collection]?.filter(
                  (p: any) => p.id !== pin_id
                ),
              },
            }
          : node
      );

      dispatch(setNodeList(updatedNodeList));
      syncReactFlowNodesFromNodeList(updatedNodeList);
      syncSelectedNodeIfNeeded(updatedNodeList, node_id);

      if (Array.isArray(deleted_connections)) {
        dispatch(
          setEdges(
            edgesRef.current.filter((e) => !deleted_connections.includes(e.id))
          )
        );
      }

      if (!isUndoRedo && pinSnapshot) {
        const historyEntry: HistoryEntry = {
          actionType: "PIN_DELETE",
          payload: {
            node_id,
            pin_collection,
            pin_id,
          },
          inversePayload: {
            node_id,
            pin_collection,
            pin: pinSnapshot,
            pinSnapshot: pinSnapshot,
          },
        };
        dispatch(pushHistoryAction(historyEntry));
      }

      toast.success(data?.message || "Pin deleted successfully");
    });

    const unsubscribePinUpdated = on("pin:updated", (data: any) => {
      if (data?.status !== "success" || !data?.data) {
        toast.error(data?.message || "Failed to update pin");
        return;
      }

      const { node_id, pin_collection, pin } = data.data;
      const pinId = pin.id;
      const isUndoRedo = isUndoRedoAction("pin:updated", `${node_id}:${pinId}`);

      const node = nodeListRef.current.find((n: any) => n.id === node_id);
      const oldPinSnapshot = node?.data?.[pin_collection]?.find(
        (p: any) => p.id === pinId
      );

      const updatedNodeList = nodeListRef.current.map((node: any) =>
        node.id === node_id
          ? {
              ...node,
              data: {
                ...node.data,
                [pin_collection]: node.data?.[pin_collection]?.map((p: any) =>
                  p.id === pin.id ? pin : p
                ),
              },
            }
          : node
      );

      dispatch(setNodeList(updatedNodeList));
      syncReactFlowNodesFromNodeList(updatedNodeList);
      syncSelectedNodeIfNeeded(updatedNodeList, node_id);

      if (!isUndoRedo && oldPinSnapshot) {
        const historyEntry: HistoryEntry = {
          actionType: "PIN_UPDATE",
          payload: {
            node_id,
            pin_collection,
            pin,
          },
          inversePayload: {
            node_id,
            pin_collection,
            pin: oldPinSnapshot,
          },
        };
        dispatch(pushHistoryAction(historyEntry));
      }

      toast.success(data?.message || "Pin updated successfully");
    });

    const unsubscribeNodesCopy = on("workflow:nodes_copy", (data: any) => {
      console.log("📋 [SOCKET] workflow:nodes_copy received:", data);
      // The backend confirms the copy/cut operation
      // The clipboard is already set in the header component
      if (data?.status === "success") {
        toast.success(data?.message || "Nodes copied successfully");
      } else {
        toast.error(data?.message || "Failed to copy nodes");
      }
    });

    return () => {
      unsubscribeWorkflowData();
      unsubscribeNodeCreated();
      unsubscribeNodeUpdated();
      unsubscribeNoteCreated();
      unsubscribeNoteDeleted();
      unsubscribeNoteUpdated();
      unsubscribeConnectionCreated();
      unsubscribeConnectionDeleted();
      unsubscribeNodesDeletedBulk();
      unsubscribePinAdded();
      unsubscribePinDeleted();
      unsubscribePinUpdated();
      unsubscribeNodesCopy();
    };
  }, [on, dispatch]);
};
