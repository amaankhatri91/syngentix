import React, { useState, useRef, useEffect } from "react";
import { NodeProps, useReactFlow, useNodeId } from "reactflow";
import useTheme from "@/utils/hooks/useTheme";
import { DeleteIcon } from "@/assets/app-icons";
import { CustomNodeData } from "./dymmyData";

const WorkflowNoteNode: React.FC<NodeProps<CustomNodeData>> = ({
  data,
  selected,
}) => {
  const { isDark } = useTheme();
  const { setNodes } = useReactFlow();
  const nodeId = useNodeId();
  const [isEditing, setIsEditing] = useState(false);
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
    setIsEditing(true);
    setEditValue(data.label || "");
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
    }
    setIsEditing(false);
  };

  // Handle canceling edit
  const handleCancel = () => {
    setEditValue(data.label || "");
    setIsEditing(false);
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

  // Note nodes have no border, no border radius, and a fixed background color
  // Add border when editing
  const nodeStyle: React.CSSProperties = {
    backgroundColor: isEditing ? "#94D29E" : "#B3EFBD",
    border: "none",
    borderRadius: 0,
    boxShadow: selected ? "0px 2px 20px 0px rgba(105, 70, 235, 0.18)" : "none",
  };

  return (
    <div
        className={`
          px-2 pt-2 pb-4 w-[200px]  min-h-[160px] relative
          transition-all duration-200
        `}
        style={nodeStyle}
        onDoubleClick={handleDoubleClick}
      >
        <div className="flex justify-between items-center mb-2">
          <div className={`font-medium text-[#162230] text-[14px] flex-1`}>
            Note
          </div>
          <div className="cursor-pointer" onClick={(e) => e.stopPropagation()}>
            <DeleteIcon color="#162230" height={18} />
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
