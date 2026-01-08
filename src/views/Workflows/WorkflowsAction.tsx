import { Button } from "@/components/Button";
import Add from "@/assets/app-icons/Add";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setWorkflowDialog,
  setWorkflowSearch,
  setWorkflowStatus,
  setWorkflowSort,
} from "@/store/workflow/workflowSlice";
import Select, { components } from "react-select";
import useTheme from "@/utils/hooks/useTheme";
import { SearchInput } from "@/components/SearchInput";
import { useState } from "react";
import Search from "@/assets/app-icons/Search";
import { getWorkflowSelectStyles } from "@/utils/common";
import {
  SelectOption,
  statusOptions,
  sortOptions,
} from "@/constants/workflow.constant";
import SelectDropdownIndicator from "@/components/SelectDropdownIndicator";

const WorkflowsAction = () => {
  const dispatch = useAppDispatch();
  const { isDark } = useTheme();
  const { search, status, sort_by, sort_order } = useAppSelector(
    (state) => state.workflow
  );
  const [localSearchValue, setLocalSearchValue] = useState<string>(search);
  const [selectedStatus, setSelectedStatus] = useState<SelectOption>(
    status !== undefined
      ? statusOptions.find((opt) => opt.value === status) || statusOptions[0]
      : statusOptions[0]
  );
  const [selectedSort, setSelectedSort] = useState<SelectOption>(() => {
    const sortValue = `${sort_by}-${sort_order.toLowerCase()}`;
    return sortOptions.find((opt) => opt.value === sortValue) || sortOptions[0];
  });

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-[18px]">Workflow</h2>
        <Button
          onClick={() => {
            dispatch(
              setWorkflowDialog({
                workflowDialog: true,
                workflowRow: {},
              })
            );
          }}
          icon={<Add size={18} />}
          className="px-3 !py-2 !rounded-lg !text-white !bg-gradient-to-r from-[#9133ea] to-[#2962eb]"
        >
          Create Workflow
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-[460px]">
          <SearchInput
            placeholder="Search workflow or other..."
            width="w-full"
            value={localSearchValue}
            onChange={(value) => setLocalSearchValue(value)}
            onSearch={(value) => dispatch(setWorkflowSearch(value))}
            iconComponent={
              <div className="pl-1">
                <Search color={isDark ? "#FFFFFF" : "#0C1116"} size={18} />
              </div>
            }
            inputClassName={`!py-[23px] 
              ${
                isDark
                  ? "!bg-[#0F141D] !text-white !placeholder-[#FFFFFF] !border-[#2B3643]"
                  : "!bg-white !text-gray-900 !placeholder-gray-600 !border-[#B7C0CF]"
              }
              !border !rounded-lg
            `}
          />
        </div>
        <div className="w-[140px]">
          <Select
            value={selectedStatus}
            onChange={(option) => {
              const selected = option as SelectOption;
              setSelectedStatus(selected);
              dispatch(setWorkflowStatus(selected.value as boolean));
            }}
            options={statusOptions}
            styles={getWorkflowSelectStyles<SelectOption>(isDark)}
            classNamePrefix="react-select"
            components={{ DropdownIndicator: SelectDropdownIndicator }}
            isSearchable={false}
          />
        </div>
        <div className="w-[230px]">
          <Select
            value={selectedSort}
            onChange={(option) => {
              const selected = option as SelectOption;
              setSelectedSort(selected);
              // Split the value (e.g., "updated_at-asc") into sort_by and sort_order
              const [sortBy, sortOrder] = (selected.value as string).split("-");
              dispatch(
                setWorkflowSort({
                  sort_by: sortBy,
                  sort_order: sortOrder.toUpperCase() as "ASC" | "DESC",
                })
              );
            }}
            options={sortOptions}
            styles={getWorkflowSelectStyles<SelectOption>(isDark)}
            classNamePrefix="react-select"
            components={{ DropdownIndicator: SelectDropdownIndicator }}
            isSearchable={false}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkflowsAction;
