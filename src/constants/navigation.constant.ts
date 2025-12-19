import React from "react";
import {
  DashboardIcon,
  AgentsIcon,
  UserIcon,
  TemplateIcon,
  LogoutIcon,
} from "@/components/Icons";
import SettingIcon from "@/components/Icons/SettingIcon";
import ProfileIcon from "@/components/Icons/ProfileIcon";

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

export const settingItems: SidebarItem[] = [
  { label: "Settings", icon: SettingIcon, path: "/settings" },
  { label: "Profile", icon: ProfileIcon, path: "/profile" },
  { label: "Logout", icon: LogoutIcon, path: "/logout" },
];
