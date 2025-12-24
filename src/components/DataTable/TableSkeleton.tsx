import React from 'react'
import { DataTableColumn } from './types';

export const TableSkeleton = ({
  columns,
  rows = 5,
  enableRowSelection = false,
  isDark = false,
}: {
  columns: DataTableColumn<any>[];
  rows?: number;
  enableRowSelection?: boolean;
  isDark?: boolean;
}) => {
  const totalColumns = enableRowSelection ? columns.length  : columns.length;

  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr
          key={rowIndex}
          className={`transition-all duration-200 rounded-lg overflow-hidden ${
            isDark
              ? "bg-[#0F1724] hover:bg-[#1A2335]"
              : "bg-white hover:bg-gray-50"
          } shadow-sm`}
        >
          {Array.from({ length: totalColumns }).map((_, colIndex) => {
            const isSelectCell = enableRowSelection && colIndex === 0;
            const isFirst = colIndex === 0;
            const isLast = colIndex === totalColumns - 1;
            const column = enableRowSelection
              ? colIndex === 0
                ? null
                : columns[colIndex - 1]
              : columns[colIndex];
            const align = column?.align ?? "left";
            const textAlignClass =
              align === "center"
                ? "text-center"
                : align === "right"
                ? "text-right"
                : "text-start";

            return (
              <td
                key={colIndex}
                className={`px-4 py-1 text-sm ${textAlignClass} ${
                  isFirst ? "rounded-tl-lg rounded-bl-lg" : ""
                } ${isLast ? "rounded-tr-lg rounded-br-lg" : ""} ${
                  isDark ? "!text-white" : "!text-gray-700"
                }`}
                style={{
                  width: column?.size ? `${column.size}px` : undefined,
                  ...(!isDark
                    ? {
                        borderTop: "1px solid #EEF4FF",
                        borderBottom: "1px solid #EEF4FF",
                        borderLeft: isFirst
                          ? "1px solid #EEF4FF"
                          : "none",
                        borderRight: isLast ? "1px solid #EEF4FF" : "none",
                      }
                    : {}),
                }}
              >
                {isSelectCell ? (
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded border-2 ${
                        isDark
                          ? "border-gray-600 bg-gray-700"
                          : "border-gray-300 bg-gray-100"
                      } animate-pulse`}
                    />
                  </div>
                ) : (
                  <div
                    className={`h-4 rounded animate-pulse ${
                      isDark ? "bg-gray-700" : "bg-gray-200"
                    }`}
                    style={{
                      width: `${Math.random() * 40 + 60}%`,
                    }}
                  />
                )}
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
};