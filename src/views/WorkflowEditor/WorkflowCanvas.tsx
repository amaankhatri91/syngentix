import React, { useCallback, useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
} from "reactflow";
import "reactflow/dist/style.css";
import useTheme from "@/utils/hooks/useTheme";
import {
  getWorkflowCanvasBg,
  getWorkflowGridColor,
  getWorkflowCanvasBorderColor,
  getWorkflowCanvasShadow,
} from "@/utils/common";
import { initialNodes, initialEdges, CustomNodeData } from "./dymmyData";
import WorkflowEditorControls from "./WorkflowEditorControls";
import { edgeTypes, nodeTypes } from "./type";

const WorkflowCanvas: React.FC = () => {
  const { isDark } = useTheme();
  const [nodes, setNodes] =
    React.useState<Node<CustomNodeData>[]>(initialNodes);
  const [edges, setEdges] = React.useState<Edge[]>(initialEdges);
  const [isLocked, setIsLocked] = React.useState<boolean>(false);

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

  // Background pattern color
  const gridColor = useMemo(() => getWorkflowGridColor(isDark), [isDark]);

  // Canvas styling based on theme
  const canvasBgColor = useMemo(() => getWorkflowCanvasBg(isDark), [isDark]);
  const canvasBorderColor = useMemo(
    () => getWorkflowCanvasBorderColor(isDark),
    [isDark]
  );
  const canvasShadow = useMemo(() => getWorkflowCanvasShadow(isDark), [isDark]);

  return (
    <div
      className="w-full h-[85vh] rounded-lg overflow-hidden"
      style={{
        backgroundColor: canvasBgColor,
        border: `0.6px solid ${canvasBorderColor}`,
        boxShadow: canvasShadow,
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edgesWithTheme}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
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
      >
        <Background color={gridColor} gap={180} size={1} variant="lines" />
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
    </div>
  );
};

export default WorkflowCanvas;
