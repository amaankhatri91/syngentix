import React, { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactFlow, {
  Node,
  Edge,
  Connection,
  Background,
  BackgroundVariant,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  ReactFlowInstance,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import useTheme from "@/utils/hooks/useTheme";
import {
  getWorkflowCanvasBg,
  getWorkflowGridColor,
  getWorkflowCanvasBorderColor,
  getWorkflowCanvasShadow,
} from "@/utils/common";
import { CustomNodeData } from "./type";
import WorkflowEditorControls from "./WorkflowEditorControls";
import { edgeTypes, nodeTypes } from "./type";
import ContextMenu from "./WorkflowContextMenu";
import { useSocketConnection } from "@/utils/hooks/useSocketConnection";
import { useWorkflowSocketEvents } from "@/utils/hooks/useWorkflowSocketEvents";
import { useDeleteKeyHandler } from "@/utils/hooks/useDeleteKeyHandler";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  updateNodes,
  setEdges,
  setDatabaseDialogOpen,
  setSelectedNode,
  setSelectedNodeId,
  setPasteMode,
  clearClipboard,
} from "@/store/workflowEditor/workflowEditorSlice";
import { Viewport } from "reactflow";
import { showErrorToast } from "@/utils/toast";
import { storeConnectionSnapshot } from "@/utils/hooks/useConnectionDeletionTracking";
import { toast } from "react-toastify";
import { setPendingPasteInfo, PasteInfo } from "@/utils/hooks/usePasteTracking";

interface WorkflowCanvasProps {
  nodesData?: any;
}

const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({ nodesData }) => {
  const { isDark } = useTheme();
  const { emit } = useSocketConnection();
  const { workflowId } = useParams<{ workflowId: string }>();
  const { userId } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const {
    nodes,
    edges,
    isLocked,
    edgeThickness,
    nodeList,
    minimapVisible,
    clipboard,
    isPasteMode,
  } = useAppSelector((state) => state.workflowEditor);

  console.log(nodes, "Feature Added inside node Listing");

  // Handle edge deletion
  const handleEdgeDelete = useCallback(
    (edgeId: string, workflowIdParam: string) => {
      if (!workflowIdParam) return;
      
      // IMPORTANT: Capture connection snapshot BEFORE optimistic update
      // This snapshot will be used by useWorkflowSocketEvents to record history
      const edgeToDelete = edges.find((edge) => edge.id === edgeId);
      
      if (edgeToDelete) {
        // Store the snapshot so socket handler can access it
        storeConnectionSnapshot(edgeId, edgeToDelete);
        console.log("📸 [CANVAS] Captured connection snapshot before delete:", {
          edgeId,
          edge: {
            id: edgeToDelete.id,
            source: edgeToDelete.source,
            target: edgeToDelete.target,
            sourceHandle: edgeToDelete.sourceHandle,
            targetHandle: edgeToDelete.targetHandle,
          },
        });
      }
      
      // Emit connection:delete event
      emit("connection:delete", {
        workflow_id: workflowIdParam,
        id: edgeId,
      });
      
      // Optimistic update - remove edge immediately
      const updatedEdges = edges.filter((edge) => edge.id !== edgeId);
      dispatch(setEdges(updatedEdges));
    },
    [edges, dispatch, emit]
  );

  // Helper function to check if a node is an entry node
  const isEntryNode = useCallback(
    (nodeId: string): boolean => {
      // Check in nodeList first (server data)
      const nodeInList = nodeList?.find((n: any) => n.id === nodeId);
      if (nodeInList) {
        const category = nodeInList.data?.category || nodeInList.category || nodeInList.type;
        if (category?.toLowerCase() === "entry") {
          return true;
        }
      }
      
      // Also check in ReactFlow nodes
      const reactFlowNode = nodes.find((n) => n.id === nodeId);
      if (reactFlowNode) {
        // Check if node has entry-related properties
        const nodeData = reactFlowNode.data;
        if (nodeData?.label?.toLowerCase().includes("entry")) {
          return true;
        }
      }
      
      return false;
    },
    [nodeList, nodes]
  );

  // Handle node deletion (bulk)
  const handleNodeDelete = useCallback(
    (nodeIds: string[], workflowIdParam: string) => {
      if (!workflowIdParam || nodeIds.length === 0) return;
      
      // Filter out entry nodes - they cannot be deleted
      const entryNodeIds = nodeIds.filter((nodeId) => isEntryNode(nodeId));
      const deletableNodeIds = nodeIds.filter((nodeId) => !isEntryNode(nodeId));
      
      if (entryNodeIds.length > 0) {
        toast.warning("Entry nodes cannot be deleted");
        console.warn("⚠️ Attempted to delete entry nodes:", entryNodeIds);
      }
      
      if (deletableNodeIds.length === 0) {
        return; // No nodes to delete after filtering
      }
      
      // Emit node:delete_bulk event only for non-entry nodes
      emit("node:delete_bulk", {
        workflow_id: workflowIdParam,
        ids: deletableNodeIds,
      });
      // Remove nodes from Redux store (optimistic update)
      const updatedNodes = nodes.filter((node) => !deletableNodeIds.includes(node.id));
      dispatch(updateNodes(updatedNodes));
      console.log("🗑️ Nodes deleted:", deletableNodeIds);
    },
    [nodes, dispatch, emit, isEntryNode]
  );

  // Handle Delete key for selected edges and nodes
  useDeleteKeyHandler({
    edges,
    nodes,
    onDeleteEdge: handleEdgeDelete,
    onDeleteNode: handleNodeDelete,
    workflowId,
  });

  // Use custom hook for socket events to get on listing
  // Connection creation for paste is now handled in useWorkflowSocketEvents via usePasteTracking
  useWorkflowSocketEvents();

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  // Handle node changes (drag, select, etc.)
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updatedNodes = applyNodeChanges(changes, nodes);
      dispatch(updateNodes(updatedNodes));
    },
    [nodes, dispatch]
  );

  // Handle edge changes
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const updatedEdges = applyEdgeChanges(changes, edges);
      dispatch(setEdges(updatedEdges));
    },
    [edges, dispatch]
  );

  // Handle connection creation
  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target || !workflowId) {
        return;
      }

      // Validate: Prevent self-connections
      if (connection.source === connection.target) {
        showErrorToast("A node cannot be connected to itself.");
        return;
      }

      console.log(connection, "Verify The Connections");
      // Generate a unique ID for the connection
      const connectionId = `edge-${connection.source}-${
        connection.sourceHandle
      }-${connection.target}-${connection.targetHandle}-${Date.now()}`;

      // Create the new edge
      const newEdge: Edge = {
        id: connectionId,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        type: "default",
      };
      // Add edge to Redux store
      const updatedEdges = addEdge(newEdge, edges);
      dispatch(setEdges(updatedEdges));
      // Emit connection:create event with the format shown in the image
      emit("connection:create", {
        workflow_id: workflowId,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle || "",
        targetHandle: connection.targetHandle || "",
      });
      console.log("🔗 Connection created:", connection);
    },
    [edges, dispatch, emit, workflowId]
  );

  // Handle context menu on pane (canvas background)
  const onPaneContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      if (!reactFlowInstance) return;
      // Get the position in the viewport
      const x = event.clientX;
      const y = event.clientY;
      setContextMenu({ x, y });
    },
    [reactFlowInstance]
  );

  // Close context menu when clicking on a node
  const onNodeClick = useCallback(() => {
    setContextMenu(null);
  }, []);

  // Handle node double click to open database dialog
  const onNodeDoubleClick = useCallback(
    (_event: React.MouseEvent, node: Node<CustomNodeData>) => {
      console.log("🖱️ Node double-clicked:", node);
      // Don't open modal for sticky notes - they have their own double-click functionality
      if (node.type === "note") {
        return;
      }
      if (!node?.id || !Array.isArray(nodeList)) {
        console.warn("Invalid node or nodeList");
        return;
      }
      const foundNode = nodeList.find(
        (item) => String(item.id) === String(node.id)
      );
      // If you want full node data
      dispatch(setSelectedNode(foundNode));
      dispatch(setSelectedNodeId(node.id));
      dispatch(setDatabaseDialogOpen(true));
    },
    [dispatch, nodeList]
  );

  // Close context menu when clicking on the pane
  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      setContextMenu(null);

      // Handle paste on canvas click
      if (isPasteMode && clipboard && reactFlowInstance && workflowId) {
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        // Calculate offset from original positions
        const originalPositions = clipboard.nodes.map((node) => node.position);
        const minX = Math.min(...originalPositions.map((p) => p.x));
        const minY = Math.min(...originalPositions.map((p) => p.y));

        // Store paste operation info for tracking node creation
        const pasteInfo: PasteInfo = {
          oldToNewIdMap: new Map<string, string>(),
          edgesToCreate: clipboard.includeConnections ? clipboard.edges : [],
          originalNodeIds: clipboard.nodes.map((node) => node.id),
          isCut: clipboard.copyType === "cut",
          expectedNodeCount: clipboard.nodes.length,
          createdNodeCount: 0,
          nodePositions: new Map<string, { x: number; y: number; type: string }>(),
          connectionsCreated: false,
          workflowId: workflowId,
        };

        // Store node positions and types for mapping
        clipboard.nodes.forEach((node) => {
          const offsetX = node.position.x - minX;
          const offsetY = node.position.y - minY;
          const newPosition = {
            x: position.x + offsetX,
            y: position.y + offsetY,
          };
          const originalNode = nodeList?.find((n: any) => n.id === node.id);
          const nodeType = originalNode?.type || node.type || "unknown";
          pasteInfo.nodePositions.set(node.id, {
            ...newPosition,
            type: nodeType,
          });
        });
        
        // Store counts for summary toast
        const nodeCount = clipboard.nodes.length;
        const connectionCount = clipboard.includeConnections ? clipboard.edges.length : 0;
        
        // Set callback to show summary toast when paste completes
        pasteInfo.onComplete = () => {
          // Show summary toast only once when all operations complete
          if (connectionCount > 0) {
            toast.success(
              `Pasted ${nodeCount} node${nodeCount !== 1 ? "s" : ""} and ${connectionCount} connection${connectionCount !== 1 ? "s" : ""}`
            );
          } else {
            toast.success(`Pasted ${nodeCount} node${nodeCount !== 1 ? "s" : ""}`);
          }
          // Clear clipboard after showing toast
          dispatch(clearClipboard());
        };
        
        // Store paste info in shared module for node:created handler
        setPendingPasteInfo(pasteInfo);
        
        // Create nodes first
        clipboard.nodes.forEach((node) => {
          const nodeInfo = pasteInfo.nodePositions.get(node.id);
          if (!nodeInfo) return;
          const originalNode = nodeList?.find((n: any) => n.id === node.id);
          const nodeType = originalNode?.type || node.type || "unknown";
          // Emit node:create event
          emit("node:create", {
            workflow_id: workflowId,
            type: nodeType,
            position: { x: nodeInfo.x, y: nodeInfo.y },
            data: originalNode?.data || node.data,
            user_id: userId || undefined,
          });
        });
        // If cut, delete original nodes
        if (clipboard.copyType === "cut") {
          const originalNodeIds = clipboard.nodes.map((node) => node.id);
          emit("node:delete_bulk", {
            workflow_id: workflowId,
            ids: originalNodeIds,
          });
        }
        
        // Exit paste mode (but keep clipboard until connections are created)
        dispatch(setPasteMode(false));
        
        // If no connections to create, show toast after a short delay
        if (connectionCount === 0) {
          setTimeout(() => {
            if (pasteInfo.onComplete) {
              pasteInfo.onComplete();
            }
          }, 1000); // Delay to ensure all nodes are created
        }
        // If connections exist, onComplete will be called after connections are created
      }
    },
    [isPasteMode, clipboard, reactFlowInstance, workflowId, nodeList, userId, emit, dispatch]
  );

  // Handle node drag stop event (when node is dropped after dragging)
  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node<CustomNodeData>) => {
      console.log("🖱️ Node dropped after dragging:", node);
      if (workflowId && reactFlowInstance) {
        // Get the final position where the node was dropped
        const dropPosition = {
          x: node.position.x,
          y: node.position.y,
        };
        if (node?.type === "note") {
          emit("note:dragEnd", {
            workflow_id: workflowId,
            id: node.id,
            position: dropPosition,
          });
        } else {
          emit("node:dragEnd", {
            workflow_id: workflowId,
            id: node.id,
            position: dropPosition,
          });
        }
      }
    },
    [workflowId, emit, reactFlowInstance]
  );

  // Handle minimap click for navigation
  const handleMinimapClick = useCallback(
    (event: React.MouseEvent, position: Viewport) => {
      if (!reactFlowInstance || !position) return;

      try {
        // Ensure we have valid position values
        const viewport = {
          x: typeof position.x === "number" ? position.x : 0,
          y: typeof position.y === "number" ? position.y : 0,
          zoom:
            typeof position.zoom === "number"
              ? position.zoom
              : reactFlowInstance.getViewport().zoom,
        };

        reactFlowInstance.setViewport(viewport, { duration: 300 });
      } catch (error) {
        console.error("Error navigating minimap:", error);
      }
    },
    [reactFlowInstance]
  );

  // Memoize nodes with blur effect for cut nodes
  const nodesWithCutEffect = useMemo(() => {
    if (!clipboard || clipboard.copyType !== "cut") {
      return nodes;
    }

    const cutNodeIds = new Set(clipboard.nodes.map((node) => node.id));

    return nodes.map((node) => {
      const isCut = cutNodeIds.has(node.id);
      if (isCut) {
        return {
          ...node,
          style: {
            ...node.style,
            opacity: 0.5,
            filter: "blur(2px)",
            transition: "opacity 0.2s, filter 0.2s",
          },
        };
      }
      return node;
    });
  }, [nodes, clipboard]);

  // Memoize edge styles - use #8E8E93 for all regular edges
  // Use active node colors (#48D8D1 to #096DBF) for edges connected to active/selected nodes
  // Also apply gradient to edges that are directly selected
  // Preserve existing dotted edges (for future debug mode)
  // Also blur edges connected to cut nodes
  const edgesWithTheme = useMemo(() => {
    const cutNodeIds = clipboard && clipboard.copyType === "cut" 
      ? new Set(clipboard.nodes.map((node) => node.id))
      : new Set<string>();

    return edges.map((edge) => {
      // Check if source or target node is selected
      const sourceNode = nodes.find((node) => node.id === edge.source);
      const targetNode = nodes.find((node) => node.id === edge.target);
      const isSourceSelected = sourceNode?.selected || false;
      const isTargetSelected = targetNode?.selected || false;
      const isNodeActive = isSourceSelected || isTargetSelected;

      // Check if the edge itself is selected
      const isEdgeSelected = edge.selected || false;

      // Edge is active if connected to selected node OR if edge itself is selected
      const isActive = isNodeActive || isEdgeSelected;

      // Check if edge is connected to a cut node
      const isConnectedToCutNode = cutNodeIds.has(edge.source) || cutNodeIds.has(edge.target);

      // If edge already has strokeDasharray (dotted), keep its existing style
      const isDotted = edge.style?.strokeDasharray;
      return {
        ...edge,
        data: {
          ...edge.data,
          isActive,
        },
        style: {
          ...edge.style,
          // Apply blur and opacity if connected to cut node
          ...(isConnectedToCutNode
            ? {
                opacity: 0.5,
                filter: "blur(2px)",
                transition: "opacity 0.2s, filter 0.2s",
              }
            : {}),
          // Preserve dotted style if it exists, otherwise use solid line
          ...(isDotted
            ? {
                // Keep existing dotted style - WorkflowEdge will apply gradient
                strokeWidth: edgeThickness,
              }
            : {
                // For active edges, WorkflowEdge will apply gradient
                // For regular edges, use gray color
                stroke: isActive ? undefined : "#8E8E93",
                strokeWidth: edgeThickness,
              }),
        },
      };
    });
  }, [edges, nodes, edgeThickness, clipboard]);

  return (
    <div
      className="w-full rounded-2xl h-full overflow-hidden"
      style={{
        backgroundColor: getWorkflowCanvasBg(isDark),
        border: `0.6px solid ${getWorkflowCanvasBorderColor(isDark)}`,
        boxShadow: getWorkflowCanvasShadow(isDark),
      }}
    >
      <ReactFlow
        nodes={nodesWithCutEffect}
        edges={edgesWithTheme}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onPaneContextMenu={onPaneContextMenu}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        onPaneClick={onPaneClick}
        onNodeDragStop={onNodeDragStop}
        onDrop={(event) => {
          event.preventDefault();
          const nodeData = event.dataTransfer.getData("application/reactflow");
          if (nodeData && reactFlowInstance && workflowId) {
            const node = JSON.parse(nodeData);
            // Convert screen coordinates to flow coordinates
            const position = reactFlowInstance.screenToFlowPosition({
              x: event.clientX,
              y: event.clientY,
            });
            // Emit socket event with the required format
            emit("node:create", {
              workflow_id: workflowId,
              type: node.id || node.category || "unknown",
              position: {
                x: position.x,
                y: position.y,
              },
              data: node,
              user_id: userId || undefined,
            });
            console.log("Node dropped on canvas:", node);
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
        }}
        nodesDraggable={!isLocked}
        nodesConnectable={!isLocked}
        elementsSelectable={true}
        edgesUpdatable={false}
        edgesFocusable={true}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        defaultViewport={{ x: 0, y: 0, zoom: 1.0995899256440786 }}
        connectionLineStyle={{
          stroke: "#8E8E93",
          strokeWidth: 2,
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          color={getWorkflowGridColor(isDark)}
          gap={180}
          size={1}
          variant={BackgroundVariant.Lines}
        />
        <WorkflowEditorControls />
        {isPasteMode && clipboard && (
          <div className="absolute top-2 left-2 z-50">
            <button
              className={`px-4 py-2 rounded-lg text-white text-sm font-medium shadow-lg ${
                isDark
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              } transition-colors`}
              onClick={(e) => {
                e.stopPropagation();
                dispatch(setPasteMode(false));
                dispatch(clearClipboard());
                toast.info("Paste cancelled");
              }}
            >
              Click on canvas to paste
            </button>
          </div>
        )}
        {minimapVisible && (
          <MiniMap
            className={`
              ${
                isDark
                  ? "bg-[#0C1116] border-[#394757]"
                  : "bg-white border-[#E3E6EB]"
              }
              border rounded-lg cursor-grab
            `}
            nodeColor={(node) => {
              const data = node.data as CustomNodeData;
              return data?.dotColor || "#94A3B8";
            }}
            maskColor={isDark ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.1)"}
            onClick={handleMinimapClick}
            pannable={true}
            zoomable={true}
          />
        )}
      </ReactFlow>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          workflowId={workflowId || ""}
          reactFlowInstance={reactFlowInstance}
        />
      )}
    </div>
  );
};

export default WorkflowCanvas;
