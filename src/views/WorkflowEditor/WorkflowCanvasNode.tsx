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

const WorkflowCanvasNode: React.FC<NodeProps<CustomNodeData>> = ({
  data,
  selected,
}) => {
  const { isDark } = useTheme();
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

  return (
    <div
      className={`
        ${getNodeBgColor(isDark)}
        !rounded-2xl px-4 pt-2 pb-4 min-w-[200px] min-h-[140px] relative
        transition-all duration-200
      `}
      style={gradientBorderStyle}
    >
      {/* Dot indicator - top right */}
      <div className="absolute top-2 right-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: data.dotColor }}
        />
      </div>
      {/* Node Label */}
      <div className={`font-normal mb-3 ${getNodeTextColor(isDark)} pr-6`}>
        {data.label}
      </div>
      {/* Input Handles */}
      {data.inputs && data.inputs.length > 0 && (
        <div className="mb-2">
          {data.inputs.map((input, index) => {
            const baseTop = 50 + index * 30;
            return (
              <div
                key={input}
                className="absolute flex items-center"
                style={{
                  top: `${baseTop}px`,
                }}
              >
                <Handle
                  type="target"
                  position={Position.Left}
                  id={input}
                  className={`${getPortColor(
                    isDark
                  )} w-3 h-3 border-2 border-[#FFFFFF]`}
                  style={{ left: -23 }}
                />
                <span
                  className={`text-xs ${
                    isDark ? "text-[#FFFFFF]" : "text-[#162230]"
                  } `}
                >
                  {input}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Output Handles */}
      {data.outputs && data.outputs.length > 0 && (
        <div className="mt-3 space-y-2">
          {data.outputs.map((output, index) => (
            <div
              key={output}
              className="relative flex items-center justify-end gap-2"
            >
              <span
                className={`text-sm font-normal ${
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
                )} w-3 h-3 border-2 border-[#FFFFFF]`}
                style={{ right: -23 }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkflowCanvasNode;
