import React, { useState, useRef, useEffect } from "react";
import { NodeProps, useReactFlow, useNodeId } from "reactflow";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store";
import { setNoteEditing } from "@/store/workflowEditor/workflowEditorSlice";
import useTheme from "@/utils/hooks/useTheme";
import { useSocketConnection } from "@/utils/hooks/useSocketConnection";
import { getNoteNodeStyle } from "@/utils/common";
import { DeleteIcon, EditIcon } from "@/assets/app-icons";
import { CustomNodeData } from "./type";

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


  return (
    <div
      className={`
          px-2 pt-2 pb-4 w-[200px]  min-h-[160px] relative
          transition-all duration-200
        `}
      style={getNoteNodeStyle(isEditing, selected)}
      onDoubleClick={handleDoubleClick}
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
          <div className="cursor-pointer" onClick={handleDelete}>
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
          className="w-full h-[115px] text-[14px] text-[#162230] bg-transparent resize-none focus:outline-none overflow-y-auto note-scrollbar"
          style={{
            fontFamily: "inherit",
            lineHeight: "1.5",
            scrollbarWidth: "thin",
            scrollbarColor: "#162230 #B3EFBD",
          }}
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          placeholder="Type your note here..."
        />
      ) : (
        <div className="text-[#162230] text-[14px] whitespace-pre-wrap break-words min-h-[120px] max-h-[130px] overflow-y-auto note-no-scrollbar">
          {data.label || "Double-click to edit"}
        </div>
      )}
    </div>
  );
};

export default WorkflowNoteNode;
