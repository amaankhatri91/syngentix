import React from "react";
import {
  DashboardIcon,
  AgentsIcon,
  UserIcon,
  TemplateIcon,
  LogoutIcon,
  SettingIcon,
  ProfileIcon,
  WorkFlowIcon,
  ServiceIcon,
} from "@/assets/app-icons";

export interface SidebarItem {
  label: string;
  icon: React.ComponentType<{ color?: string; size?: number }>;
  path: string;
}

export const menuItems: SidebarItem[] = [
  { label: "Dashboard", icon: DashboardIcon, path: "/dashboard" },
  { label: "Agents", icon: AgentsIcon, path: "/agents" },
  { label: "Users", icon: UserIcon, path: "/users" },
  { label: "Services", icon: ServiceIcon, path: "/services" },
  { label: "Templates", icon: TemplateIcon, path: "/templates" },
];

export const settingItems: SidebarItem[] = [
  { label: "Settings", icon: SettingIcon, path: "/settings" },
  { label: "Profile", icon: ProfileIcon, path: "/profile" },
  { label: "Logout", icon: LogoutIcon, path: "/logout" },
];

export const stats = [
  {
    title: "Total Agents",
    value: "00",
    icon: AgentsIcon,
    isCustomIcon: true,
  },
  {
    title: "Total Workflows",
    value: "00",
    icon: WorkFlowIcon,
    isCustomIcon: true,
  },
  {
    title: "Total Users",
    value: "00",
    icon: UserIcon,
    isCustomIcon: true,
  },
];
