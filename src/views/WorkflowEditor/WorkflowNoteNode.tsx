import React from "react";
import { NodeProps } from "reactflow";
import useTheme from "@/utils/hooks/useTheme";
import { getNodeTextColor } from "@/utils/common";
import { CustomNodeData } from "./dummy";

const WorkflowNoteNode: React.FC<NodeProps<CustomNodeData>> = ({
  data,
  selected,
}) => {
  const { isDark } = useTheme();

  // Note nodes have no border, no border radius, and a fixed background color
  const nodeStyle: React.CSSProperties = {
    backgroundColor: "#B3EFBD",
    border: "none",
    borderRadius: 0,
    boxShadow: selected ? "0px 2px 20px 0px rgba(105, 70, 235, 0.18)" : "none",
  };

  return (
    <div
      className={`
        px-3 pt-2 pb-4 min-w-[200px] min-h-[160px] relative
        transition-all duration-200
      `}
      style={nodeStyle}
    >
      {/* Node Label */}
      <div className={`font-normal mb-3 text-[#162230]`}>{data.label}</div>
      {/* Note nodes have no connection handles */}
    </div>
  );
};

export default WorkflowNoteNode;
