import React, { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ReactFlow, {
  Node,
  Edge,
  Background,
  BackgroundVariant,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import useTheme from "@/utils/hooks/useTheme";
import {
  getWorkflowCanvasBg,
  getWorkflowGridColor,
  getWorkflowCanvasBorderColor,
  getWorkflowCanvasShadow,
} from "@/utils/common";
import { CustomNodeData } from "./dymmyData";
import WorkflowEditorControls from "./WorkflowEditorControls";
import { edgeTypes, nodeTypes } from "./type";
import ContextMenu from "./WorkflowContextMenu";
import { useSocketConnection } from "@/utils/hooks/useSocketConnection";
import { useWorkflowSocketEvents } from "@/utils/hooks/useWorkflowSocketEvents";
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
  const { nodes, edges, isLocked } = useAppSelector(
    (state) => state.workflowEditor
  );

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

        console.log("📍 Node dropped at position:", dropPosition);
      }
    },
    [workflowId, emit, reactFlowInstance]
  );

  // Memoize edge styles - use #8E8E93 for all regular edges
  const edgesWithTheme = useMemo(() => {
    return edges.map((edge) => {
      // If edge has strokeDasharray (dotted), keep its existing style for gradient handling
      const isDotted = edge.style?.strokeDasharray;
      return {
        ...edge,
        style: {
          ...edge.style,
          // Only override stroke for non-dotted edges
          ...(isDotted ? {} : { stroke: "#8E8E93" }),
        },
      };
    });
  }, [edges]);

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
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={!isLocked}
        nodesConnectable={false}
        elementsSelectable={true}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
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
        />
      )}
    </div>
  );
};

export default WorkflowCanvas;
