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
} from "@/store/workflowEditor/workflowEditorSlice";
import { addEdge, Node } from "reactflow";
import {
  transformServerNodesToReactFlowNodes,
  transformServerNodeToReactFlowNode,
  transformServerConnectionsToReactFlowEdges,
  transformServerConnectionToReactFlowEdge,
} from "@/utils/common";
import { toast } from "react-toastify";
import { CustomNodeData } from "@/views/WorkflowEditor/type";

/**
 * Transform server note data to ReactFlow Node format
 */
const transformServerNoteToReactFlowNode = (
  noteData: any
): Node<CustomNodeData> => ({
  id: noteData.id,
  type: "note",
  position: noteData.position || { x: 0, y: 0 },
  data: {
    label: noteData.label || noteData.content || noteData.title || "",
    nodeType: "text",
    dotColor: "#94A3B8",
    borderColor: "from-gray-500 to-gray-600",
  } as CustomNodeData,
});

export const useWorkflowSocketEvents = () => {
  const { on } = useSocketConnection();
  const dispatch = useAppDispatch();

  const { edges, nodes, nodeList, selectedNode } = useAppSelector(
    (state) => state.workflowEditor
  );

  /** -------------------- REFS (prevent stale closures) -------------------- */
  const edgesRef = useRef(edges);
  const nodesRef = useRef(nodes);
  const nodeListRef = useRef(nodeList);
  const selectedNodeRef = useRef(selectedNode);

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

  /** -------------------- HELPERS (NO LOGIC CHANGE) -------------------- */

  const syncReactFlowNodesFromNodeList = (updatedNodeList: any[]) => {
    const rfNodes =
      transformServerNodesToReactFlowNodes(updatedNodeList);
    const notes = nodesRef.current.filter(
      (node) => node.type === "note"
    );
    dispatch(setNodes([...rfNodes, ...notes]));
  };

  const syncSelectedNodeIfNeeded = (
    updatedNodeList: any[],
    nodeId: string
  ) => {
    if (selectedNodeRef.current?.id === nodeId) {
      const updated = updatedNodeList.find(
        (n) => n.id === nodeId
      );
      if (updated) {
        dispatch(setSelectedNode(updated));
      }
    }
  };

  /** Track bulk deletion duplicates */
  const processedDeletionsRef = useRef<Set<string>>(new Set());

  /** -------------------- SOCKET EVENTS -------------------- */
  useEffect(() => {
    /** workflow:data */
    const unsubscribeWorkflowData = on("workflow:data", (data: any) => {
      const allNodes: Node<CustomNodeData>[] = [];

      if (Array.isArray(data?.nodes)) {
        allNodes.push(
          ...transformServerNodesToReactFlowNodes(data.nodes)
        );
        dispatch(setNodeList(data.nodes));
      }

      if (Array.isArray(data?.notes)) {
        allNodes.push(
          ...data.notes.map(transformServerNoteToReactFlowNode)
        );
      }

      if (allNodes.length) {
        dispatch(setNodes(allNodes));
      }

      if (Array.isArray(data?.connections)) {
        dispatch(
          setEdges(
            transformServerConnectionsToReactFlowEdges(
              data.connections
            )
          )
        );
      }
    });

    /** node:created */
    const unsubscribeNodeCreated = on("node:created", (data: any) => {
      if (data?.status === "success" && data?.data) {
        const updatedNodeList = nodeListRef.current
          ? [...nodeListRef.current, data.data]
          : [data.data];

        dispatch(setNodeList(updatedNodeList));
        dispatch(
          addNode(transformServerNodeToReactFlowNode(data.data))
        );

        toast.success(data.message || "Node created successfully");
      } else {
        toast.error(data?.message || "Failed to create node");
      }
    });

    /** note:created */
    const unsubscribeNoteCreated = on("note:created", (data: any) => {
      if (data?.data) {
        dispatch(
          addNode(transformServerNoteToReactFlowNode(data.data))
        );
      }

      data?.status === "success"
        ? toast.success(data?.message || "Note added successfully")
        : toast.error(data?.message || "Failed to add note");
    });

    /** note:deleted */
    const unsubscribeNoteDeleted = on("note:deleted", (data: any) => {
      if (data?.id) {
        dispatch(
          updateNodes(
            nodesRef.current.filter(
              (node) => node.id !== data.id
            )
          )
        );
      }

      data?.status === "success"
        ? toast.success(data?.message || "Note deleted successfully")
        : toast.error(data?.message || "Failed to delete note");
    });

    /** note:updated */
    const unsubscribeNoteUpdated = on("note:updated", (data: any) => {
      if (data?.data) {
        const updatedNote =
          transformServerNoteToReactFlowNode(data.data);

        const exists = nodesRef.current.some(
          (n) => n.id === updatedNote.id
        );

        dispatch(
          exists
            ? updateNodes(
                nodesRef.current.map((n) =>
                  n.id === updatedNote.id ? updatedNote : n
                )
              )
            : addNode(updatedNote)
        );
      }

      data?.status === "success"
        ? toast.success(data?.message || "Note updated successfully")
        : toast.error(data?.message || "Failed to update note");
    });

    /** connection:created */
    const unsubscribeConnectionCreated = on(
      "connection:created",
      (data: any) => {
        if (data?.data) {
          dispatch(
            setEdges(
              addEdge(
                transformServerConnectionToReactFlowEdge(
                  data.data
                ),
                edgesRef.current
              )
            )
          );
        }

        data?.status === "success"
          ? toast.success(data?.message || "Connection created")
          : toast.error(data?.message || "Failed to create connection");
      }
    );

    /** connection:deleted */
    const unsubscribeConnectionDeleted = on(
      "connection:deleted",
      (data: any) => {
        if (data?.id) {
          dispatch(
            setEdges(
              edgesRef.current.filter(
                (edge) => edge.id !== data.id
              )
            )
          );
        }

        data?.status === "success"
          ? toast.success(data?.message || "Connection deleted")
          : toast.error(data?.message || "Failed to delete connection");
      }
    );

    /** node:deleted (bulk) */
    const unsubscribeNodesDeletedBulk = on("node:deleted", (data: any) => {
      data?.status === "success"
        ? toast.success(data?.message || "Nodes deleted successfully")
        : toast.error(data?.message || "Failed to delete nodes");

      if (!Array.isArray(data?.ids)) return;

      const key = [...data.ids].sort().join(",");
      if (processedDeletionsRef.current.has(key)) return;

      processedDeletionsRef.current.add(key);

      dispatch(
        updateNodes(
          nodesRef.current.filter(
            (node) => !data.ids.includes(node.id)
          )
        )
      );

      setTimeout(
        () => processedDeletionsRef.current.delete(key),
        5000
      );
    });

    /** pin:added */
    const unsubscribePinAdded = on("pin:added", (data: any) => {
      if (data?.status !== "success" || !data?.data) {
        toast.error(data?.message || "Failed to add pin");
        return;
      }

      const { node_id, pin_collection, pin } = data.data;

      const updatedNodeList = nodeListRef.current.map((node: any) =>
        node.id === node_id
          ? {
              ...node,
              data: {
                ...node.data,
                [pin_collection]: [
                  ...(node.data?.[pin_collection] || []),
                  pin,
                ],
              },
            }
          : node
      );

      dispatch(setNodeList(updatedNodeList));
      syncReactFlowNodesFromNodeList(updatedNodeList);
      syncSelectedNodeIfNeeded(updatedNodeList, node_id);

      toast.success(data?.message || "Pin added successfully");
    });

    /** pin:deleted */
    const unsubscribePinDeleted = on("pin:deleted", (data: any) => {
      if (data?.status !== "success" || !data?.data) {
        toast.error(data?.message || "Failed to delete pin");
        return;
      }

      const {
        node_id,
        pin_collection,
        pin_id,
        deleted_connections,
      } = data.data;

      const updatedNodeList = nodeListRef.current.map((node: any) =>
        node.id === node_id
          ? {
              ...node,
              data: {
                ...node.data,
                [pin_collection]: node.data?.[
                  pin_collection
                ]?.filter((p: any) => p.id !== pin_id),
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
            edgesRef.current.filter(
              (e) => !deleted_connections.includes(e.id)
            )
          )
        );
      }

      toast.success(data?.message || "Pin deleted successfully");
    });

    /** pin:updated */
    const unsubscribePinUpdated = on("pin:updated", (data: any) => {
      if (data?.status !== "success" || !data?.data) {
        toast.error(data?.message || "Failed to update pin");
        return;
      }

      const { node_id, pin_collection, pin } = data.data;

      const updatedNodeList = nodeListRef.current.map((node: any) =>
        node.id === node_id
          ? {
              ...node,
              data: {
                ...node.data,
                [pin_collection]: node.data?.[
                  pin_collection
                ]?.map((p: any) =>
                  p.id === pin.id ? pin : p
                ),
              },
            }
          : node
      );

      dispatch(setNodeList(updatedNodeList));
      syncReactFlowNodesFromNodeList(updatedNodeList);
      syncSelectedNodeIfNeeded(updatedNodeList, node_id);

      toast.success(data?.message || "Pin updated successfully");
    });

    /** cleanup */
    return () => {
      unsubscribeWorkflowData();
      unsubscribeNodeCreated();
      unsubscribeNoteCreated();
      unsubscribeNoteDeleted();
      unsubscribeNoteUpdated();
      unsubscribeConnectionCreated();
      unsubscribeConnectionDeleted();
      unsubscribeNodesDeletedBulk();
      unsubscribePinAdded();
      unsubscribePinDeleted();
      unsubscribePinUpdated();
    };
  }, [on, dispatch]);
};