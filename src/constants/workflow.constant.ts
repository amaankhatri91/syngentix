import React from "react";
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

export interface EdgeThicknessOption {
  label: string;
  value: number;
  display: string;
}

export const EdgeThicknessOptions: EdgeThicknessOption[] = [
  { label: "Minimal", value: 0.3, display: "0.3px" },
  { label: "1x", value: 1.0, display: "1.0px" },
  { label: "2x", value: 2.0, display: "2.0px" },
  { label: "3x", value: 2.5, display: "2.5px" },
  { label: "4x", value: 3.0, display: "3.0px" },
  { label: "5x", value: 4.0, display: "4.0px" },
];
