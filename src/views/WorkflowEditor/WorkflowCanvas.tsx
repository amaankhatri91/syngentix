import React, { useCallback, useMemo, useState } from "react";
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
import { initialNodes, initialEdges, CustomNodeData } from "./dymmyData";
import WorkflowEditorControls from "./WorkflowEditorControls";
import { edgeTypes, nodeTypes } from "./type";
import ContextMenu from "./ContextMenu";

const WorkflowCanvas: React.FC = () => {
  const { isDark } = useTheme();
  const [nodes, setNodes] = useState<Node<CustomNodeData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

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

  // Handle adding a new node
  const handleAddNode = useCallback(() => {
    if (!reactFlowInstance || !contextMenu) return;

    // Convert screen coordinates to flow coordinates
    const position = reactFlowInstance.screenToFlowPosition({
      x: contextMenu.x,
      y: contextMenu.y,
    });

    const newNode: Node<CustomNodeData> = {
      id: `node-${Date.now()}`,
      type: "custom",
      position,
      data: {
        label: "New Node",
        nodeType: "text",
        dotColor: "#22D3EE",
        borderColor: "from-blue-500 to-purple-500",
        inputs: ["Start"],
        outputs: ["Next"],
      },
    };

    setNodes((nds) => [...nds, newNode]);
  }, [reactFlowInstance, contextMenu]);

  // Handle adding a sticky note
  const handleAddStickyNote = useCallback(() => {
    if (!reactFlowInstance || !contextMenu) return;

    // Convert screen coordinates to flow coordinates
    const position = reactFlowInstance.screenToFlowPosition({
      x: contextMenu.x,
      y: contextMenu.y,
    });

    const newNote: Node<CustomNodeData> = {
      id: `note-${Date.now()}`,
      type: "note",
      position,
      data: {
        label: "Sticky Note",
        nodeType: "note",
        dotColor: "#B3EFBD",
        borderColor: "from-purple-500 to-blue-500",
      },
    };

    setNodes((nds) => [...nds, newNote]);
  }, [reactFlowInstance, contextMenu]);

  // Handle select all
  const handleSelectAll = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        selected: true,
      }))
    );
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        selected: true,
      }))
    );
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
        onInit={setReactFlowInstance}
        onPaneContextMenu={onPaneContextMenu}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
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
        <Background
          color={gridColor}
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
