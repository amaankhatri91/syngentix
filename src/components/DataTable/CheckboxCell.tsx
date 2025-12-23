import React from "react";
import { useAppSelector } from "@/store";
import check from "@/assets/icons/Check.svg";

interface CheckboxCellProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

const CheckboxCell: React.FC<CheckboxCellProps> = ({
  checked,
  onChange,
  className = "",
}) => {
  const { theme } = useAppSelector((state) => state.auth);
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`
        w-4 h-4 flex items-center justify-center
        rounded-sm
        transition-all duration-200
        ${
          checked
            ? "bg-gradient-to-r from-[#9133EA] to-[#2962EB]"
            : "bg-transparent"
        }
        ${className}
      `}
      style={
        checked
          ? undefined
          : {
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: isDark ? "#7E89AC" : "#CACACA",
            }
      }
    >
      {checked && <img src={check} className="h-2" alt="" />}
    </button>
  );
};

export default CheckboxCell;
