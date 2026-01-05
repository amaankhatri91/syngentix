import React from "react";
import { File } from "./types";
import FileIcon from "@/assets/app-icons/FileIcon";
import useTheme from "@/utils/hooks/useTheme";
import {
  FileActionConfig,
  FileActions,
  FileBadges,
} from "@/constants/file.constant";

interface FileCardProps {
  file: File;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const FileCard: React.FC<FileCardProps> = ({
  file,
  onEdit,
  onView,
  onDelete,
}) => {
  const { isDark } = useTheme();

  const handleClick = (action: FileActionConfig) => {
    switch (action.id) {
      case "edit":
        onEdit?.(file.id);
        break;
      case "view":
        onView?.(file.id);
        break;
      case "delete":
        onDelete?.(file.id);
        break;
    }
  };

  return (
    <div
      className={`
        ${isDark ? "bg-[#0F1724]" : "bg-white"}
        ${isDark ? "border-[#2B3643]" : "border-[#EEF4FF]"}
        border
        rounded-2xl
        px-4
        py-3
        flex
        flex-wrap
        items-center
        gap-y-4
        gap-x-4
        transition-all
        duration-200
        ${isDark ? "hover:shadow-lg" : ""}
      `}
      style={
        !isDark
          ? {
              boxShadow: "1px 4px 6px 0px #2154EE1A",
            }
          : undefined
      }
    >
      <div className="flex items-center gap-4 min-w-0 basis-full xl:basis-auto xl:flex-1">
        <div
          className={`
            ${
              !isDark
                ? "bg-gradient-to-r from-[#9133EA] to-[#2962EB] p-[1px]"
                : "bg-[#1C2643] p-3"
            }
            rounded-full
            flex-shrink-0
          `}
        >
          {!isDark ? (
            <div className="bg-white rounded-full p-3">
              <FileIcon useGradient size={20} />
            </div>
          ) : (
            <FileIcon color="white" size={20} />
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <h3
            className={`font-medium text-base truncate ${
              isDark ? "text-white" : "text-[#162230]"
            }`}
          >
            {file.title}
          </h3>
          <p
            className={`text-sm truncate ${
              isDark ? "text-[#BDC9F5]" : "text-[#646567]"
            }`}
          >
            {file.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 basis-full xl:basis-auto xl:flex-shrink-0 justify-start xl:justify-center">
        {FileBadges?.map((badge) => {
          const isActive =
            badge.id === "searchable" ? file.isSearchable : file.isAlwaysOn;

          if (!isActive) return null;

          return (
            <div
              key={badge.id}
              className={`border
                ${isDark ? "bg-[#0C1116]" : "bg-[#F5F7FA]"}
                ${isDark ? "border-[#394757]" : "border-[#E3E6EB]"}
                h-[36px]
                px-3
                rounded-lg
                text-sm
                font-medium
                flex
                items-center
                whitespace-nowrap
                ${isDark ? "text-[#BDC9F5]" : "text-[#162230]"}
              text-[14px]`}
            >
              {badge.label}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 basis-full xl:basis-auto xl:flex-shrink-0 justify-start xl:justify-end">
        {FileActions?.map((action) => {
          const Icon = action.icon;
          const isDelete = action.id === "delete";
          return (
            <button
              key={action.id}
              onClick={() => handleClick(action)}
              className={`${
                action.hasThemeColor
                  ? isDark
                    ? "text-[#BDC9F5]"
                    : "text-[#646567]"
                  : ""
              } p-1.5 rounded hover:opacity-80 transition-opacity`}
              aria-label={action.id}
            >
              <Icon
                theme={
                  action.hasThemeColor ? (isDark ? "dark" : "light") : undefined
                }
                height={18}
                color={isDelete ? "#F54960" : undefined}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FileCard;
