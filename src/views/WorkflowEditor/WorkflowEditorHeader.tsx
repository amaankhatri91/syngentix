import React, { useState, useEffect, useRef, useCallback } from "react";
import useTheme from "@/utils/hooks/useTheme";
import useIsSmallScreen from "@/utils/hooks/useIsSmallScreen";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  setEdgeThickness,
  setOpenSettings,
  setClipboard,
  clearClipboard,
  setPasteMode,
  ClipboardData,
} from "@/store/workflowEditor/workflowEditorSlice";
import { useUndoRedo } from "@/utils/hooks/useUndoRedo";
import { useSocketConnection } from "@/utils/hooks/useSocketConnection";
import { useParams } from "react-router-dom";
import { Node, Edge } from "reactflow";
import { CustomNodeData } from "./type";
import { toast } from "react-toastify";
import {
  getIconColor,
  getButtonStyles,
  getGroupedButtonStyles,
  getButtonBaseStyles,
  getContextMenuItemClass,
} from "@/utils/common";
import {
  ThicknessIcon,
  SelectIcon,
  CopyIcon,
  CutIcon,
  PasteIcon,
  UndoIcon,
  RedoIcon,
  CrownIcon,
  EditIcon,
  LayoutIcon,
  ChatIcon,
  ChevronDownIcon,
} from "@/assets/app-icons";
import TestRun from "@/assets/app-icons/TestRun";
import DownloadIcon from "@/assets/app-icons/DownloadIcon";
import SettingsIcon from "@/assets/app-icons/SettingsIcon";
import { EdgeThicknessOptions } from "@/constants/workflow.constant";
import Tooltip from "@/components/Tooltip";

const WorkflowEditorHeader = () => {
  const { isDark } = useTheme();
  const isSmallScreen = useIsSmallScreen();
  console.log(isSmallScreen, "Verify is Small Screen");
  const dispatch = useAppDispatch();
  const { workflowId } = useParams<{ workflowId: string }>();
  const { emit } = useSocketConnection();
  const { edgeThickness, nodes, edges, clipboard, isPasteMode, nodeList } = useAppSelector(
    (state) => state.workflowEditor
  );
  const { canUndo, canRedo, handleUndo, handleRedo } = useUndoRedo();

  // Debug logging for button state
  React.useEffect(() => {
    console.log("🎨 [HEADER] Undo/Redo button state:", {
      canUndo,
      canRedo,
      undoButtonDisabled: !canUndo,
      redoButtonDisabled: !canRedo,
    });
  }, [canUndo, canRedo]);
  const [isCopyDropdownOpen, setIsCopyDropdownOpen] = useState(false);
  const [isThicknessDropdownOpen, setIsThicknessDropdownOpen] = useState(false);
  const copyButtonRef = useRef<HTMLDivElement>(null);
  const thicknessButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        copyButtonRef.current &&
        !copyButtonRef.current.contains(event.target as Node)
      ) {
        setIsCopyDropdownOpen(false);
      }
      if (
        thicknessButtonRef.current &&
        !thicknessButtonRef.current.contains(event.target as Node)
      ) {
        setIsThicknessDropdownOpen(false);
      }
    };

    if (isCopyDropdownOpen || isThicknessDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [isCopyDropdownOpen, isThicknessDropdownOpen]);

  const handleCopyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCopyDropdownOpen(!isCopyDropdownOpen);
  };

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

  // Get selected nodes
  const selectedNodes = nodes.filter((node) => node.selected);
  const hasSelectedNodes = selectedNodes.length > 0;

  // Get connections between selected nodes
  const getConnectionsBetweenNodes = (
    selectedNodeIds: string[],
    allEdges: Edge[]
  ): Edge[] => {
    return allEdges.filter(
      (edge) =>
        selectedNodeIds.includes(edge.source) &&
        selectedNodeIds.includes(edge.target)
    );
  };

  const handleCopyNodesWithConnections = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCopyDropdownOpen(false);

    if (!hasSelectedNodes || !workflowId) {
      toast.warning("Please select nodes to copy");
      return;
    }

    const selectedNodeIds = selectedNodes.map((node) => node.id);
    const connections = getConnectionsBetweenNodes(selectedNodeIds, edges);

    // Store in clipboard (but don't enable paste mode yet)
    const clipboardData: ClipboardData = {
      nodes: selectedNodes,
      edges: connections,
      copyType: "copy",
      includeConnections: true,
    };
    dispatch(setClipboard(clipboardData));
    // Don't set paste mode - user must click Paste button first

    // Emit workflow:nodes_copy event
    emit("workflow:nodes_copy", {
      source_workflow_id: workflowId,
      destination_workflow_id: workflowId,
      type: "copy",
      node_ids: selectedNodeIds,
      include_connections: true,
    });

    const nodeCount = selectedNodes.length;
    const connectionCount = connections.length;
    toast.success(
      `Copied ${nodeCount} node${nodeCount !== 1 ? "s" : ""} and ${connectionCount} connection${connectionCount !== 1 ? "s" : ""}`
    );
  };

  const handleCopyNodesOnly = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCopyDropdownOpen(false);

    if (!hasSelectedNodes || !workflowId) {
      toast.warning("Please select nodes to copy");
      return;
    }

    const selectedNodeIds = selectedNodes.map((node) => node.id);

    // Store in clipboard (but don't enable paste mode yet)
    const clipboardData: ClipboardData = {
      nodes: selectedNodes,
      edges: [],
      copyType: "copy",
      includeConnections: false,
    };
    dispatch(setClipboard(clipboardData));
    // Don't set paste mode - user must click Paste button first

    // Emit workflow:nodes_copy event
    emit("workflow:nodes_copy", {
      source_workflow_id: workflowId,
      destination_workflow_id: workflowId,
      type: "copy",
      node_ids: selectedNodeIds,
      include_connections: false,
    });

    toast.success(`Copied ${selectedNodes.length} node(s)`);
  };

  const handleCut = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!hasSelectedNodes || !workflowId) {
      toast.warning("Please select nodes to cut");
      return;
    }

    const selectedNodeIds = selectedNodes.map((node) => node.id);
    
    // Check for entry nodes - they cannot be cut
    const entryNodeIds = selectedNodeIds.filter((nodeId) => isEntryNode(nodeId));
    if (entryNodeIds.length > 0) {
      toast.warning("Entry nodes cannot be cut");
      return;
    }
    
    const connections = getConnectionsBetweenNodes(selectedNodeIds, edges);

    // Store in clipboard with cut type
    const clipboardData: ClipboardData = {
      nodes: selectedNodes,
      edges: connections,
      copyType: "cut",
      includeConnections: true,
    };
    dispatch(setClipboard(clipboardData));

    // Emit workflow:nodes_copy event with type "cut"
    emit("workflow:nodes_copy", {
      source_workflow_id: workflowId,
      destination_workflow_id: workflowId,
      type: "cut",
      node_ids: selectedNodeIds,
      include_connections: true,
    });

    toast.success(`Cut ${selectedNodes.length} node(s)`);
  };

  const handlePaste = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!clipboard || !workflowId) {
      toast.warning("Nothing to paste");
      return;
    }

    // Enable paste mode - user needs to click on canvas
    dispatch(setPasteMode(true));
    toast.info("Click on canvas to paste");
  };

  const handleThicknessClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsThicknessDropdownOpen(!isThicknessDropdownOpen);
  };

  const handleThicknessSelect = (e: React.MouseEvent, thickness: number) => {
    e.stopPropagation();
    dispatch(setEdgeThickness(thickness));
    setIsThicknessDropdownOpen(false);
  };

  return (
    <div
      className={`flex items-center mt-6 justify-between gap-1 px-2 sm:px-3 py-2 rounded-xl ${
        isDark ? "bg-[#0F1724]" : "bg-white"
      } border ${
        isDark
          ? "border-[#2B3643]"
          : "border-[#E6E6E6] shadow-[1px_4px_6px_0px_#2154EE1A]"
      }`}
    >
      <div className={`flex gap-2 md:gap-2`}>
        <div className="relative" ref={thicknessButtonRef}>
          <Tooltip content="Thickness" position="bottom">
            <button
              className={`${getButtonStyles(isDark)}`}
              onClick={handleThicknessClick}
            >
              <ThicknessIcon color={getIconColor(isDark)} size={14} />
              <h5 className="hidden md:block">Thickness</h5>
              <ChevronDownIcon
                color={getIconColor(isDark)}
                size={12}
                className="ml-1 hidden md:block"
              />
            </button>
          </Tooltip>
          {isThicknessDropdownOpen && (
            <div
              className={`
                absolute top-full left-0 mt-1 z-50 rounded-2xl shadow-lg min-w-[200px]
                ${
                  isDark
                    ? "bg-[#0C1116] border border-[#394757]"
                    : "bg-white border border-[#E3E6EB]"
                }
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {EdgeThicknessOptions?.map((option, index) => {
                const isSelected = edgeThickness === option.value;
                return (
                  <React.Fragment key={option.value}>
                    {index > 0 && (
                      <div
                        className={`${
                          isDark ? "border-[#2B3643]" : "border-[#E3E6EB]"
                        } border-t`}
                      />
                    )}
                    <button
                      className={`${getContextMenuItemClass(isDark)} ${
                        isSelected
                          ? isDark
                            ? "bg-[#1E293B]"
                            : "bg-[#F5F7FA]"
                          : ""
                      }`}
                      onClick={(e) => handleThicknessSelect(e, option.value)}
                    >
                      <div className="flex items-center justify-between w-full gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`${
                              isDark ? "bg-[#8E8E93]" : "bg-[#8E8E93]"
                            }`}
                            style={{
                              width: "40px",
                              height: `${option.value}px`,
                              minHeight: "0.3px",
                            }}
                          />
                          <h5>{option.label}</h5>
                        </div>
                        <span
                          className={`text-xs ${
                            isDark ? "text-[#8E8E93]" : "text-[#737373]"
                          }`}
                        >
                          {option.display}
                        </span>
                      </div>
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
        <Tooltip content="Select" position="bottom">
          <button className={getButtonStyles(isDark)}>
            <SelectIcon color={getIconColor(isDark)} size={18} />
            <h5 className="hidden md:block">Select</h5>
          </button>
        </Tooltip>
      </div>
      <div className="flex gap-2 md:gap-2">
        <div className="flex">
          <div className="relative" ref={copyButtonRef}>
            <Tooltip content="Copy" position="bottom">
              <button
                className={`${getGroupedButtonStyles(isDark)} rounded-r-none ${
                  !hasSelectedNodes || clipboard?.copyType === "cut"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={handleCopyClick}
                disabled={!hasSelectedNodes || clipboard?.copyType === "cut"}
              >
                <CopyIcon color={getIconColor(isDark)} size={18} />
                <h5 className="hidden md:block">Copy</h5>
              </button>
            </Tooltip>
            {isCopyDropdownOpen && (
              <div
                className={`
                  absolute top-full left-0 mt-1 z-50 rounded-2xl shadow-lg min-w-[220px]
                  ${
                    isDark
                      ? "bg-[#0C1116] border border-[#394757]"
                      : "bg-white border border-[#E3E6EB]"
                  }
                `}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className={getContextMenuItemClass(isDark)}
                  onClick={handleCopyNodesWithConnections}
                >
                  <div className="flex items-center gap-3">
                    <h5>Copy nodes + connections</h5>
                  </div>
                </button>
                <div
                  className={`${
                    isDark ? "border-[#2B3643]" : "border-[#E3E6EB]"
                  } border-t`}
                />
                <button
                  className={getContextMenuItemClass(isDark)}
                  onClick={handleCopyNodesOnly}
                >
                  <div className="flex items-center gap-3">
                    <h5>Copy nodes only</h5>
                  </div>
                </button>
              </div>
            )}
          </div>
          <Tooltip content="Cut" position="bottom">
            <button
              className={`${getGroupedButtonStyles(isDark)} rounded-none ${
                !hasSelectedNodes ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleCut}
              disabled={!hasSelectedNodes}
            >
              <CutIcon color={getIconColor(isDark)} size={18} />
              <h5 className="hidden md:block">Cut</h5>
            </button>
          </Tooltip>
          <Tooltip content="Paste" position="bottom">
            <button
              className={`${getGroupedButtonStyles(isDark)} rounded-l-none ${
                !clipboard ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handlePaste}
              disabled={!clipboard}
            >
              <PasteIcon color={getIconColor(isDark)} size={18} />
              <h5 className="hidden md:block">Paste</h5>
            </button>
          </Tooltip>
        </div>
        <div className="flex">
          <Tooltip content="Undo" position="bottom">
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              className={`${getGroupedButtonStyles(isDark)} rounded-r-none ${
                !canUndo ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <UndoIcon color={getIconColor(isDark)} size={18} />
              <h5 className="hidden md:block">Undo</h5>
            </button>
          </Tooltip>
          <Tooltip content="Redo" position="bottom">
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              className={`${getGroupedButtonStyles(isDark)} rounded-l-none ${
                !canRedo ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <RedoIcon color={getIconColor(isDark)} size={18} />
              <h5 className="hidden md:block">Redo</h5>
            </button>
          </Tooltip>
        </div>
        <Tooltip content="Settings" position="bottom">
          <button
            onClick={() => dispatch(setOpenSettings(true))}
            className={`${getButtonBaseStyles(
              isDark
            )}  bg-gradient-to-r from-[#9133EA] to-[#2962EB] text-white hover:opacity-90`}
          >
            <SettingsIcon theme="dark" height={16} />
          </button>
        </Tooltip>
      </div>
      <div className="flex gap-2 md:gap-2">
        <Tooltip content="Edit Details" position="bottom">
          <button className={getButtonStyles(isDark)}>
            <EditIcon theme={isDark ? "dark" : "light"} height={18} />
            {!isSmallScreen && <h5>Edit Details</h5>}
          </button>
        </Tooltip>
        <Tooltip content="Layout" position="bottom">
          <button className={`${getButtonStyles(isDark)} relative`}>
            <LayoutIcon color={getIconColor(isDark)} size={18} />
            {!isSmallScreen && (
              <>
                <h5>Layout</h5>
                <ChevronDownIcon
                  color={getIconColor(isDark)}
                  size={12}
                  className="ml-1"
                />
              </>
            )}
          </button>
        </Tooltip>
        <Tooltip content="Test Run" position="bottom">
          <button
            className={`${getButtonBaseStyles(
              isDark
            )} bg-gradient-to-r from-[#9133EA] to-[#2962EB] hover:opacity-90`}
          >
            <TestRun color={"white"} size={18} />
            {!isSmallScreen && (
              <h5 className="font-normal text-white">Test Run</h5>
            )}
          </button>
        </Tooltip>
        <Tooltip content="Download" position="bottom">
          <button
            className={`${getButtonBaseStyles(
              isDark
            )} bg-gradient-to-r from-[#9133EA] to-[#2962EB] text-white hover:opacity-90`}
          >
            <DownloadIcon theme="dark" height={18} />
          </button>
        </Tooltip>
        <Tooltip content="Chat" position="bottom">
          <button className={getButtonStyles(isDark)}>
            <ChatIcon color={getIconColor(isDark)} size={18} />
            <h5 className="hidden md:block">Chat</h5>
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default WorkflowEditorHeader;
