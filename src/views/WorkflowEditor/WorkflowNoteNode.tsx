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
  position,
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

  // Focus textarea when entering edit mode and set cursor to end
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  // Handle double-click to enter edit mode
  const handleDoubleClick = () => {
    if (nodeId) {
      dispatch(setNoteEditing({ nodeId, isEditing: true }));
      setEditValue(data.label || "");
    }
  };

  // Handle saving the edited text
  const handleSave = () => {
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

  // Handle update button click - emit note:update event
  const handleUpdate = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(nodeId, workflowId, "Verify Notes Hitting");
    if (nodeId && workflowId) {
      const currentNode = getNode(nodeId);
      const currentPosition = currentNode?.position ||
        position || { x: 0, y: 0 };
      // Emit note:update event
      emit("note:update", {
        workflow_id: workflowId,
        id: nodeId,
        title: editValue.trim() || data.label || "New Note",
        content: editValue.trim() || data.label || "",
        position: {
          x: currentPosition.x,
          y: currentPosition.y,
        },
        data: {
          bgcolor: "#B3EFBD",
          color: "#162230",
          height: 160,
          width: 200,
        },
      });
      console.log("✏️ Note update event emitted:", {
        workflow_id: workflowId,
        id: nodeId,
        title: editValue.trim() || data.label,
        position: currentPosition,
      });

      // Save the changes locally and exit edit mode
      handleSave();
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
        <div className="flex gap-1">
          {isEditing && (
            <div className="cursor-pointer " onClick={handleUpdate}>
              <EditIcon theme={"light"} height={18} />
            </div>
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
          onBlur={handleSave}
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
