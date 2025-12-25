import React from "react";
import InfoIcon from "@/assets/app-icons/InfoIcon";
import EditIcon from "@/assets/app-icons/EditIcon";
import DownloadIcon from "@/assets/app-icons/DownloadIcon";
import DeleteIcon from "@/assets/app-icons/DeleteIcon";

export interface WorkflowMetric {
  value: string;
  label?: string;
  icon?: "play" | "power";
}

export const WorkflowMetrics: WorkflowMetric[] = [
  {
    value: "02",
    label: "Triggers",
  },
  {
    value: "02",
    label: "Actions",
  },
  {
    value: "Never",
    icon: "play",
  },
  {
    value: "N/A",
    icon: "power",
  },
];

export interface WorkflowActionConfig {
  id: "info" | "edit" | "download" | "delete";
  icon: any;
  hasThemeColor?: boolean; // For buttons that use theme color (not delete)
}

export const WorkflowActions: WorkflowActionConfig[] = [
  {
    id: "info",
    icon: InfoIcon,
    hasThemeColor: true,
  },
  {
    id: "edit",
    icon: EditIcon,
    hasThemeColor: true,
  },
  {
    id: "download",
    icon: DownloadIcon,
    hasThemeColor: true,
  },
  {
    id: "delete",
    icon: DeleteIcon,
    hasThemeColor: false,
  },
];
