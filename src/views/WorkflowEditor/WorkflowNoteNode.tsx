import React, { useState, useRef, useEffect, useCallback } from "react";
import { NodeProps, useReactFlow, useNodeId } from "reactflow";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setNoteEditing,
  setNoteResizing,
} from "@/store/workflowEditor/workflowEditorSlice";
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
  const { editingNotes, resizingNotes } = useAppSelector(
    (state) => state.workflowEditor
  );

  const isEditing = nodeId ? editingNotes[nodeId] || false : false;
  const isResizing = nodeId ? resizingNotes[nodeId] || false : false;

  // State declarations
  const [editValue, setEditValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const isUpdatingRef = useRef(false);

  // Resize state - must be declared before useEffect that uses it
  const [isHovered, setIsHovered] = useState(false);
  const [isResizingLocal, setIsResizingLocal] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const nodeRef = useRef<HTMLDivElement>(null);

  const resizeRef = useRef<{
    direction: ResizeDirection;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startPos: { x: number; y: number };
  } | null>(null);

  // Get current dimensions with fallback to defaults
  const currentWidth = data.width ?? 200;
  const currentHeight = data.height ?? 160;

  // Focus textarea when entering edit mode and set cursor to end
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [isEditing, nodeId]);

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
      return;
    }

    // Don't save if the blur is caused by clicking the edit button
    const relatedTarget = e?.relatedTarget as HTMLElement;
    if (relatedTarget && editButtonRef.current?.contains(relatedTarget)) {
      return;
    }

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
    }
  };

  /* ---------------- RESIZE (n8n STYLE) ---------------- */

  const handleResizeStart = useCallback(
    (e: React.PointerEvent, direction: ResizeDirection) => {
      e.preventDefault();
      e.stopPropagation();

      if (!nodeId || isEditing) return;

      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

      const node = getNode(nodeId);
      if (!node) return;

      setIsResizingLocal(true);
      dispatch(setNoteResizing({ nodeId, isResizing: true }));

      resizeRef.current = {
        direction,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: currentWidth,
        startHeight: currentHeight,
        startPos: { ...node.position },
      };
    },
    [nodeId, isEditing, currentWidth, currentHeight]
  );

  const handleResizeMove = useCallback(
    (e: PointerEvent) => {
      if (!resizeRef.current || !nodeId) return;
      const { direction, startX, startY, startWidth, startHeight, startPos } =
        resizeRef.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      let width = startWidth;
      let height = startHeight;
      let pos = { ...startPos };
      if (direction === "right") width = Math.max(150, startWidth + dx);
      if (direction === "bottom")
        height = Math.max(MIN_HEIGHT, startHeight + dy);
      if (direction === "left") {
        width = Math.max(150, startWidth - dx);
        pos.x = startPos.x + (startWidth - width);
      }
      if (direction === "top") {
        height = Math.max(MIN_HEIGHT, startHeight - dy);
        pos.y = startPos.y + (startHeight - height);
      }
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                position: pos,
                data: { ...n.data, width, height },
              }
            : n
        )
      );
    },
    [nodeId]
  );

  const handleResizeEnd = useCallback(() => {
    if (!resizeRef.current || !nodeId || !workflowId) return;
    const node = getNode(nodeId);
    if (!node) return;
    emit("note:update", {
      workflow_id: workflowId,
      id: nodeId,
      label: node.data.label,
      position: node.position,
      width: node.data.width,
      height: node.data.height,
    });
    resizeRef.current = null;
    setIsResizingLocal(false);
    dispatch(setNoteResizing({ nodeId, isResizing: false }));
  }, [nodeId, workflowId]);

  useEffect(() => {
    if (!isResizingLocal) return;
    document.addEventListener("pointermove", handleResizeMove);
    document.addEventListener("pointerup", handleResizeEnd);
    return () => {
      document.removeEventListener("pointermove", handleResizeMove);
      document.removeEventListener("pointerup", handleResizeEnd);
    };
  }, [isResizingLocal, handleResizeMove, handleResizeEnd]);

  /* ---------------- DRAG LOCK ---------------- */
  useEffect(() => {
    if (!nodeId) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === nodeId
          ? { ...n, draggable: !(isEditing || isResizingLocal || isResizing) }
          : n
      )
    );
  }, [isEditing, isResizingLocal, isResizing]);

  const showHandles = !isEditing && (isHovered || isResizingLocal);

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
      onMouseEnter={() => {
        // Clear any pending timeout
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = null;
        }
        if (!isEditing) {
          setIsHovered(true);
        }
      }}
      onMouseLeave={(e) => {
        // Add a small delay before hiding handles to allow clicking on them
        // Check if we're moving to a resize handle
        const target = e.relatedTarget as HTMLElement;
        if (target && nodeRef.current?.contains(target)) {
          return; // Don't hide if moving to a child element
        }
        hoverTimeoutRef.current = setTimeout(() => {
          if (!isResizingLocal) {
            setIsHovered(false);
          }
        }, 100); // 100ms delay
      }}
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
                e.stopPropagation();
                e.preventDefault(); // Prevent blur from textarea
                // Set flag immediately to prevent blur save
                isUpdatingRef.current = true;
              }}
              onClick={(e) => {
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
                  // Exit edit mode
                  dispatch(setNoteEditing({ nodeId, isEditing: false }));
                  // Reset flag after a short delay to allow state updates to complete
                  setTimeout(() => {
                    isUpdatingRef.current = false;
                  }, 200);
                }
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

      {showHandles && (
        <>
          <div
            className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize"
            onPointerDown={(e) => handleResizeStart(e, "right")}
          />
          <div
            className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize"
            onPointerDown={(e) => handleResizeStart(e, "left")}
          />
          <div
            className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize"
            onPointerDown={(e) => handleResizeStart(e, "top")}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize"
            onPointerDown={(e) => handleResizeStart(e, "bottom")}
          />
        </>
      )}
    </div>
  );
};

export default WorkflowNoteNode;
