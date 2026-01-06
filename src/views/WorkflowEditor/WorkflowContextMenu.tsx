import React, { useEffect, useRef } from "react";
import useTheme from "@/utils/hooks/useTheme";
import { ReactFlowInstance } from "reactflow";
import ChevronRightIcon from "@/assets/app-icons/ChevronRightIcon";
import {
  getIconColor,
  getContextMenuItemClass,
  getContextMenuSeparatorClass,
} from "@/utils/common";
import { useAppDispatch } from "@/store";
import { setOpenNodeList } from "@/store/workflowEditor/workflowEditorSlice";
import { useSocketConnection } from "@/utils/hooks/useSocketConnection";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  workflowId: string;
  reactFlowInstance: ReactFlowInstance | null;
}

const WorkflowContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onClose,
  workflowId,
  reactFlowInstance,
}) => {
  const { isDark } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { emit } = useSocketConnection();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    // Add event listeners
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const menuItemClass = getContextMenuItemClass(isDark);
  const separatorClass = getContextMenuSeparatorClass(isDark);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={menuRef}
      onClick={handleMenuClick}
      className={`
        fixed z-50 rounded-2xl shadow-lg min-w-[200px]
        ${
          isDark
            ? "bg-[#0C1116] border border-[#394757]"
            : "bg-white border border-[#E3E6EB]"
        }
      `}
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <button
        className={menuItemClass}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
          dispatch(setOpenNodeList(true));
        }}
      >
        <h5>Add Node</h5>
        <ChevronRightIcon color={getIconColor(isDark)} size={18} />
      </button>
      <div className={separatorClass} />
      <button
        className={menuItemClass}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
          // Convert screen coordinates to flow coordinates
          if (reactFlowInstance && workflowId) {
            const position = reactFlowInstance.screenToFlowPosition({
              x,
              y,
            });
            // Emit note:create event
            emit("note:create", {
              workflow_id: workflowId,
              title: "New Note",
              content: "",
              position: {
                x: position.x,
                y: position.y,
              },
              data: {
                bgcolor: "#B3EFBD",
                color: "#162230",
                height: 160,
                width: 200,
              },
            });
            console.log("📝Sticky note creation event emitted:", {
              workflow_id: workflowId,
              position,
            });
          }
        }}
      >
        <h5>Add Sticky Note</h5>
        <ChevronRightIcon color={getIconColor(isDark)} size={18} />
      </button>
      <div className={separatorClass} />
      <button
        className={menuItemClass}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <h5>Select All</h5>
        <ChevronRightIcon color={getIconColor(isDark)} size={18} />
      </button>
    </div>
  );
};

export default WorkflowContextMenu;
