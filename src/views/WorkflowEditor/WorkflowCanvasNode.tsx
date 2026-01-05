import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import useTheme from "@/utils/hooks/useTheme";
import {
  getNodeBgColor,
  getNodeTextColor,
  getPortColor,
  getNodeBorderGradient,
  getNodeDropShadow,
} from "@/utils/common";
import { CustomNodeData } from "./dymmyData";
import { useAppSelector } from "@/store";

const WorkflowCanvasNode: React.FC<NodeProps<any>> = ({ data, selected }) => {
  const { isDark } = useTheme();
  const { nodes, edges, isLocked } = useAppSelector(
    (state) => state.workflowEditor
  );

  console.log(nodes, data, "Verify nodes data");

  const gradient = getNodeBorderGradient();
  const dropShadow = getNodeDropShadow();
  const bgColorValue = isDark ? "#0C1116" : "#FFFFFF";

  // Active/Selected node styles
  const activeBorderWidth = "2px";
  const activeGradientStart = "#48D8D1";
  const activeGradientEnd = "#096DBF";
  const activeDropShadow = "0px 2px 20px 0px rgba(105, 70, 235, 0.18)";

  // Default styles
  const defaultBorderWidth = "1.5px";

  const borderWidth = selected ? activeBorderWidth : defaultBorderWidth;
  const borderGradientStart = selected ? activeGradientStart : gradient.start;
  const borderGradientEnd = selected ? activeGradientEnd : gradient.end;
  const shadow = selected ? activeDropShadow : dropShadow;

  const gradientBorderStyle: React.CSSProperties = {
    background: `
      linear-gradient(${bgColorValue}, ${bgColorValue}) padding-box,
      linear-gradient(90deg, ${borderGradientStart}, ${borderGradientEnd}) border-box
    `,
    border: `${borderWidth} solid transparent`,
    borderRadius: "0.5rem",
    boxShadow: shadow,
  };

  // Calculate minimum width based on longest label
  const allLabels = [
    data.label,
    ...(data.inputs || []),
    ...(data.outputs || []),
  ];
  const longestLabel = allLabels.reduce(
    (longest, label) => (label.length > longest.length ? label : longest),
    ""
  );
  // Estimate width: ~8px per character + padding
  const estimatedWidth = Math.max(200, longestLabel.length * 8 + 80);

  // Calculate minimum height based on number of inputs and outputs
  const inputCount = data.inputs?.length || 0;
  const outputCount = data.outputs?.length || 0;
  const maxCount = Math.max(inputCount, outputCount);
  // Base height: label (40px) + spacing + (maxCount * 32px per item) + padding
  const estimatedHeight = Math.max(140, 40 + maxCount * 32 + 40);

  return (
    <div
      className={`
        ${getNodeBgColor(isDark)}
        !rounded-2xl px-4 pt-2 pb-4 relative
        transition-all duration-200
        flex flex-col
      `}
      style={{
        ...gradientBorderStyle,
        minWidth: `${estimatedWidth}px`,
        minHeight: `${estimatedHeight}px`,
      }}
    >
      {/* Dot indicator - top right */}
      <div className="absolute top-2 right-2 z-10">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: data.dotColor }}
        />
      </div>
      {/* Node Label */}
      <div className={`font-normal mb-3 ${getNodeTextColor(isDark)} pr-6`}>
        {data.label}
      </div>
      {/* Content Container */}
      <div className="flex-1 flex gap-4">
        {/* Input Handles - Left Side */}
        {data.inputs && data.inputs.length > 0 && (
          <div className="flex flex-col gap-3 flex-1">
            {data.inputs.map((input) => (
              <div
                key={input}
                className="flex items-center gap-2 relative"
                style={{ minHeight: "24px" }}
              >
                <Handle
                  type="target"
                  position={Position.Left}
                  id={input}
                  className={`${getPortColor(
                    isDark
                  )} w-3 h-3 border-2 border-[#FFFFFF] flex-shrink-0`}
                  style={{ left: -23 }}
                />
                <span
                  className={`text-xs whitespace-nowrap ${
                    isDark ? "text-[#FFFFFF]" : "text-[#162230]"
                  }`}
                >
                  {input}
                </span>
              </div>
            ))}
          </div>
        )}
        {/* Output Handles - Right Side */}
        {data.outputs && data.outputs.length > 0 && (
          <div className="flex flex-col gap-3 flex-1">
            {data.outputs.map((output) => (
              <div
                key={output}
                className="flex items-center justify-end gap-2 relative"
                style={{ minHeight: "24px" }}
              >
                <span
                  className={`text-xs font-normal whitespace-nowrap ${
                    isDark ? "text-[#FFFFFF]" : "text-[#162230]"
                  }`}
                >
                  {output}
                </span>
                <Handle
                  type="source"
                  position={Position.Right}
                  id={output}
                  className={`${getPortColor(
                    isDark
                  )} w-3 h-3 border-2 border-[#FFFFFF] flex-shrink-0`}
                  style={{ right: -23 }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowCanvasNode;
