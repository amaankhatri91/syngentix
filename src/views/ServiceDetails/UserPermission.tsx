import React, { useMemo, useCallback } from "react";
import useTheme from "@/utils/hooks/useTheme";
import StatusBadge from "@/components/DataTable/StatusBadge";
import CheckboxCell from "@/components/DataTable/CheckboxCell";
import EditIcon from "@/assets/app-icons/EditIcon";
import DeleteIcon from "@/assets/app-icons/DeleteIcon";

interface UserPermission {
  id: string;
  users: string;
  admin: boolean;
  view: boolean;
  edit: boolean;
  execute: boolean;
  all: boolean;
  status: "active" | "offline";
}

interface UserPermissionProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

type ColumnType = "text" | "checkbox" | "status" | "action";
type ColumnAlign = "left" | "center" | "right";

interface ColumnConfig {
  key: keyof UserPermission | "action";
  label: string;
  type: ColumnType;
  align: ColumnAlign;
  permissionKey?: keyof Omit<UserPermission, "id" | "users" | "status">;
}

const UserPermission: React.FC<UserPermissionProps> = ({
  onEdit,
  onDelete,
}) => {
  const { isDark, theme } = useTheme();

  const columns: ColumnConfig[] = useMemo(
    () => [
      {
        key: "users",
        label: "Users",
        type: "text",
        align: "left",
      },
      {
        key: "admin",
        label: "Admin",
        type: "checkbox",
        align: "center",
        permissionKey: "admin",
      },
      {
        key: "view",
        label: "View",
        type: "checkbox",
        align: "center",
        permissionKey: "view",
      },
      {
        key: "edit",
        label: "Edit",
        type: "checkbox",
        align: "center",
        permissionKey: "edit",
      },
      {
        key: "execute",
        label: "Execute",
        type: "checkbox",
        align: "center",
        permissionKey: "execute",
      },
      {
        key: "all",
        label: "All",
        type: "checkbox",
        align: "center",
        permissionKey: "all",
      },
      {
        key: "status",
        label: "Status",
        type: "status",
        align: "center",
      },
      {
        key: "action",
        label: "Action",
        type: "action",
        align: "center",
      },
    ],
    []
  );

  const permissionsData = useMemo<UserPermission[]>(
    () => [
      {
        id: "1",
        users: "Manage Users",
        admin: true,
        view: true,
        edit: false,
        execute: false,
        all: false,
        status: "active",
      },
      {
        id: "2",
        users: "Edit Content",
        admin: true,
        view: true,
        edit: true,
        execute: false,
        all: false,
        status: "offline",
      },
      {
        id: "3",
        users: "View Dashboard",
        admin: true,
        view: true,
        edit: true,
        execute: false,
        all: false,
        status: "active",
      },
    ],
    []
  );

  const handlePermissionChange = useCallback(
    (
      rowId: string,
      permission: keyof Omit<UserPermission, "id" | "users" | "status">
    ) => {
      console.log("Permission changed:", { rowId, permission });
    },
    []
  );

  const handleEdit = useCallback(
    (id: string) => {
      onEdit?.(id);
    },
    [onEdit]
  );

  const handleDelete = useCallback(
    (id: string) => {
      onDelete?.(id);
    },
    [onDelete]
  );

  const renderCell = useCallback(
    (column: ColumnConfig, row: UserPermission, index: number) => {
      const isFirst = index === 0;
      const isLast = index === columns.length - 1;
      const alignClass =
        column.align === "left"
          ? "text-left"
          : column.align === "right"
          ? "text-right"
          : "text-center";
      const baseCellClassName = `px-4 py-2 ${alignClass} ${
        isDark ? "!text-white" : "!text-gray-700"
      }`;
      const roundedClassName = isFirst
        ? "rounded-tl-lg rounded-bl-lg"
        : isLast
        ? "rounded-tr-lg rounded-br-lg"
        : "";

      const getBorderStyle = () => {
        if (isDark) return {};
        const style: React.CSSProperties = {
          borderTop: "1px solid #EEF4FF",
          borderBottom: "1px solid #EEF4FF",
        };
        if (isFirst) style.borderLeft = "1px solid #EEF4FF";
        if (isLast) style.borderRight = "1px solid #EEF4FF";
        return style;
      };

      switch (column.type) {
        case "text":
          return (
            <td
              key={column.key}
              className={`${baseCellClassName} text-sm text-left ${roundedClassName}`}
              style={getBorderStyle()}
            >
              <span
                className={`text-sm font-medium ${
                  isDark ? "text-white" : "text-[#162230]"
                }`}
              >
                {row[column.key as keyof UserPermission] as string}
              </span>
            </td>
          );

        case "checkbox":
          return (
            <td
              key={column.key}
              className={`${baseCellClassName} ${roundedClassName}`}
              style={getBorderStyle()}
            >
              <div className="flex items-center justify-center">
                <CheckboxCell
                  checked={row[column.permissionKey!] as boolean}
                  onChange={() =>
                    handlePermissionChange(row.id, column.permissionKey!)
                  }
                />
              </div>
            </td>
          );

        case "status":
          return (
            <td
              key={column.key}
              className={`${baseCellClassName} ${roundedClassName}`}
              style={getBorderStyle()}
            >
              <div className="flex items-center justify-center">
                <StatusBadge
                  status={{
                    label: row.status === "active" ? "Active" : "Offline",
                    variant: row.status,
                  }}
                />
              </div>
            </td>
          );

        case "action":
          return (
            <td
              key={column.key}
              className={`${baseCellClassName} ${roundedClassName}`}
              style={getBorderStyle()}
            >
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => handleEdit(row.id)}
                  className="p-1 rounded hover:opacity-80 transition-opacity"
                  aria-label="Edit"
                >
                  <EditIcon theme={theme} height={18} />
                </button>
                <button
                  onClick={() => handleDelete(row.id)}
                  className="p-1 rounded hover:opacity-80 transition-opacity"
                  aria-label="Delete"
                >
                  <DeleteIcon color="#F54960" height={18} />
                </button>
              </div>
            </td>
          );

        default:
          return null;
      }
    },
    [
      isDark,
      theme,
      columns.length,
      handlePermissionChange,
      handleEdit,
      handleDelete,
    ]
  );

  return (
    <>
      <h2
        className={`text-xl font-medium mb-0 ${
          isDark ? "text-white" : "text-[#162230]"
        }`}
      >
        User Permission
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-1">
          <thead>
            <tr
              className={!isDark ? "rounded-lg" : ""}
              style={
                !isDark
                  ? {
                      boxShadow: "1px 4px 6px rgba(33, 84, 238, 0.1)",
                    }
                  : undefined
              }
            >
              {columns.map((column, index) => {
                const isFirst = index === 0;
                const isLast = index === columns.length - 1;
                const alignClass =
                  column.align === "left"
                    ? "text-left"
                    : column.align === "right"
                    ? "text-right"
                    : "text-center";
                return (
                  <th
                    key={column.key}
                    className={`px-4 py-2 ${alignClass} text-sm font-medium ${
                      isDark ? "text-[#FFFFFF]" : "text-[#162230]"
                    } ${
                      !isDark && isFirst
                        ? "rounded-tl-lg rounded-bl-lg"
                        : !isDark && isLast
                        ? "rounded-tr-lg rounded-br-lg"
                        : ""
                    }`}
                    style={
                      !isDark
                        ? {
                            borderTop: "1px solid #EEF4FF",
                            borderBottom: "1px solid #EEF4FF",
                            ...(isFirst && { borderLeft: "1px solid #EEF4FF" }),
                            ...(isLast && { borderRight: "1px solid #EEF4FF" }),
                          }
                        : {}
                    }
                  >
                    {column.label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {permissionsData.map((row) => (
              <tr
                key={row.id}
                className={`transition-all duration-200 rounded-lg overflow-hidden ${
                  isDark
                    ? "bg-[#0F1724] hover:bg-[#1A2335]"
                    : "bg-white hover:bg-gray-50"
                } shadow-sm`}
              >
                {columns.map((column, index) => renderCell(column, row, index))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserPermission;
