import React, { useState } from "react";
import useTheme from "@/utils/hooks/useTheme";
import { useAppSelector, useAppDispatch } from "@/store";
import { setPanelStep } from "@/store/workflowEditor/workflowEditorSlice";
import CancelIcon from "@/assets/app-icons/CancelIcon";
import { CopyIcon } from "@/assets/app-icons";
import CancelIcon3 from "@/assets/app-icons/CancelIcon3";
import Confirm from "@/assets/app-icons/Confirm";
import { Spinner } from "@material-tailwind/react";
import Pending from "@/assets/app-icons/Pending";
import Error from "@/assets/app-icons/Error";
import Verified from "@/assets/app-icons/Verified";

interface ProgressStep {
  id: string;
  name: string;
  status: "failed" | "completed" | "processing" | "pending";
  duration?: string;
}

const WorkflowExecution: React.FC = () => {
  const { isDark } = useTheme();
  const dispatch = useAppDispatch();
  const panelStep = useAppSelector((state) => state.workflowEditor.panelStep);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleClose = () => {
    dispatch(setPanelStep(null));
  };

  if (panelStep !== "execution") return null;

  // Sample data - replace with actual props/state
  const progressSteps: ProgressStep[] = [
    { id: "1", name: "Manual Run", status: "failed", duration: "24ms" },
    {
      id: "2",
      name: "Webhook: order.created",
      status: "completed",
      duration: "24ms",
    },
    { id: "3", name: "Analyze Sentiment", status: "processing" },
    { id: "4", name: "Check Score", status: "pending" },
    { id: "5", name: "Update Record", status: "pending" },
  ];

  const errorMessage = `Error: Request failed with status code 401 at HttpClient.request (/nodes/http/client.js:42:15) at processTicksAndRejections (node: internal/process/task_queues:96:5) at async Node.execute (/core/runner/node.js:105:22)`;

  const inputData = {
    method: "GET",
    url: "https://api.stripe.com/v1/customers",
    headers: {
      Authorization: "Bearer Sk test",
    },
  };

  const outputData = null;

  const executionLogs = [
    { time: "10:42:01", level: "INFO", message: "Workflow started" },
    {
      time: "10:42:01",
      level: "SUCCESS",
      message: "Webhook received payload (240b)",
    },
    { time: "10:42:02", level: "INFO", message: "Workflow started" },
  ];

  const handleCopy = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getStepIcon = (status: ProgressStep["status"]) => {
    switch (status) {
      case "failed":
        return <CancelIcon3 />;
      case "completed":
        return <Confirm />;
      case "processing":
        return <Spinner className="h-5 w-5 text-[#9133EA]" />;
      case "pending":
        return <Pending />;
    }
  };

  const getStatusText = (status: ProgressStep["status"]) => {
    switch (status) {
      case "failed":
        return "Failed";
      case "completed":
        return "Completed";
      case "processing":
        return "Processing...";
      case "pending":
        return "Pending";
    }
  };

  return (
    <div
      className={`h-auto max-h-[calc(100vh-174px)] flex flex-col border rounded-2xl ${
        isDark
          ? "bg-[#0F1724] border-[#2B3643]"
          : "bg-[#FFFFFF] border-[#EEF4FF] shadow-[1px_4px_6px_0px_#2154EE1A]"
      }`}
    >
      <div
        className={`flex-1 min-h-0 ${
          isDark ? "bg-[#111A2A]" : "bg-white"
        } border ${
          isDark ? "border-[#2B3643]" : "border-[#E3E6EB]"
        } rounded-xl flex flex-col`}
      >
        {/* Header */}
        <div className="mx-3 pb-0 flex-shrink-0">
          <div className="flex justify-between items-center py-3">
            <h3
              className={`text-base text-[18px] font-medium ${
                isDark ? "text-white" : "text-[#162230]"
              }`}
            >
              Execution Control
            </h3>
            <button onClick={handleClose} className="cursor-pointer">
              <CancelIcon theme={isDark ? "dark" : "light"} size={28} />
            </button>
          </div>
          <hr
            className={`border-t ${
              isDark ? "border-[#2B3643]" : "border-[#E3E6EB]"
            }`}
          />
        </div>
        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto nodes-list-scrollbar min-h-0">
          <div className="mx-3 mt-2 mb-4 space-y-4">
            {/* Progress Section */}
            <div>
              <span className={`text-[16px] font-medium mb-3`}>Progress</span>
              <div className="space-y-3 mt-2">
                {progressSteps?.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 px-3 py-2 rounded-[10px] ${
                      isDark
                        ? "bg-[#0D131A] border border-[#2B3643]"
                        : "bg-[#F9FAFB] border border-[#E3E6EB]"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {getStepIcon(step.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm font-medium ${
                          isDark ? "text-white" : "text-[#162230]"
                        }`}
                      >
                        {step.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs ${
                            step.status === "failed"
                              ? "text-red-500"
                              : step.status === "completed"
                              ? "text-[#9133EA]"
                              : isDark
                              ? "text-[#8E9BB0]"
                              : "text-[#737373]"
                          }`}
                        >
                          {getStatusText(step.status)}
                        </span>
                        {step.duration && (
                          <span
                            className={`text-xs ${
                              isDark ? "text-[#8E9BB0]" : "text-[#737373]"
                            }`}
                          >
                            • {step.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Log Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Error />
                  <h4 className="text-sm font-medium text-[#F54960]">
                    ERROR LOG
                  </h4>
                </div>
                <button
                  onClick={() => handleCopy(errorMessage, "error")}
                  className={`text-xs px-2 py-1 rounded ${
                    isDark
                      ? "hover:bg-[#2B3643] text-[#8E9BB0]"
                      : "hover:bg-[#F3F4F6] text-[#737373]"
                  } transition-colors flex items-center gap-1`}
                >
                  <CopyIcon size={12} />
                  {copiedSection === "error" ? "Copied!" : "Copy Stack"}
                </button>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  isDark
                    ? "bg-[#0D131A] border border-[#2B3643]"
                    : "bg-[#F9FAFB] border border-[#E3E6EB]"
                }`}
              >
                <pre
                  className={`text-xs font-mono whitespace-pre-wrap break-words ${
                    isDark ? "text-[#FF9E9E]" : "text-red-600"
                  }`}
                >
                  {errorMessage}
                </pre>
              </div>
            </div>

            {/* Input Data Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-medium `}>Input Data</span>
                <button
                  onClick={() =>
                    handleCopy(JSON.stringify(inputData, null, 2), "input")
                  }
                  className={`text-xs px-2 py-1 rounded ${
                    isDark
                      ? "hover:bg-[#2B3643] text-[#8E9BB0]"
                      : "hover:bg-[#F3F4F6] text-[#737373]"
                  } transition-colors flex items-center gap-1`}
                >
                  <CopyIcon size={12} />
                  {copiedSection === "input" ? "Copied!" : "Copy JSON"}
                </button>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  isDark
                    ? "bg-[#0D131A] border border-[#2B3643]"
                    : "bg-[#F9FAFB] border border-[#E3E6EB]"
                }`}
              >
                <pre
                  className={`text-xs font-mono whitespace-pre-wrap break-words ${
                    isDark ? "text-[#A8B3CF]" : "text-[#162230]"
                  }`}
                >
                  {JSON.stringify(inputData, null, 2)}
                </pre>
              </div>
            </div>

            {/* Output Data Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-medium`}>Output Data</span>
                <button
                  onClick={() =>
                    handleCopy(JSON.stringify(outputData, null, 2), "output")
                  }
                  className={`text-xs px-2 py-1 rounded ${
                    isDark
                      ? "hover:bg-[#2B3643] text-[#8E9BB0]"
                      : "hover:bg-[#F3F4F6] text-[#737373]"
                  } transition-colors flex items-center gap-1`}
                >
                  <CopyIcon size={12} />
                  {copiedSection === "output" ? "Copied!" : "Copy JSON"}
                </button>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  isDark
                    ? "bg-[#0D131A] border border-[#2B3643]"
                    : "bg-[#F9FAFB] border border-[#E3E6EB]"
                }`}
              >
                <pre
                  className={`text-xs font-mono whitespace-pre-wrap break-words ${
                    isDark ? "text-[#A8B3CF]" : "text-[#162230]"
                  }`}
                >
                  {JSON.stringify(outputData, null, 2)}
                </pre>
              </div>
            </div>

            {/* Execution Logs Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium `}>Execution Logs</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      isDark
                        ? "bg-[#2B3643] text-[#8E9BB0]"
                        : "bg-[#E3E6EB] text-[#737373]"
                    }`}
                  >
                    2 new
                  </span>
                </div>
              </div>
              <div
                className={`p-3 rounded-lg space-y-2 ${
                  isDark
                    ? "bg-[#0D131A] border border-[#2B3643]"
                    : "bg-[#F9FAFB] border border-[#E3E6EB]"
                }`}
              >
                {executionLogs.map((log, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span
                      className={`text-xs font-mono ${
                        isDark ? "text-[#8E9BB0]" : "text-[#737373]"
                      }`}
                    >
                      {log.time}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        log.level === "SUCCESS"
                          ? "text-green-500"
                          : log.level === "INFO"
                          ? isDark
                            ? "text-[#8E9BB0]"
                            : "text-[#737373]"
                          : "text-red-500"
                      }`}
                    >
                      {log.level}
                    </span>
                    <span
                      className={`text-xs flex-1 ${
                        isDark ? "text-[#A8B3CF]" : "text-[#162230]"
                      }`}
                    >
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mx-3">
          <hr
            className={`border-t ${
              isDark ? "border-[#2B3643]" : "border-[#E3E6EB]"
            }`}
          />
        </div>
        <div
          className={`flex items-center justify-between px-3 py-2 ${
            isDark ? "border-[#2B3643]" : "border-[#E3E6EB]"
          } flex-shrink-0`}
        >
          <div className="flex items-center gap-2">
            <Verified />
            <span className={`text-xs font-medium `}>Test mode active</span>
          </div>
          <button
            onClick={handleClose}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDark
                ? "bg-[#0F141D] hover:bg-[#364152] text-white border border-[#394757]"
                : "bg-[#E3E6EB] hover:bg-[#D1D5DB] text-[#162230]"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowExecution;
