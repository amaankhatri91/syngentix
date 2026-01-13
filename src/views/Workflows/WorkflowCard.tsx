import React from "react";
import { Workflow } from "./types";
import useTheme from "@/utils/hooks/useTheme";
import StatusBadge from "@/components/DataTable/StatusBadge";
import Play from "@/assets/app-icons/Play";
import Power from "@/assets/app-icons/Power";
import { Button } from "@/components/Button";
import {
  WorkflowActionConfig,
  WorkflowMetrics,
  WorkflowActions,
} from "@/constants/workflow.constant";
import { useNavigate, useParams } from "react-router-dom";
import TruncatedText from "@/components/TruncatedText";

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
  const navigate = useNavigate();
  const { agentId } = useParams<{ agentId: string }>();

  const handleGoToFlow = () => {
    navigate(`/agent/${agentId}/workflow/${workflow?.workflow_id}`, {
      state: {
        workflowTitle: workflow?.title,
        workflowDescription: workflow?.description,
        execution_timeout: workflow?.execution_timeout,
        retry_attempts: workflow?.retry_attempts,
        concurrency_limit: workflow?.concurrency_limit,
      },
    });
    onInfo?.(workflow.id);
  };

  const handleClick = (action: WorkflowActionConfig) => {
    console.log(workflow, "Check It");
    switch (action.id) {
      case "info":
        navigate(`/agent/${agentId}/workflow/${workflow?.workflow_id}`, {
          state: {
            workflowTitle: workflow?.title,
            workflowDescription: workflow?.description,
            execution_timeout: workflow?.execution_timeout,
            retry_attempts: workflow?.retry_attempts,
            concurrency_limit: workflow?.concurrency_limit,
          },
        });
        onInfo?.(workflow.id);
        break;
      case "edit":
        onEdit?.(workflow.id);
        break;
      case "download":
        onDownload?.(workflow.id);
        break;
      case "delete":
        onDelete?.(workflow.id);
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
      {/* ========= INFO : 4/12 ========= */}
      <div className="flex items-center gap-4 min-w-0 basis-full xl:basis-4/12">
        <div className="flex flex-col min-w-0 flex-1">
          <TruncatedText
            text={workflow.title || "-"}
            maxLength={50}
            className="font-medium text-base"
            as="h3"
            readMoreText="Read more"
            readLessText="Read less"
          />
          <TruncatedText
            text={workflow.description || "-"}
            maxLength={80}
            className={`text-sm ${
              isDark ? "text-[#BDC9F5]" : "text-[#646567]"
            }`}
            readMoreText="Read more"
            readLessText="Read less"
          />
        </div>
      </div>
      {/* ========= METRICS : 4/12 (BIG) ========= */}
      <div className="flex flex-wrap items-center gap-2 basis-full md:basis-6/12 xl:basis-4/12">
        {WorkflowMetrics?.map((metric, index) => (
          <div
            key={index}
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
                <h5
                  className={
                    !isDark
                      ? "bg-gradient-to-r from-[#9133EA] to-[#2962EB] bg-clip-text text-transparent"
                      : ""
                  }
                >
                  {metric.value}
                </h5>
                <span>{metric.label}</span>
              </>
            )}

            {metric.icon && !metric.label && <span>{metric.value}</span>}
          </div>
        ))}
      </div>
      {/* ========= STATUS : 2/12 ========= */}
      <div className="flex items-center justify-start lg:justify-center basis-full md:basis-3/12 xl:basis-1/12">
        <StatusBadge
          className="!text-[14px]"
          status={{
            label: workflow.status === true ? "Active" : "Offline",
            variant: workflow.status === true ? "active" : "offline",
          }}
        />
      </div>
      <div className="flex items-center justify-start lg:justify-center basis-full md:basis-3/12 xl:basis-2/12">
        <Button
          onClick={handleGoToFlow}
          className="flow-btn text-[14px] py-1 text-white px-3 !rounded-full"
        >
          Go to Flow
        </Button>
      </div>
      {/* ========= ACTIONS : 2/12 ========= */}
      <div className="flex items-center gap-3 justify-start lg:justify-end basis-full md:basis-3/12 xl:basis-1/12">
        {WorkflowActions?.map((action) => {
          const Icon = action.icon;
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
              } p-1.5 rounded`}
              aria-label={action.id}
            >
              <Icon
                theme={
                  action.hasThemeColor ? (isDark ? "dark" : "light") : undefined
                }
                height={18}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WorkflowCard;
