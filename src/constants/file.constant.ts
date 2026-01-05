import React from "react";
import EditIcon from "@/assets/app-icons/EditIcon";
import ViewIcon from "@/assets/app-icons/ViewIcon";
import DeleteIcon from "@/assets/app-icons/DeleteIcon";

export interface FileActionConfig {
  id: "edit" | "view" | "delete";
  icon: any;
  hasThemeColor?: boolean;
}

export const FileActions: FileActionConfig[] = [
  {
    id: "edit",
    icon: EditIcon,
    hasThemeColor: true,
  },
  {
    id: "view",
    icon: ViewIcon,
    hasThemeColor: true,
  },
  {
    id: "delete",
    icon: DeleteIcon,
    hasThemeColor: false,
  },
];

export interface FileBadge {
  label: string;
  id: "searchable" | "alwaysOn";
}

export const FileBadges: FileBadge[] = [
  {
    id: "searchable",
    label: "Searchable",
  },
  {
    id: "alwaysOn",
    label: "Always On",
  },
];

