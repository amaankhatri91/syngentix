import React from "react";
import { useReactFlow } from "reactflow";
import useTheme from "@/utils/hooks/useTheme";
import ZoomIn from "@/assets/app-icons/ZoomIn";
import ZoomOut from "@/assets/app-icons/ZoomOut";
import FitView from "@/assets/app-icons/FitView";
import Unlock from "@/assets/app-icons/Unlock";
import Lock from "@/assets/app-icons/Lock";
import MinimapIcon from "@/assets/app-icons/MinimapIcon";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  toggleLock,
  toggleMinimap,
} from "@/store/workflowEditor/workflowEditorSlice";

const WorkflowEditorControls: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLocked = useAppSelector((state) => state.workflowEditor.isLocked);
  const minimapVisible = useAppSelector(
    (state) => state.workflowEditor.minimapVisible
  );

  const handleToggleLock = () => {
    dispatch(toggleLock());
  };

  const handleToggleMinimap = () => {
    dispatch(toggleMinimap());
  };

  const { isDark } = useTheme();
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const iconColor = isDark ? "#FFFFFF" : "#162230";
  const iconSize = 14;
  const bgColor = isDark ? "#0C1116" : "#F5F7FA";
  const borderColor = isDark ? "#394757" : "#E3E6EB";

  return (
    <div className="absolute top-2 right-2 flex flex-col gap-2 rounded-xl p-1 z-50">
      <button
        type="button"
        onClick={() => zoomIn()}
        className="flex items-center justify-center w-8 h-8 rounded-lg hover:opacity-80 transition-opacity border cursor-pointer"
        style={{
          backgroundColor: "transparent",
          borderColor: borderColor,
        }}
        aria-label="Zoom In"
      >
        <ZoomIn color={iconColor} size={iconSize} />
      </button>
      <button
        type="button"
        onClick={() => zoomOut()}
        className="flex items-center justify-center w-8 h-8 rounded-lg hover:opacity-80 transition-opacity border cursor-pointer"
        style={{
          backgroundColor: "transparent",
          borderColor: borderColor,
        }}
        aria-label="Zoom Out"
      >
        <ZoomOut color={iconColor} size={iconSize} />
      </button>
      <button
        type="button"
        onClick={() => {
          fitView({ padding: 0.2, duration: 300 });
        }}
        className="flex items-center justify-center w-8 h-8 rounded-lg hover:opacity-80 transition-opacity border cursor-pointer"
        style={{
          backgroundColor: "transparent",
          borderColor: borderColor,
        }}
        aria-label="Fit View"
      >
        <FitView color={iconColor} size={iconSize} />
      </button>
      <button
        type="button"
        onClick={handleToggleMinimap}
        className="flex items-center justify-center w-8 h-8 rounded-lg hover:opacity-80 transition-opacity border cursor-pointer"
        style={{
          backgroundColor: minimapVisible
            ? isDark
              ? "rgba(57, 71, 87, 0.5)"
              : "rgba(227, 230, 235, 0.5)"
            : "transparent",
          borderColor: borderColor,
        }}
        aria-label={minimapVisible ? "Hide Minimap" : "Show Minimap"}
      >
        <MinimapIcon color={iconColor} size={iconSize} />
      </button>
      <button
        type="button"
        onClick={handleToggleLock}
        className="flex items-center justify-center w-8 h-8 rounded-lg hover:opacity-80 transition-opacity border cursor-pointer"
        style={{
          backgroundColor: "transparent",
          borderColor: borderColor,
        }}
        aria-label={isLocked ? "Unlock" : "Lock"}
      >
        {isLocked ? (
          <Lock color={iconColor} size={iconSize} />
        ) : (
          <Unlock color={iconColor} size={iconSize} />
        )}
      </button>
    </div>
  );
};

export default WorkflowEditorControls;
