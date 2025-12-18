import React from "react";
import { useAppSelector } from "@/store";
import { siginLogo } from "@/utils/logoUtils";
import useAuth from "@/utils/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import LogoutIcon from "@/components/Icons/LogoutIcon";
import { menuItems } from "@/constants/navigation.constant";

const Sidebar: React.FC = () => {
  const { theme, userName, avatar } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getIconColor = (path: string) => {
    if (isActive(path)) {
      return "white";
    }
    return theme === "dark" ? "#BDC9F5" : "#646567";
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full w-56 z-20 transition-all duration-300 hidden lg:block ${
        theme === "dark"
          ? "bg-[#0C1116] border-r border-[#0B1739]"
          : "bg-[#F5F7FA] border-r border-[#E3E6EB]"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-6 flex ">
          <img src={siginLogo(theme)} alt="Logo" className="h-[75px] w-auto" />
        </div>
        <nav className="flex-1 px-5 space-y-2 overflow-y-auto">
          {menuItems?.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center text-md justify-between px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? theme === "dark"
                    ? "text-white sidebar-active-dark"
                    : "text-white sidebar-active-light"
                  : theme === "dark"
                  ? "text-[#BDC9F5] hover:bg-[#1E293B]"
                  : "text-[#646567] hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                {React.createElement(item.icon, {
                  color: getIconColor(item.path),
                  size: 20,
                })}
                <span
                  className={`font-medium ${
                    isActive(item.path)
                      ? theme === "dark"
                        ? "text-white"
                        : "text-white"
                      : theme === "dark"
                      ? "text-[#BDC9F5] hover:bg-[#1E293B]"
                      : "text-[#646567] hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </button>
          ))}
        </nav>
        <div
          className={`p-4 border-t ${
            theme === "dark" ? "border-[#1E293B]" : "border-gray-200"
          }`}
        >
          <div
            className={`flex items-center gap-3 p-3 rounded-lg ${
              theme === "dark"
                ? "bg-[#1E293B] hover:bg-[#334155]"
                : "bg-gray-50 hover:bg-gray-100"
            } transition-colors cursor-pointer`}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              {avatar ? (
                <img
                  src={avatar}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-sm">
                  {userName?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate`}>
                {userName || "User"}
              </p>
              <p className={`text-xs truncate`}>Admin</p>
            </div>
            <button
              className={`p-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "hover:bg-[#334155] text-[#BDC9F5]"
                  : "hover:bg-gray-200 text-gray-600"
              }`}
              onClick={() => {
                signOut();
              }}
            >
              <LogoutIcon
                color={theme === "dark" ? "#BDC9F5" : "#6B7280"}
                size={18}
              />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
