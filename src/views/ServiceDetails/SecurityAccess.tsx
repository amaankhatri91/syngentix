import React, { useState, useCallback, useMemo } from "react";
import useTheme from "@/utils/hooks/useTheme";
import { Button } from "@/components/Button";
import { SearchInput } from "@/components/SearchInput";
import Select, { StylesConfig } from "react-select";
import CheckboxCell from "@/components/DataTable/CheckboxCell";
import { getReactSelectStyles } from "@/utils/common";

interface SecurityAccessProps {
  onAddAgent?: () => void;
  onSearchAgents?: (searchTerm: string) => void;
  onAddPermission?: (userId: string, permissions: string[]) => void;
}

interface PermissionOption {
  value: string;
  label: string;
}

const SecurityAccess: React.FC<SecurityAccessProps> = ({
  onAddAgent,
  onSearchAgents,
  onAddPermission,
}) => {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [permissions, setPermissions] = useState<{
    read: boolean;
    write: boolean;
    execute: boolean;
    admin: boolean;
    all: boolean;
  }>({
    read: true,
    write: false,
    execute: false,
    admin: false,
    all: false,
  });

  const userOptions = useMemo<PermissionOption[]>(
    () => [
      { value: "user1", label: "John Doe" },
      { value: "user2", label: "Jane Smith" },
      { value: "user3", label: "Bob Johnson" },
    ],
    []
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      onSearchAgents?.(value);
    },
    [onSearchAgents]
  );

  const handleAddAgent = useCallback(() => {
    onAddAgent?.();
  }, [onAddAgent]);

  const handlePermissionChange = useCallback(
    (permission: keyof typeof permissions) => {
      setPermissions((prev) => ({
        ...prev,
        [permission]: !prev[permission],
      }));
    },
    []
  );

  const handleAddPermission = useCallback(() => {
    if (!selectedUser) return;
    const selectedPermissions = Object.entries(permissions)
      .filter(([_, checked]) => checked)
      .map(([key]) => key);
    onAddPermission?.(selectedUser, selectedPermissions);
  }, [selectedUser, permissions, onAddPermission]);

  const cardStyles = useMemo(
    () =>
      isDark
        ? {
            border: "0.6px solid #2B3643",
            opacity: 1,
          }
        : {
            border: "0.6px solid #EEF4FF",
            boxShadow: "1px 4px 6px 0px #2154EE1A",
          },
    [isDark]
  );

  const selectStyles = useMemo<StylesConfig<PermissionOption, false>>(() => {
    const baseStyles = getReactSelectStyles(false, false);

    return {
      ...baseStyles,
      control: (base: any, state: any) => ({
        ...baseStyles.control(base, state),
        backgroundColor: "#FFFFFF",
        borderColor: "#B7C0CF",
        "&:hover": {
          borderColor: "#9CA3AF",
        },
        ...(state.isFocused && {
          borderColor: "#9CA3AF",
        }),
      }),
      menu: (base: any) => ({
        ...baseStyles.menu(base),
        backgroundColor: "#FFFFFF",
      }),
      option: (base: any, state: any) => ({
        ...baseStyles.option(base, state),
        backgroundColor: state.isSelected
          ? "#F3F4F6"
          : state.isFocused
          ? "#F9FAFB"
          : "#FFFFFF",
        color: "#111827",
        "&:active": {
          backgroundColor: "#F3F4F6",
        },
      }),
      singleValue: (base: any) => ({
        ...baseStyles.singleValue(base),
        color: "#111827",
      }),
      placeholder: (base: any) => ({
        ...baseStyles.placeholder(base),
        color: "#000000",
      }),
      input: (base: any) => ({
        ...baseStyles.input(base),
        color: "#111827",
      }),
    };
  }, []);

  return (
    <>
      <h2
        className={`text-xl font-medium mb-6 ${
          isDark ? "text-white" : "text-[#162230]"
        }`}
      >
        Security Access
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={`${
            isDark ? "bg-[#0F1724]" : "bg-white"
          } rounded-2xl p-6 transition-all duration-200`}
          style={cardStyles}
        >
          <div className="mb-6">
            <h3
              className={`text-lg font-medium mb-2 ${
                isDark ? "text-white" : "text-[#162230]"
              }`}
            >
              Agent Access
            </h3>
            <p
              className={`text-sm ${
                isDark ? "text-[#BDC9F5]" : "text-[#646567]"
              }`}
            >
              Configure which agents have programmatic access to this database
              service.
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <SearchInput
                placeholder="Search agents"
                value={searchTerm}
                onChange={handleSearchChange}
                onSearch={handleSearchChange}
                width="w-full"
                height="h-10"
                className=""
                inputClassName="!bg-white !text-gray-900 !placeholder-black"
              />
            </div>
            <Button
              onClick={handleAddAgent}
              className="!px-4 !py-2 !rounded-xl !text-white !bg-gradient-to-r from-[#9133ea] to-[#2962eb] whitespace-nowrap"
            >
              Add Agent
            </Button>
          </div>
        </div>

        <div
          className={`${
            isDark ? "bg-[#0F1724]" : "bg-white"
          } rounded-2xl p-6 transition-all duration-200`}
          style={cardStyles}
        >
          <div className="mb-6">
            <h3
              className={`text-lg font-medium mb-2 ${
                isDark ? "text-white" : "text-[#162230]"
              }`}
            >
              User Permission
            </h3>
            <p
              className={`text-sm ${
                isDark ? "text-[#BDC9F5]" : "text-[#646567]"
              }`}
            >
              Grant specific team members access to manage or query this service
              directly.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Select<PermissionOption, false>
                options={userOptions}
                value={
                  userOptions.find((opt) => opt.value === selectedUser) || null
                }
                onChange={(option) => setSelectedUser(option?.value || "")}
                placeholder="Select Users"
                styles={selectStyles}
                isSearchable
              />
            </div>

            <div>
              <label
                className={`block text-[16px] font-medium mb-3  ${
                  isDark ? "text-white" : "text-[#162230]"
                }`}
              >
                Select Permissions
              </label>
              <div className="flex flex-wrap gap-4">
                  {(["read", "write", "execute", "admin","all"] as const).map(
                  (permission) => (
                    <div key={permission} className="flex items-center gap-2">
                      <CheckboxCell
                        checked={permissions[permission]}
                        onChange={() => handlePermissionChange(permission)}
                      />
                      <span
                        className={`text-sm capitalize ${
                          isDark ? "text-white" : "text-[#162230]"
                        }`}
                      >
                        {permission}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <Button
              onClick={handleAddPermission}
              className=" !px-4 !py-2 !rounded-xl !text-white !bg-gradient-to-r from-[#9133ea] to-[#2962eb]"
            >
              Add Permission
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SecurityAccess;
