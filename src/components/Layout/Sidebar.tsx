import React from "react";
import { useAppSelector } from "@/store";
import { siginLogo } from "@/utils/logoUtils";
import useAuth from "@/utils/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { menuItems, settingItems } from "@/constants/navigation.constant";

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
              className={`w-full flex items-center text-md justify-between px-4 py-2 rounded-lg transition-[background-color,color] duration-200 ${
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
          className={`py-4 border-t ${
            theme === "dark" ? "border-[#1E293B]" : "border-gray-200"
          }`}
        >
          <nav className="flex-1 px-5 space-y-2 overflow-y-auto">
          {settingItems?.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                if (item.label === "Logout") {
                  signOut();
                } else {
                  navigate(item.path);
                }
              }}
              className={`w-full flex items-center text-md justify-between px-4 py-2 rounded-lg transition-[background-color,color] duration-200 ${
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
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
