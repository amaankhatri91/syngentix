import React from "react";
import { useParams } from "react-router-dom";
import { useGetWorkflowsQuery } from "@/services/RtkQueryService";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  setWorkflowLimit,
  setWorkflowPage,
} from "@/store/workflow/workflowSlice";
import { DataTable } from "@/components/DataTable";
import { columns } from "./WorkflowsColumn";
import WorkflowSkeleton from "./WorkflowSkeleton";
import Pagination from "@/components/Pagination";
import useTheme from "@/utils/hooks/useTheme";
import Select, { components } from "react-select";
import { getWorkflowSelectStyles, getPaginationValues } from "@/utils/common";
import { limitOptions, LimitOption } from "@/constants/workflow.constant";

const WorkflowList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { agentId } = useParams<{ agentId: string }>();
  const { token, workspace } = useAppSelector((state) => state.auth);
  const { search, status, sort_by, sort_order, limit, page } = useAppSelector(
    (state) => state.workflow
  );
  const { isDark } = useTheme();

  // Only refetches on page refresh or when cache expires (1 hour)
  const { data, isLoading, error }: any = useGetWorkflowsQuery(
    {
      agentId: agentId || "",
      workspaceId: workspace?.id,
      page: page,
      limit: limit,
      search: search || undefined,
      status: status !== undefined ? status : undefined,
      sort_by: sort_by,
      sort_order: sort_order,
    },
    {
      // Skip query if no token, no agentId, or no workspace ID
      skip: !token || !agentId || !workspace?.id,
    }
  );
  const { totalPages, total } = getPaginationValues(data);

  const handlePageChange = (newPage: number) => {
    dispatch(setWorkflowPage(newPage));
  };

  // Show loading state
  if (isLoading) {
    return <WorkflowSkeleton count={3} />;
  }

  // Show error state
  if (error) {
    return (
      <div
        className={`text-center py-8 ${
          isDark ? "text-gray-400" : "text-gray-500"
        }`}
      >
        <h3>Error loading workflows</h3>
      </div>
    );
  }

  // Show empty state
  if (!data?.data || data.data.length === 0) {
    return (
      <div
        className={`text-center py-8 ${
          isDark ? "text-gray-400" : "text-gray-500"
        }`}
      >
        <h3>No data found</h3>
      </div>
    );
  }

  const customStyles = getWorkflowSelectStyles<LimitOption>(isDark);

  const limitSelectStyles = {
    ...customStyles,
    control: (base: any, state: any) => ({
      ...customStyles.control?.(base, state),
      minHeight: "35px",
      maxHeight: "35px",
      height: "35px",
      paddingLeft: "4px",
      paddingRight: "4px",
    }),
    valueContainer: (base: any) => ({
      ...base,
      height: "35px",
      paddingTop: "5px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    singleValue: (base: any) => {
      return {
        ...base,
        color: "#FFFFFF",
        fontSize: "14px",
        fontWeight: "400",
        margin: 0,
        padding: 0,
        textAlign: "center",
        width: "100%",
      };
    },
    input: (base: any) => ({
      ...base,
      margin: "0px",
      padding: 0,
      color: "#FFFFFF",
      fontSize: "14px",
    }),
    indicatorsContainer: (base: any) => ({
      ...base,
      height: "35px",
      paddingRight: "4px",
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: isDark ? "#0C1116" : "#FFFFFF",
      borderRadius: "8px",
      padding: "4px",
      marginTop: "4px",
    }),
    menuList: (base: any) => ({
      ...base,
      padding: 0,
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? isDark
          ? "#1A2335"
          : "#EEF4FF"
        : state.isFocused
        ? isDark
          ? "#1A2335"
          : "#F5F7FA"
        : "transparent",
      color: isDark ? "#FFFFFF" : "#162230",
      borderRadius: "6px",
      padding: "6px 8px",
      margin: "2px 0",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: isDark ? "#1A2335" : "#F5F7FA",
      },
    }),
  };

  const DropdownIndicator = (props: any) => {
    return (
      <components.DropdownIndicator {...props}>
        <svg
          width={12}
          height={12}
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.8">
            <path
              d="M2 4L6 8L10 4"
              stroke={isDark ? "#FFFFFF" : "#0C1116"}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </components.DropdownIndicator>
    );
  };

  const SingleValue = (props: any) => {
    return (
      <components.SingleValue
        {...props}
        style={{ color: "#FFFFFF", textAlign: "center", width: "100%" }}
      >
        {props.children}
      </components.SingleValue>
    );
  };

  const handleLimitChange = (option: LimitOption) => {
    dispatch(setWorkflowLimit(option.value));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg overflow-hidden">
        <DataTable
          data={data?.data || []}
          columns={columns}
          enableRowSelection={false}
          enableSorting={false}
          enablePagination={false}
          getRowId={(row) => row.id}
          emptyMessage="No workflows found"
          loading={isLoading}
        />
      </div>
      {/* Pagination Footer */}
      {total > 0 && (
        <div className={`flex items-center justify-between pt-2 px-2 `}>
          {/* Total Count */}
          <div
            className={`text-sm font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Total Workflow : {total}
          </div>

          {/* Pagination Controls */}
          <div className="flex-1 flex justify-center">
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                showFirstLast={false}
              />
            )}
          </div>
          {/* Show Per Page */}
          <div className="flex items-center gap-2">
            <span
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Show Per Page:
            </span>
            <div className="w-[80px]">
              <Select
                menuPlacement="top"
                value={
                  limitOptions.find((opt) => opt.value === limit) ||
                  limitOptions[0]
                }
                onChange={(option) => handleLimitChange(option as LimitOption)}
                options={limitOptions}
                styles={limitSelectStyles}
                classNamePrefix="react-select"
                components={{ DropdownIndicator, SingleValue }}
                isSearchable={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowList;
