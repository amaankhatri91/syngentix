import React from "react";
import { Workflow } from "./types";
import WorkFlowIcon from "@/assets/app-icons/WorkFlowIcon";
import useTheme from "@/utils/hooks/useTheme";
import StatusBadge from "@/components/DataTable/StatusBadge";
import Play from "@/assets/app-icons/Play";
import Power from "@/assets/app-icons/Power";
import EditIcon from "@/assets/app-icons/EditIcon";
import DeleteIcon from "@/assets/app-icons/DeleteIcon";
import DownloadIcon from "@/assets/app-icons/DownloadIcon";
import InfoIcon from "@/assets/app-icons/InfoIcon";

interface WorkflowCardProps {
  workflow: Workflow;
  onInfo?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDownload?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({
  workflow,
  onInfo,
  onEdit,
  onDownload,
  onDelete,
}) => {
  const { isDark } = useTheme();

  const cardBg = isDark ? "bg-[#0F1724]" : "bg-white";
  const textSecondary = isDark ? "text-[#BDC9F5]" : "text-[#646567]";
  const badgeBg = isDark ? "bg-[#0C1116]" : "bg-[#F5F7FA]";
  const iconBg = isDark ? "bg-[#1C2643]" : "bg-white";
  const borderColor = isDark ? "border-[#2B3643]" : "border-[#EEF4FF]";

  return (
    <div
      className={`
        ${cardBg}
        ${borderColor}
        border
        rounded-2xl
        px-4
        py-3
        flex
        flex-wrap
        items-center
        gap-y-4
        transition-all
        duration-200
        hover:shadow-lg
      `}
    >
      {/* ========= INFO : 4/12 ========= */}
      <div className="flex items-center gap-4 min-w-0 basis-full xl:basis-4/12">
        <div
          className={`
            ${
              !isDark
                ? "bg-gradient-to-r from-[#9133EA] to-[#2962EB] p-[1px]"
                : `${iconBg} p-3`
            }
            rounded-full
            flex-shrink-0
          `}
        >
          {!isDark ? (
            <div className="bg-white rounded-full p-3">
              <WorkFlowIcon useGradient size={20} />
            </div>
          ) : (
            <WorkFlowIcon color="white" size={20} />
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <h3 className="font-medium text-base truncate">{workflow.name}</h3>
          <p className={`text-sm truncate ${textSecondary}`}>
            {workflow.description}
          </p>
        </div>
      </div>

      {/* ========= METRICS : 4/12 (BIG) ========= */}
      <div className="flex flex-wrap items-center gap-2 basis-full md:basis-6/12 xl:basis-4/12">
        {[
          {
            value: workflow.triggers.toString().padStart(2, "0"),
            label: "Triggers",
          },
          {
            value: workflow.actions.toString().padStart(2, "0"),
            label: "Actions",
          },
          {
            value: workflow.schedule,
            icon: "play",
          },
          {
            value: workflow.status,
            icon: "power",
          },
        ].map((metric, index) => (
          <div
            key={index}
            className={`border
              ${badgeBg}
              ${isDark ? "border-[#394757]" : "border-[#E3E6EB]"}
              h-[36px]
              px-3
              rounded-lg
              text-sm
              font-medium
              flex
              items-center
              gap-1
              whitespace-nowrap
            `}
          >
            {metric.icon === "play" && (
              <Play
                size={14}
                useGradient={!isDark}
                color={isDark ? "white" : undefined}
              />
            )}

            {metric.icon === "power" && (
              <Power
                size={14}
                useGradient={!isDark}
                color={isDark ? "white" : undefined}
              />
            )}

            {metric.label && (
              <>
                <h5>{metric.value}</h5>
                <span>{metric.label}</span>
              </>
            )}

            {metric.icon && !metric.label && <span>{metric.value}</span>}
          </div>
        ))}
      </div>

      {/* ========= STATUS : 2/12 ========= */}
      <div className="flex items-center justify-start lg:justify-center basis-full md:basis-3/12 xl:basis-2/12">
        <StatusBadge
          status={{
            label: workflow.isActive ? "Active" : "Offline",
            variant: workflow.isActive ? "active" : "offline",
          }}
        />
      </div>

      {/* ========= ACTIONS : 2/12 ========= */}
      <div className="flex items-center gap-4 justify-start lg:justify-end basis-full md:basis-3/12 xl:basis-2/12">
        <button
          onClick={() => onInfo?.(workflow.id)}
          className={`${textSecondary} p-1.5 rounded`}
        >
          <InfoIcon theme={isDark ? "dark" : "light"} height={18} />
        </button>

        <button
          onClick={() => onEdit?.(workflow.id)}
          className={`${textSecondary} p-1.5 rounded`}
        >
          <EditIcon theme={isDark ? "dark" : "light"} height={18} />
        </button>

        <button
          onClick={() => onDownload?.(workflow.id)}
          className={`${textSecondary} p-1.5 rounded`}
        >
          <DownloadIcon theme={isDark ? "dark" : "light"} height={18} />
        </button>

        <button
          onClick={() => onDelete?.(workflow.id)}
          className="p-1.5 rounded"
        >
          <DeleteIcon height={18} />
        </button>
      </div>
    </div>
  );
};

export default WorkflowCard;
