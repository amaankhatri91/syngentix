import React from "react";
import useTheme from "@/utils/hooks/useTheme";
import {
  ThicknessIcon,
  SelectIcon,
  CopyIcon,
  CutIcon,
  PasteIcon,
  UndoIcon,
  RedoIcon,
  CrownIcon,
  EditIcon,
  LayoutIcon,
  CloudIcon,
  ChatIcon,
  Play,
} from "@/assets/app-icons";
import TestRun from "@/assets/app-icons/TestRun";
import DownloadIcon from "@/assets/app-icons/DownloadIcon";

const WorkflowEditorHeader = () => {
  const { isDark } = useTheme();

  const iconColor = isDark ? "#FFFFFF" : "#162230";

  const buttonBaseStyles = `flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
    isDark ? "border bg-[#0C1116] border-[#394757]" : " border border-[#E3E6EB]"
  }`;

  const buttonStyles = `${buttonBaseStyles} ${
    isDark
      ? "text-white hover:bg-[#1E293B]"
      : "text-[#162230] hover:bg-[#F5F7FA]"
  }`;

  const groupedButtonStyles = `${buttonBaseStyles} ${
    isDark
      ? "text-white hover:bg-[#1E293B] border-l border-[#2B3643]"
      : "text-[#162230] hover:bg-[#F5F7FA] border-l border-[#E6E6E6]"
  }`;

  return (
    <div
      className={`flex items-center mt-6 justify-between gap-1 px-4 py-2 rounded-lg ${
        isDark ? "bg-[#0F1724]" : "bg-white"
      } border ${isDark ? "border-[#2B3643]" : "border-[#E6E6E6]"}`}
    >
      <div className={`flex gap-4`}>
        <button className={`${buttonStyles} `}>
          <ThicknessIcon color={iconColor} />
          <h5>Thickness</h5>
        </button>
        <button className={buttonStyles}>
          <SelectIcon color={iconColor} size={18} />
          <h5>Select</h5>
        </button>
      </div>
      <div className="flex gap-4">
        <div className="flex">
          <button className={`${groupedButtonStyles} rounded-r-none`}>
            <CopyIcon color={iconColor} size={18} />
            <h5>Copy</h5>
          </button>
          <button className={`${groupedButtonStyles} rounded-none`}>
            <CutIcon color={iconColor} size={18} />
            <h5>Cut</h5>
          </button>
          <button className={`${groupedButtonStyles} rounded-l-none`}>
            <PasteIcon color={iconColor} size={18} />
            <h5>Paste</h5>
          </button>
        </div>
        <div className="flex">
          <button className={`${groupedButtonStyles} rounded-r-none `}>
            <UndoIcon color={iconColor} size={18} />
            <h5>Undo</h5>
          </button>
          <button className={`${groupedButtonStyles} rounded-l-none`}>
            <RedoIcon color={iconColor} size={18} />
            <h5>Redo</h5>
          </button>
        </div>
        <div>
          <button className={buttonStyles}>
            <CrownIcon color={iconColor} size={18} />
          </button>
        </div>
      </div>
      <div className="flex gap-4">
        <button className={buttonStyles}>
          <EditIcon theme={isDark ? "dark" : "light"} height={18} />
          <h5>Edit Details</h5>
        </button>
        <button className={`${buttonStyles} relative`}>
          <LayoutIcon color={iconColor} size={18} />
          <h5>Layout</h5>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="ml-1"
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke={iconColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          className={`${buttonBaseStyles} bg-gradient-to-r from-[#9133EA] to-[#2962EB] text-white hover:opacity-90`}
        >
          <TestRun color={iconColor} size={18} />
          <h5>Test Run</h5>
        </button>
        <button className={buttonStyles}>
          <DownloadIcon theme={isDark ? "dark" : "light"} height={18} />
        </button>
        <button className={buttonStyles}>
          <ChatIcon color={iconColor} size={18} />
          <h5>Chat</h5>
        </button>
      </div>
    </div>
  );
};

export default WorkflowEditorHeader;
