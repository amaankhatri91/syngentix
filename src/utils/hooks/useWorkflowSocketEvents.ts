import { useEffect, useRef } from "react";
import { useSocketConnection } from "./useSocketConnection";
import { useAppDispatch } from "@/store";
import {
  setNodes,
  addNode,
  setEdges,
  updateNodes,
  setNodeList,
  setSelectedNode,
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
      label: noteData.label || noteData.content || noteData.title || "",
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
  const { edges, nodes, nodeList, selectedNode } = useAppSelector(
    (state) => state.workflowEditor
  );
  const edgesRef = useRef(edges);
  const nodesRef = useRef(nodes);
  const nodeListRef = useRef(nodeList);
  const selectedNodeRef = useRef(selectedNode);

  // Keep edgesRef in sync with edges
  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  // Keep nodesRef in sync with nodes
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  // Keep nodeListRef in sync with nodeList
  useEffect(() => {
    nodeListRef.current = nodeList;
  }, [nodeList]);

  // Keep selectedNodeRef in sync with selectedNode
  useEffect(() => {
    selectedNodeRef.current = selectedNode;
  }, [selectedNode]);

  // Keep selectedNodeRef in sync with selectedNode
  useEffect(() => {
    selectedNodeRef.current = selectedNode;
  }, [selectedNode]);

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
        dispatch(setNodeList(data?.nodes));
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
      console.log(data, "Node Created Response");
      if (data?.status === "success" && data?.data) {
        // Add node to nodeList
        if (nodeListRef.current && Array.isArray(nodeListRef.current)) {
          const updatedNodeList = [...nodeListRef.current, data.data];
          dispatch(setNodeList(updatedNodeList));
        } else {
          // If nodeList is empty or undefined, initialize it with the new node
          dispatch(setNodeList([data.data]));
        }
        // Add node to ReactFlow nodes
        dispatch(addNode(transformServerNodeToReactFlowNode(data.data)));
        toast.success(data?.message || "Node created successfully");
      } else {
        toast.error(data?.message || "Failed to create node");
      }
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

    // Handle note:updated event - receives updated note confirmation
    const unsubscribeNoteUpdated = on("note:updated", (data: any) => {
      console.log("✏️ note:updated response:", data);
      if (data && data.data) {
        // Transform the updated note data
        const updatedNoteNode = transformServerNoteToReactFlowNode(data.data);

        // Update the note in Redux state
        const noteExists = nodesRef.current.some(
          (node) => node.id === updatedNoteNode.id
        );
        if (noteExists) {
          const updatedNodes = nodesRef.current.map((node) =>
            node.id === updatedNoteNode.id ? updatedNoteNode : node
          );
          dispatch(updateNodes(updatedNodes));
          console.log("✅ Note updated in workflow:", updatedNoteNode.id);
        } else {
          // If note doesn't exist, add it
          dispatch(addNode(updatedNoteNode));
          console.log("✅ Note added to workflow:", updatedNoteNode.id);
        }
      }
      // Show toast message based on status
      if (data?.status === "success") {
        toast.success(data?.message || "Note updated successfully");
      } else {
        toast.error(data?.message || "Failed to update note");
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
    const unsubscribeNodesDeletedBulk = on("node:deleted", (data: any) => {
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

    // Handle pin:added event - receives pin added confirmation
    const unsubscribePinAdded = on("pin:added", (data: any) => {
      console.log("📌 pin:added response:", data);
      if (data?.status === "success" && data?.data) {
        const { node_id, pin_collection, pin } = data.data;
        // Update nodeList - find the node and add the pin to the appropriate collection
        if (nodeListRef.current && Array.isArray(nodeListRef.current)) {
          const updatedNodeList = nodeListRef.current.map((node: any) => {
            if (node.id === node_id) {
              // Create a new node object with updated pin collection
              const updatedNode = { ...node };
              // Map pin_collection to the correct property name
              let collectionKey = pin_collection;
              if (pin_collection === "inputs") {
                collectionKey = "inputs";
              } else if (pin_collection === "outputs") {
                collectionKey = "outputs";
              } else if (pin_collection === "next_pins") {
                collectionKey = "next_pins";
              }

              // Update the data property with the new pin
              if (updatedNode.data && updatedNode.data[collectionKey]) {
                updatedNode.data = {
                  ...updatedNode.data,
                  [collectionKey]: [...updatedNode.data[collectionKey], pin],
                };
              }

              return updatedNode;
            }
            return node;
          });
          // Update nodeList in Redux
          dispatch(setNodeList(updatedNodeList));
          // Also update the ReactFlow nodes to reflect the change
          // Transform the updated nodeList to ReactFlow nodes
          const updatedReactFlowNodes =
            transformServerNodesToReactFlowNodes(updatedNodeList);
          // Preserve any notes that exist in the current nodes array
          const currentNotes = nodesRef.current.filter(
            (node) => node.type === "note"
          );
          // Combine updated nodes with existing notes
          const allUpdatedNodes = [...updatedReactFlowNodes, ...currentNotes];
          dispatch(setNodes(allUpdatedNodes));

          // Update selectedNode if it matches the updated node
          if (selectedNodeRef.current?.id === node_id) {
            const updatedSelectedNode = updatedNodeList.find(
              (node: any) => node.id === node_id
            );
            if (updatedSelectedNode) {
              dispatch(setSelectedNode(updatedSelectedNode));
            }
          }

          console.log(
            "✅ Pin added to node:",
            node_id,
            "in collection:",
            pin_collection
          );
        }
        // Show success toast
        toast.success(data?.message || "Pin added successfully");
      } else if (data?.status === "error" || data?.status === "failed") {
        toast.error(data?.message || "Failed to add pin");
      }
    });

    // Handle pin:deleted event - receives pin deleted confirmation
    const unsubscribePinDeleted = on("pin:deleted", (data: any) => {
      console.log("🗑️ pin:deleted response:", data);

      if (data?.status === "success" && data?.data) {
        const { node_id, pin_collection, pin_id, deleted_connections } =
          data.data;

        // Update nodeList - find the node and remove the pin from the appropriate collection
        if (nodeListRef.current && Array.isArray(nodeListRef.current)) {
          const updatedNodeList = nodeListRef.current.map((node: any) => {
            if (node.id === node_id) {
              // Create a new node object with updated pin collection
              const updatedNode = { ...node };

              // Map pin_collection to the correct property name
              let collectionKey = pin_collection;
              if (pin_collection === "inputs") {
                collectionKey = "inputs";
              } else if (pin_collection === "outputs") {
                collectionKey = "outputs";
              } else if (pin_collection === "next_pins") {
                collectionKey = "next_pins";
              }

              // Remove the pin from the collection
              if (updatedNode.data && updatedNode.data[collectionKey]) {
                updatedNode.data = {
                  ...updatedNode.data,
                  [collectionKey]: updatedNode.data[collectionKey].filter(
                    (pin: any) => pin.id !== pin_id
                  ),
                };
              }

              return updatedNode;
            }
            return node;
          });

          // Update nodeList in Redux
          dispatch(setNodeList(updatedNodeList));

          // Also update the ReactFlow nodes to reflect the change
          // Transform the updated nodeList to ReactFlow nodes
          const updatedReactFlowNodes =
            transformServerNodesToReactFlowNodes(updatedNodeList);

          // Preserve any notes that exist in the current nodes array
          const currentNotes = nodesRef.current.filter(
            (node) => node.type === "note"
          );

          // Combine updated nodes with existing notes
          const allUpdatedNodes = [...updatedReactFlowNodes, ...currentNotes];
          dispatch(setNodes(allUpdatedNodes));

          // Remove cascade-deleted connections if any
          if (
            deleted_connections &&
            Array.isArray(deleted_connections) &&
            deleted_connections.length > 0
          ) {
            const updatedEdges = edgesRef.current.filter(
              (edge) => !deleted_connections.includes(edge.id)
            );
            dispatch(setEdges(updatedEdges));
            console.log(
              "✅ Cascade-deleted connections removed:",
              deleted_connections
            );
          }

          // Update selectedNode if it matches the updated node
          if (selectedNodeRef.current?.id === node_id) {
            const updatedSelectedNode = updatedNodeList.find(
              (node: any) => node.id === node_id
            );
            if (updatedSelectedNode) {
              dispatch(setSelectedNode(updatedSelectedNode));
            }
          }

          console.log(
            "✅ Pin removed from node:",
            node_id,
            "in collection:",
            pin_collection
          );
        }
        // Show success toast
        toast.success(data?.message || "Pin deleted successfully");
      } else if (data?.status === "error" || data?.status === "failed") {
        toast.error(data?.message || "Failed to delete pin");
      }
    });

    // Handle pin:updated event - receives pin updated confirmation
    const unsubscribePinUpdated = on("pin:updated", (data: any) => {
      console.log("✏️ pin:updated response:", data);

      if (data?.status === "success" && data?.data) {
        const { node_id, pin_collection, pin } = data.data;

        // Update nodeList - find the node and update the pin in the appropriate collection
        if (nodeListRef.current && Array.isArray(nodeListRef.current)) {
          const updatedNodeList = nodeListRef.current.map((node: any) => {
            if (node.id === node_id) {
              // Create a new node object with updated pin collection
              const updatedNode = { ...node };

              // Map pin_collection to the correct property name
              let collectionKey = pin_collection;
              if (pin_collection === "inputs") {
                collectionKey = "inputs";
              } else if (pin_collection === "outputs") {
                collectionKey = "outputs";
              } else if (pin_collection === "next_pins") {
                collectionKey = "next_pins";
              }

              // Update the pin in the collection
              if (updatedNode.data && updatedNode.data[collectionKey]) {
                updatedNode.data = {
                  ...updatedNode.data,
                  [collectionKey]: updatedNode.data[collectionKey].map(
                    (existingPin: any) =>
                      existingPin.id === pin.id ? pin : existingPin
                  ),
                };
              }

              return updatedNode;
            }
            return node;
          });

          // Update nodeList in Redux
          dispatch(setNodeList(updatedNodeList));

          // Also update the ReactFlow nodes to reflect the change
          // Transform the updated nodeList to ReactFlow nodes
          const updatedReactFlowNodes =
            transformServerNodesToReactFlowNodes(updatedNodeList);

          // Preserve any notes that exist in the current nodes array
          const currentNotes = nodesRef.current.filter(
            (node) => node.type === "note"
          );

          // Combine updated nodes with existing notes
          const allUpdatedNodes = [...updatedReactFlowNodes, ...currentNotes];
          dispatch(setNodes(allUpdatedNodes));

          // Update selectedNode if it matches the updated node
          if (selectedNodeRef.current?.id === node_id) {
            const updatedSelectedNode = updatedNodeList.find(
              (node: any) => node.id === node_id
            );
            if (updatedSelectedNode) {
              dispatch(setSelectedNode(updatedSelectedNode));
            }
          }

          console.log(
            "✅ Pin updated in node:",
            node_id,
            "in collection:",
            pin_collection
          );
        }

        // Show success toast
        toast.success(data?.message || "Pin updated successfully");
      } else if (data?.status === "error" || data?.status === "failed") {
        toast.error(data?.message || "Failed to update pin");
      }
    });

    // Cleanup: unsubscribe from all events
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
