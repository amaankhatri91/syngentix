import useTheme from "@/utils/hooks/useTheme";
import {
  getIconColor,
  getButtonStyles,
  getGroupedButtonStyles,
  getButtonBaseStyles,
} from "@/utils/common";
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
  ChatIcon,
  ChevronDownIcon,
} from "@/assets/app-icons";
import TestRun from "@/assets/app-icons/TestRun";
import DownloadIcon from "@/assets/app-icons/DownloadIcon";

const WorkflowEditorHeader = () => {
  const { isDark } = useTheme();
  return (
    <div
      className={`flex items-center mt-6 justify-between gap-1 px-3 py-2 rounded-xl ${
        isDark ? "bg-[#0F1724]" : "bg-white"
      } border ${
        isDark
          ? "border-[#2B3643]"
          : "border-[#E6E6E6] shadow-[1px_4px_6px_0px_#2154EE1A]"
      }`}
    >
      <div className={`flex gap-4`}>
        <button className={`${getButtonStyles(isDark)}`}>
          <ThicknessIcon color={getIconColor(isDark)} size={14} />
          <h5>Thickness</h5>
        </button>
        <button className={getButtonStyles(isDark)}>
          <SelectIcon color={getIconColor(isDark)} size={18} />
          <h5>Select</h5>
        </button>
      </div>
      <div className="flex gap-4">
        <div className="flex">
          <button
            className={`${getGroupedButtonStyles(isDark)} rounded-r-none`}
          >
            <CopyIcon color={getIconColor(isDark)} size={18} />
            <h5>Copy</h5>
          </button>
          <button className={`${getGroupedButtonStyles(isDark)} rounded-none`}>
            <CutIcon color={getIconColor(isDark)} size={18} />
            <h5>Cut</h5>
          </button>
          <button
            className={`${getGroupedButtonStyles(isDark)} rounded-l-none`}
          >
            <PasteIcon color={getIconColor(isDark)} size={18} />
            <h5>Paste</h5>
          </button>
        </div>
        <div className="flex">
          <button
            className={`${getGroupedButtonStyles(isDark)} rounded-r-none `}
          >
            <UndoIcon color={getIconColor(isDark)} size={18} />
            <h5>Undo</h5>
          </button>
          <button
            className={`${getGroupedButtonStyles(isDark)} rounded-l-none`}
          >
            <RedoIcon color={getIconColor(isDark)} size={18} />
            <h5>Redo</h5>
          </button>
        </div>
        <div>
          <button className={getButtonStyles(isDark)}>
            <CrownIcon color={getIconColor(isDark)} size={18} />
          </button>
        </div>
      </div>
      <div className="flex gap-4">
        <button className={getButtonStyles(isDark)}>
          <EditIcon theme={isDark ? "dark" : "light"} height={18} />
          <h5>Edit Details</h5>
        </button>
        <button className={`${getButtonStyles(isDark)} relative`}>
          <LayoutIcon color={getIconColor(isDark)} size={18} />
          <h5>Layout</h5>
          <ChevronDownIcon
            color={getIconColor(isDark)}
            size={12}
            className="ml-1"
          />
        </button>
        <button
          className={`${getButtonBaseStyles(
            isDark
          )} bg-gradient-to-r from-[#9133EA] to-[#2962EB] hover:opacity-90`}
        >
          <TestRun color={"white"} size={18} />
          <h5 className="font-normal text-white">Test Run</h5>
        </button>
        <button
          className={`${getButtonBaseStyles(
            isDark
          )} bg-gradient-to-r from-[#9133EA] to-[#2962EB] text-white hover:opacity-90`}
        >
          <DownloadIcon theme="dark" height={18} />
        </button>
        <button className={getButtonStyles(isDark)}>
          <ChatIcon color={getIconColor(isDark)} size={18} />
          <h5>Chat</h5>
        </button>
      </div>
    </div>
  );
};

export default WorkflowEditorHeader;
