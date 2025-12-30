import React, { useEffect, useRef } from "react";
import useTheme from "@/utils/hooks/useTheme";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}

const WorkflowContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose }) => {
  const { isDark } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

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

  const menuItemClass = `
    flex items-center justify-between w-full px-4 py-3 text-sm font-medium
    transition-colors duration-150 cursor-pointer
    ${
      isDark
        ? "text-white hover:bg-[#1E293B]"
        : "text-[#162230] hover:bg-[#F5F7FA]"
    }
    first:rounded-t-lg last:rounded-b-lg
  `;

  const separatorClass = `
    ${isDark ? "border-[#2B3643]" : "border-[#E3E6EB]"}
    border-t
  `;

  const ChevronRightIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={isDark ? "text-white" : "text-[#162230]"}
    >
      <path
        d="M6 12L10 8L6 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

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
      <div
        className={menuItemClass}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <h5>Add Node</h5>
        <ChevronRightIcon />
      </div>
      <div className={separatorClass} />
      <div
        className={menuItemClass}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <h5>Add Sticky Note</h5>
        <ChevronRightIcon />
      </div>
      <div className={separatorClass} />
      <div
        className={menuItemClass}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <h5>Select All</h5>
        <ChevronRightIcon />
      </div>
    </div>
  );
};

export default WorkflowContextMenu;
