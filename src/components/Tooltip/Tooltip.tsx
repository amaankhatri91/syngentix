import React, { useState, useRef, useEffect } from "react";
import useTheme from "@/utils/hooks/useTheme";

export interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = "top",
  className = "",
}) => {
  const { isDark } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      let top = 0;
      let left = 0;

      switch (position) {
        case "top":
          top = triggerRect.top + scrollY - tooltipRect.height - 8;
          left = triggerRect.left + scrollX + triggerRect.width / 2 - tooltipRect.width / 2;
          break;
        case "bottom":
          top = triggerRect.bottom + scrollY + 8;
          left = triggerRect.left + scrollX + triggerRect.width / 2 - tooltipRect.width / 2;
          break;
        case "left":
          top = triggerRect.top + scrollY + triggerRect.height / 2 - tooltipRect.height / 2;
          left = triggerRect.left + scrollX - tooltipRect.width - 8;
          break;
        case "right":
          top = triggerRect.top + scrollY + triggerRect.height / 2 - tooltipRect.height / 2;
          left = triggerRect.right + scrollX + 8;
          break;
      }

      // Keep tooltip within viewport bounds
      const padding = 8;
      if (top < scrollY + padding) {
        top = scrollY + padding;
      }
      if (left < scrollX + padding) {
        left = scrollX + padding;
      }
      if (left + tooltipRect.width > scrollX + window.innerWidth - padding) {
        left = scrollX + window.innerWidth - tooltipRect.width - padding;
      }

      setTooltipPosition({ top, left });
    }
  }, [isVisible, position]);

  const getArrowClass = () => {
    const baseClass = "absolute w-2 h-2 rotate-45";
    switch (position) {
      case "top":
        return `${baseClass} bottom-[-4px] left-1/2 -translate-x-1/2`;
      case "bottom":
        return `${baseClass} top-[-4px] left-1/2 -translate-x-1/2`;
      case "left":
        return `${baseClass} right-[-4px] top-1/2 -translate-y-1/2`;
      case "right":
        return `${baseClass} left-[-4px] top-1/2 -translate-y-1/2`;
      default:
        return `${baseClass} bottom-[-4px] left-1/2 -translate-x-1/2`;
    }
  };

  const getTooltipBgColor = () => {
    return isDark
      ? "bg-[#0C1116] border-[#394757]"
      : "bg-white border-[#E3E6EB]";
  };

  const getTooltipTextColor = () => {
    return isDark ? "text-white" : "text-[#162230]";
  };

  const getArrowColor = () => {
    if (isDark) {
      return "bg-[#0C1116]";
    } else {
      return "bg-white";
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        className={`inline-block ${className}`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`fixed z-[10000] px-3 py-2 rounded-lg text-sm font-medium shadow-lg border pointer-events-none transition-opacity duration-200 ${getTooltipBgColor()} ${getTooltipTextColor()}`}
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
        >
          {content}
          <div
            className={`${getArrowClass()} ${getArrowColor()}`}
            style={{
              borderRight: `1px solid ${isDark ? "#394757" : "#E3E6EB"}`,
              borderBottom: `1px solid ${isDark ? "#394757" : "#E3E6EB"}`,
            }}
          />
        </div>
      )}
    </>
  );
};

export default Tooltip;

