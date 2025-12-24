import React from "react";
import {
  Dialog as MTDialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import useTheme from "@/utils/hooks/useTheme";

export interface DialogProps {
  
  open: boolean;
  /**
   * Handler function to control dialog open/close state
   */
  handler: () => void;
  /**
   * Dialog title (optional)
   */
  title?: React.ReactNode;
  /**
   * Dialog content/body
   */
  children: React.ReactNode;
  /**
   * Dialog footer content (optional)
   */
  footer?: React.ReactNode;
  /**
   * Custom width class (e.g., "w-full", "w-96", "max-w-md")
   * @default "max-w-md"
   */
  width?: string;
  /**
   * Additional CSS classes for the dialog
   */
  className?: string;
  /**
   * Additional CSS classes for the dialog body
   */
  bodyClassName?: string;
  /**
   * Whether to show close button in header
   * @default true
   */
  showCloseButton?: boolean;
  /**
   * Size of the dialog
   * @default "md"
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
}

const Dialog: React.FC<DialogProps> = ({
  open,
  handler,
  title,
  children,
  footer,
  width ,
  className = "",
  bodyClassName = "",
  showCloseButton = true,
  size = "md",
}) => {
  const { isDark } = useTheme();

  const bgColor = isDark ? "bg-[#0D131A]" : "bg-white";
  const borderColor = "border-[#2B3643]";

  return (
    <MTDialog
      open={open}
      handler={handler}
      size={size}
      className={`
        ${bgColor}
        ${borderColor}
        border
        rounded-[28px]
        ${width}
        ${className}
      `}
    >
      {title && (
        <DialogHeader
          className={`flex justify-center !pt-6 !pb-0 ${
            isDark ? "text-white" : "text-[#162230]"
          }`}
        >
          {title}
        </DialogHeader>
      )}
      <DialogBody
        className={`${bodyClassName} ${
          isDark ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {children}
      </DialogBody>
      {footer && (
        <DialogFooter className={`${isDark ? "text-white" : "text-gray-900"}`}>
          {footer}
        </DialogFooter>
      )}
    </MTDialog>
  );
};

export default Dialog;
