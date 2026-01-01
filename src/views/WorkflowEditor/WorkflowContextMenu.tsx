import React, { useEffect, useRef } from "react";
import useTheme from "@/utils/hooks/useTheme";
import ChevronRightIcon from "@/assets/app-icons/ChevronRightIcon";
import {
  getIconColor,
  getContextMenuItemClass,
  getContextMenuSeparatorClass,
} from "@/utils/common";
import { useAppDispatch } from "@/store";
import { setOpenNodeList } from "@/store/workflowEditor/workflowEditorSlice";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}

const WorkflowContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose }) => {
  const { isDark } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

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
