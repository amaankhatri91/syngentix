import React, { useCallback, useMemo, useState } from "react";
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
} from "@/store/workflowEditor/workflowEditorSlice";

const WorkflowCanvas: React.FC = () => {
  const { isDark } = useTheme();
  const { emit } = useSocketConnection();
  const { workflowId } = useParams<{ workflowId: string }>();
  const { userId } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { nodes, edges, isLocked, edgeThickness } = useAppSelector(
    (state) => state.workflowEditor
  );

  console.log(nodes, "Verify Notes Data");

  // Handle edge deletion
  const handleEdgeDelete = useCallback(
    (edgeId: string, workflowIdParam: string) => {
      if (!workflowIdParam) return;
      // Emit connection:delete event
      emit("connection:delete", {
        workflow_id: workflowIdParam,
        id: edgeId,
      });
      const updatedEdges = edges.filter((edge) => edge.id !== edgeId);
      dispatch(setEdges(updatedEdges));
    },
    [edges, dispatch, emit]
  );

  // Handle node deletion (bulk)
  const handleNodeDelete = useCallback(
    (nodeIds: string[], workflowIdParam: string) => {
      if (!workflowIdParam || nodeIds.length === 0) return;
      // Emit node:delete_bulk event
      emit("node:delete_bulk", {
        workflow_id: workflowIdParam,
        ids: nodeIds,
      });
      // Remove nodes from Redux store (optimistic update)
      const updatedNodes = nodes.filter((node) => !nodeIds.includes(node.id));
      dispatch(updateNodes(updatedNodes));
      console.log("🗑️ Nodes deleted:", nodeIds);
    },
    [nodes, dispatch, emit]
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

  // Close context menu when clicking on the pane
  const onPaneClick = useCallback(() => {
    setContextMenu(null);
  }, []);

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

        emit("node:dragEnd", {
          workflow_id: workflowId,
          id: node.id,
          position: dropPosition,
        });
      }
    },
    [workflowId, emit, reactFlowInstance]
  );

  // Memoize edge styles - use #8E8E93 for all regular edges
  // Use active node colors (#48D8D1 to #096DBF) for edges connected to active/selected nodes
  // Also apply gradient to edges that are directly selected
  // Preserve existing dotted edges (for future debug mode)
  const edgesWithTheme = useMemo(() => {
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
  }, [edges, nodes, edgeThickness]);

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
        nodes={nodes}
        edges={edgesWithTheme}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onPaneContextMenu={onPaneContextMenu}
        onNodeClick={onNodeClick}
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
        <MiniMap
          className={`
            ${
              isDark
                ? "bg-[#0C1116] border-[#394757]"
                : "bg-white border-[#E3E6EB]"
            }
            border rounded-lg
          `}
          nodeColor={(node) => {
            const data = node.data as CustomNodeData;
            return data?.dotColor || "#94A3B8";
          }}
          maskColor={isDark ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.1)"}
        />
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
