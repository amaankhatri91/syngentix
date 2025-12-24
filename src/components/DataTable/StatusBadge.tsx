import React from "react";
import { useAppSelector } from "@/store";
import { StatusBadge as StatusBadgeType } from "./types";

interface StatusBadgeProps {
  status: StatusBadgeType;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
}) => {
  const { theme } = useAppSelector((state) => state.auth);
  const isDark = theme === "dark";

  const getStatusStyles = () => {
    switch (status.variant) {
      case "active":
        return isDark
          ? "bg-[#00F07F33] text-[#00FF86]"
          : "bg-[#00A85A] text-white";
      case "offline":
        return isDark
          ? "bg-[#AEB9E133] text-[#AEB9E1]"
          : "bg-[#AEB9E140]  text-[#555B6E]";
      case "custom":
        return status.color || "";
      default:
        return "";
    }
  };

  const getIndicatorColor = () => {
    if (status.variant === "active") {
      return !isDark ? "#FFFFFF" : "#00F07F";
    } else {
      return !isDark ? "#555B6E" : "#AEB9E1";
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium  ${getStatusStyles()} ${className}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: getIndicatorColor() }}
      />
      {status.label}
    </span>
  );
};

export default StatusBadge;
