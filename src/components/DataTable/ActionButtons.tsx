import React from "react";
import { useAppSelector } from "@/store";
import { ActionButton } from "./types";

interface ActionButtonsProps {
  actions: ActionButton[];
  row: any;
  className?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  actions,
  row,
  className = "",
}) => {
  const { theme } = useAppSelector((state) => state.auth);
  const isDark = theme === "dark";

  const getButtonStyles = (variant?: string) => {
    const baseStyles = "p-1.5 rounded transition-colors";
    switch (variant) {
      case "danger":
        return `${baseStyles} ${
          isDark
            ? "text-red-400 hover:bg-red-900/20"
            : "text-red-600 hover:bg-red-50"
        }`;
      case "secondary":
        return `${baseStyles} ${
          isDark
            ? "text-gray-400 hover:bg-gray-700/50"
            : "text-gray-600 hover:bg-gray-100"
        }`;
      case "primary":
      default:
        return `${baseStyles} ${
          isDark
            ? "text-green-400 hover:bg-green-900/20"
            : "text-green-600 hover:bg-green-50"
        }`;
    }
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {actions?.map((action, index) => (
        <button
          key={index}
          onClick={() => action.onClick(row)}
          className={getButtonStyles(action.variant)}
          title={action.label}
          aria-label={action.label}
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;
