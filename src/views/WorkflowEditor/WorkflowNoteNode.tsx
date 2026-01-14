import React, { useState, useRef, useEffect, useCallback } from "react";
import { NodeProps, useReactFlow, useNodeId } from "reactflow";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store";
import { setNoteEditing } from "@/store/workflowEditor/workflowEditorSlice";
import useTheme from "@/utils/hooks/useTheme";
import { useSocketConnection } from "@/utils/hooks/useSocketConnection";
import { getNoteNodeStyle } from "@/utils/common";
import { DeleteIcon, EditIcon } from "@/assets/app-icons";
import { CustomNodeData } from "./type";

// Default dimensions
const DEFAULT_WIDTH = 200;
const DEFAULT_HEIGHT = 160;
const MIN_WIDTH = 150;
const MIN_HEIGHT = 120;

type ResizeDirection = "top" | "right" | "bottom" | "left";

const WorkflowNoteNode: React.FC<NodeProps<CustomNodeData>> = ({
  data,
  selected,
}) => {
  const { setNodes, getNode } = useReactFlow();
  const nodeId = useNodeId();
  const { workflowId } = useParams<{ workflowId: string }>();
  const { emit } = useSocketConnection();
  const dispatch = useAppDispatch();
  const { isDark } = useTheme();
  const { editingNotes } = useAppSelector((state) => state.workflowEditor);
  const isEditing = nodeId ? editingNotes[nodeId] || false : false;
  const [editValue, setEditValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const isUpdatingRef = useRef(false);
  
  // Resize state
  const [isHovered, setIsHovered] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef<{
    direction: ResizeDirection;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startPosition: { x: number; y: number };
  } | null>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  
  // Get current dimensions with fallback to defaults
  const currentWidth = data.width ?? DEFAULT_WIDTH;
  const currentHeight = data.height ?? DEFAULT_HEIGHT;

  // Focus textarea when entering edit mode and set cursor to end
  useEffect(() => {
    console.log("🔄 Edit mode changed:", { isEditing, nodeId });
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [isEditing, nodeId]);

  // Debug: Log when edit button ref is available
  useEffect(() => {
    if (isEditing && editButtonRef.current) {
      console.log("✅ Edit button rendered and ref available");
    }
  }, [isEditing]);

  // Handle double-click to enter edit mode
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the modal from opening
    if (nodeId) {
      dispatch(setNoteEditing({ nodeId, isEditing: true }));
      setEditValue(data.label || "");
    }
  };

  // Handle saving the edited text
  const handleSave = (e?: React.FocusEvent<HTMLTextAreaElement>) => {
    // Don't save if we're in the process of updating via the edit button
    if (isUpdatingRef.current) {
      console.log("⏸️ Save prevented - update in progress");
      return;
    }

    // Don't save if the blur is caused by clicking the edit button
    const relatedTarget = e?.relatedTarget as HTMLElement;
    if (relatedTarget && editButtonRef.current?.contains(relatedTarget)) {
      console.log("⏸️ Save prevented - edit button clicked");
      return;
    }

    console.log("💾 handleSave called", { nodeId, editValue });

    if (nodeId) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                label: editValue.trim() || data.label,
              },
            };
          }
          return node;
        })
      );
      dispatch(setNoteEditing({ nodeId, isEditing: false }));
    }
  };

  // Handle canceling edit
  const handleCancel = () => {
    setEditValue(data.label || "");
    if (nodeId) {
      dispatch(setNoteEditing({ nodeId, isEditing: false }));
    }
  };

  // Handle key press in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  // Handle delete button click
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (nodeId && workflowId) {
      // Emit note:delete event
      emit("note:delete", {
        workflow_id: workflowId,
        id: nodeId,
      });
      console.log("🗑️ Note delete event emitted:", {
        workflow_id: workflowId,
        id: nodeId,
      });
    }
  };

  // Handle resize start
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, direction: ResizeDirection) => {
      e.stopPropagation();
      e.preventDefault();

      if (!nodeId || isEditing) return;

      const currentNode = getNode(nodeId);
      if (!currentNode) return;

      setIsResizing(true);
      resizeStartRef.current = {
        direction,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: currentWidth,
        startHeight: currentHeight,
        startPosition: { ...currentNode.position },
      };
    },
    [nodeId, isEditing, currentWidth, currentHeight, getNode, setNodes]
  );

  // Handle resize move
  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !resizeStartRef.current || !nodeId) return;
      
      const { direction, startX, startY, startWidth, startHeight, startPosition } =
        resizeStartRef.current;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newPosition = { ...startPosition };
      
      // Calculate new dimensions based on resize direction
      switch (direction) {
        case "right":
          newWidth = Math.max(MIN_WIDTH, startWidth + deltaX);
          break;
        case "left":
          newWidth = Math.max(MIN_WIDTH, startWidth - deltaX);
          // Adjust position: move right by the amount width decreased
          const widthDiff = startWidth - newWidth;
          newPosition.x = startPosition.x + widthDiff;
          break;
        case "bottom":
          newHeight = Math.max(MIN_HEIGHT, startHeight + deltaY);
          break;
        case "top":
          newHeight = Math.max(MIN_HEIGHT, startHeight - deltaY);
          // Adjust position: move down by the amount height decreased
          const heightDiff = startHeight - newHeight;
          newPosition.y = startPosition.y + heightDiff;
          break;
      }
      
      // Update node dimensions and position
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              position: newPosition,
              data: {
                ...node.data,
                width: newWidth,
                height: newHeight,
              },
            };
          }
          return node;
        })
      );
    },
    [isResizing, nodeId, setNodes]
  );

  // Handle resize end
  const handleResizeEnd = useCallback(() => {
    if (!isResizing || !resizeStartRef.current || !nodeId || !workflowId) {
      return;
    }

    const currentNode = getNode(nodeId);
    if (!currentNode) return;

    const finalWidth = currentNode.data.width ?? currentWidth;
    const finalHeight = currentNode.data.height ?? currentHeight;

    // Emit resize event
    emit("note:resize", {
      workflow_id: workflowId,
      id: nodeId,
      width: finalWidth,
      height: finalHeight,
    });

    setIsResizing(false);
    resizeStartRef.current = null;
  }, [isResizing, nodeId, workflowId, currentWidth, currentHeight, getNode, setNodes, emit]);

  // Set up global mouse event listeners for resize
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleResizeMove);
      document.addEventListener("mouseup", handleResizeEnd);
      
      return () => {
        document.removeEventListener("mousemove", handleResizeMove);
        document.removeEventListener("mouseup", handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  // Keep node from dragging while editing or resizing
  useEffect(() => {
    if (!nodeId) return;

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id !== nodeId) return node;

        // Disable drag if editing text or resizing
        if (isEditing || isResizing) {
          if (node.draggable === false) return node;
          return { ...node, draggable: false };
        }

        // Re-enable drag when not editing or resizing
        if (node.draggable === true || typeof node.draggable === "undefined") {
          return node;
        }

        return { ...node, draggable: true };
      })
    );
  }, [nodeId, isEditing, isResizing, setNodes]);


  return (
    <div
      ref={nodeRef}
      className={`
          px-2 pt-2 pb-4 relative
          transition-all duration-200
        `}
      style={{
        ...getNoteNodeStyle(isEditing, selected),
        width: `${currentWidth}px`,
        minHeight: `${currentHeight}px`,
      }}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => !isEditing && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center mb-2">
        <div className={`font-medium text-[#162230] text-[14px] flex-1`}>
          Note
        </div>
        <div className="flex gap-2">
          {isEditing && (
            <button
              ref={editButtonRef}
              type="button"
              className="cursor-pointer bg-transparent border-none p-0 focus:outline-none relative z-10"
              onMouseDown={(e) => {
                console.log("🖱️ Button onMouseDown triggered FIRST", {
                  nodeId,
                  isEditing,
                });
                e.stopPropagation();
                e.preventDefault(); // Prevent blur from textarea
                // Set flag immediately to prevent blur save
                isUpdatingRef.current = true;
              }}
              onClick={(e) => {
                console.log("🔵 Button onClick triggered", {
                  nodeId,
                  isEditing,
                });
                e.stopPropagation();
                e.preventDefault();

                // Save and emit note:update event
                if (nodeId && workflowId) {
                  // Get the current node to access its position
                  const currentNode = getNode(nodeId);
                  const currentPosition = currentNode?.position || {
                    x: 0,
                    y: 0,
                  };

                  console.log("📝 Preparing to save note:", {
                    workflow_id: workflowId,
                    id: nodeId,
                    currentValue: editValue,
                    originalValue: data.label,
                    position: currentPosition,
                  });

                  // Save the note
                  setNodes((nds) =>
                    nds.map((node) => {
                      if (node.id === nodeId) {
                        return {
                          ...node,
                          data: {
                            ...node.data,
                            label: editValue.trim() || data.label,
                          },
                        };
                      }
                      return node;
                    })
                  );

                  // Emit note:update event with current position
                  emit("note:update", {
                    workflow_id: workflowId,
                    id: nodeId,
                    label: editValue.trim() || data.label,
                    position: currentPosition,
                  });
                  console.log(
                    "💾 Note update event emitted with position:",
                    currentPosition
                  );
                  // Exit edit mode
                  dispatch(setNoteEditing({ nodeId, isEditing: false }));
                  // Reset flag after a short delay to allow state updates to complete
                  setTimeout(() => {
                    isUpdatingRef.current = false;
                    console.log("🔄 isUpdatingRef reset to false");
                  }, 200);
                } else {
                  console.warn(
                    "⚠️ Cannot save note - missing nodeId or workflowId",
                    {
                      nodeId,
                      workflowId,
                    }
                  );
                }
              }}
              onMouseUp={(e) => {
                console.log("🖱️ Button onMouseUp triggered");
                e.stopPropagation();
              }}
            >
              <div style={{ pointerEvents: "none" }}>
                <EditIcon theme={"light"} height={18} />
              </div>
            </button>
          )}
          <div className="cursor-pointer relative z-30" onClick={handleDelete}>
            <DeleteIcon color="#162230" height={18} />
          </div>
        </div>
      </div>
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={(e) => {
            console.log("📝 Textarea blur event", {
              relatedTarget: e.relatedTarget,
              isUpdating: isUpdatingRef.current,
              editButtonRef: editButtonRef.current,
            });
            handleSave(e);
          }}
          onKeyDown={handleKeyDown}
          className="w-full text-[14px] text-[#162230] bg-transparent resize-none focus:outline-none overflow-y-auto note-scrollbar"
          style={{
            fontFamily: "inherit",
            lineHeight: "1.5",
            scrollbarWidth: "thin",
            scrollbarColor: "#162230 #B3EFBD",
            height: `${Math.max(80, currentHeight - 54)}px`,
          }}
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          placeholder="Type your note here..."
        />
      ) : (
        <div
          className="text-[#162230] text-[14px] whitespace-pre-wrap break-words overflow-y-auto note-no-scrollbar"
          style={{
            minHeight: `${Math.max(80, currentHeight - 54)}px`,
            maxHeight: `${Math.max(80, currentHeight - 54)}px`,
          }}
        >
          {data.label || "Double-click to edit"}
        </div>
      )}
      
      {/* Resize handles - only show on hover and when not editing */}
      {!isEditing && isHovered && (
        <>
          {/* Top handle */}
          <div
            className="absolute top-0 left-0 right-0 h-1 cursor-ns-resize z-20 group"
            style={{
              background: "transparent",
            }}
            onMouseDown={(e) => handleResizeStart(e, "top")}
          >
            <div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-[#162230] opacity-40 group-hover:opacity-60 transition-opacity"
              style={{ marginTop: "-2px" }}
            />
          </div>
          
          {/* Right handle */}
          <div
            className="absolute top-0 bottom-0 right-0 w-1 cursor-ew-resize z-20 group"
            style={{
              background: "transparent",
            }}
            onMouseDown={(e) => handleResizeStart(e, "right")}
          >
            <div
              className="absolute right-0 top-1/2 transform -translate-y-1/2 h-8 w-0.5 bg-[#162230] opacity-40 group-hover:opacity-60 transition-opacity"
              style={{ marginRight: "-2px" }}
            />
          </div>
          
          {/* Bottom handle */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize z-20 group"
            style={{
              background: "transparent",
            }}
            onMouseDown={(e) => handleResizeStart(e, "bottom")}
          >
            <div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-[#162230] opacity-40 group-hover:opacity-60 transition-opacity"
              style={{ marginBottom: "-2px" }}
            />
          </div>
          
          {/* Left handle */}
          <div
            className="absolute top-0 bottom-0 left-0 w-1 cursor-ew-resize z-20 group"
            style={{
              background: "transparent",
            }}
            onMouseDown={(e) => handleResizeStart(e, "left")}
          >
            <div
              className="absolute left-0 top-1/2 transform -translate-y-1/2 h-8 w-0.5 bg-[#162230] opacity-40 group-hover:opacity-60 transition-opacity"
              style={{ marginLeft: "-2px" }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default WorkflowNoteNode;
