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
  handler: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string; // e.g. "max-w-md"
  className?: string;
  bodyClassName?: string;
  showCloseButton?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
}

const Dialog: React.FC<DialogProps> = ({
  open,
  handler,
  title,
  children,
  footer,
  width = "max-w-md",
  className = "",
  bodyClassName = "",
  size = "md",
}) => {
  const { isDark } = useTheme();

  const bgColor = isDark ? "bg-[#0D131A]" : "bg-white";

  return (
    <MTDialog
      open={open}
      handler={handler}
      size={size}
      className={`
        p-[1px]
        bg-gradient-to-r from-[#9133EA] to-[#2962EB]
        rounded-[28px]
        ${width}
        ${className}
      `}
      containerProps={{
        className:
          "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4",
      }}
    >
      <div
        className={`
          ${bgColor}
          rounded-[27px]
          max-h-[90dvh]
          overflow-y-auto
          overflow-x-visible
        `}
      >
        {title && (
          <DialogHeader
            className={`flex justify-center !font-light pt-8 pb-0 ${
              isDark ? "text-white" : "text-[#162230]"
            }`}
          >
            {title}
          </DialogHeader>
        )}

        <DialogBody
          className={`
            ${bodyClassName}
            ${isDark ? "text-gray-300" : "text-gray-700"}
            overflow-visible
            overflow-x-visible
          `}
        >
          {children}
        </DialogBody>

        {footer && (
          <DialogFooter
            className={`${isDark ? "text-white" : "text-gray-900"}`}
          >
            {footer}
          </DialogFooter>
        )}
      </div>
    </MTDialog>
  );
};

export default Dialog;
