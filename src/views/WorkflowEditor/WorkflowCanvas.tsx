import React, { useCallback, useMemo, useState, useEffect } from "react";
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
import { useAppSelector } from "@/store";

const WorkflowCanvas: React.FC = () => {
  const { isDark } = useTheme();
  const { on, emit } = useSocketConnection();
  const { workflowId } = useParams<{ workflowId: string }>();
  const { userId } = useAppSelector((state) => state.auth);

  const [nodes, setNodes] = useState<Node<CustomNodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  useEffect(() => {
    const unsubscribeWorkflowData = on("workflow:data", (data) => {
      console.log("📥 workflow:data received:", data);
      // 👉 update state here
      // setNodes(data.nodes);
      // setEdges(data.edges);
    });
    const unsubscribeNodeCreated = on("node:created", (data) => {
      console.log("✅ node:created response:", data);
      // Verify Node Created Data
    });
    return () => {
      unsubscribeWorkflowData();
      unsubscribeNodeCreated();
    };
  }, [on]);

  const handleToggleLock = useCallback(() => {
    setIsLocked((prev) => !prev);
  }, []);

  // Handle node changes (drag, select, etc.)
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  // Handle edge changes
  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

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

  const handleAddnodes = () => {};

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
        <WorkflowEditorControls
          isLocked={isLocked}
          onToggleLock={handleToggleLock}
        />
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
