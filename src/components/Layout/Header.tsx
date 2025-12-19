import React from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import { setTheme } from "@/store/auth/authSlice";
import { sidebarIcon } from "@/utils/logoUtils";
import { SearchInput } from "@/components/SearchInput";
import darkSwitchIcon from "@/assets/switchIcon/dark-switch.svg";
import lightSwitchIcon from "@/assets/switchIcon/light-switch.svg";

const Header: React.FC = () => {
  const { theme, sidebarOpen } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    dispatch(setTheme(newTheme));
  };

  return (
    <header
      className={`fixed top-0 left-0 lg:left-56 right-0 h-16 z-10 transition-all duration-300`}
    >
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex-1 max-w-md">
          <img src={sidebarIcon(sidebarOpen)} alt="icon" />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleThemeToggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="relative flex items-center justify-center"
          >
            <img
              key={theme}
              src={theme === "dark" ? darkSwitchIcon : lightSwitchIcon}
              alt={theme === "dark" ? "Dark mode" : "Light mode"}
              className="
                h-8 object-contain
                transition-all duration-500 ease-in-out
                opacity-100 scale-100
              "
            />
          </button>
          <SearchInput
            placeholder="Search for..."
            onSearch={(value) => {
              // Handle debounced search here
              console.log("Searching for:", value);
            }}
            className="text-sm text-[#0C1116]"
            debounceDelay={300}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
