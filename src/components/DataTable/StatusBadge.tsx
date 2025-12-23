import React from "react";
import { useAppSelector } from "@/store";
import { StatusBadge as StatusBadgeType } from "./types";

interface StatusBadgeProps {
  status: StatusBadgeType;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = "" }) => {
  const { theme } = useAppSelector((state) => state.auth);
  const isDark = theme === "dark";

  const getStatusStyles = () => {
    switch (status.variant) {
      case "active":
        return isDark
          ? "bg-green-900/30 border-green-500/50 text-green-400"
          : "bg-green-50 border-green-200 text-green-700";
      case "offline":
        return isDark
          ? "bg-gray-700/30 border-gray-600/50 text-gray-400"
          : "bg-gray-100 border-gray-300 text-gray-600";
      case "custom":
        return status.color || "";
      default:
        return "";
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
        getStatusStyles()
      } ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status.label}
    </span>
  );
};

export default StatusBadge;



