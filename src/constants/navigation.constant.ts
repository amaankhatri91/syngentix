import React from "react";
import {
  DashboardIcon,
  AgentsIcon,
  UserIcon,
  TemplateIcon,
} from "@/components/Icons";

export interface SidebarItem {
  label: string;
  icon: React.ComponentType<{ color?: string; size?: number }>;
  path: string;
}

export const menuItems: SidebarItem[] = [
  { label: "Dashboard", icon: DashboardIcon, path: "/dashboard" },
  { label: "Agents", icon: AgentsIcon, path: "/agents" },
  { label: "Users", icon: UserIcon, path: "/users" },
  { label: "Templates", icon: TemplateIcon, path: "/templates" },
];

