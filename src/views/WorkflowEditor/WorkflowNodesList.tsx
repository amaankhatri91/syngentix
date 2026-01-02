import { Button } from "@/components/Button";
import { SearchInput } from "@/components/SearchInput";
import useTheme from "@/utils/hooks/useTheme";
import { useMemo, useEffect } from "react";
import DocumentIcon from "@/assets/app-icons/DocumentIcon";
import { MenuIcon } from "@/assets/app-icons";
import { useGetNodesQuery } from "@/services/RtkQueryService";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  setSearchQuery,
  setExpandedCategories,
  toggleCategory,
} from "@/store/workflowEditor/workflowEditorSlice";
import {
  filterCategoriesBySearch,
  getAllCategoryNames,
  isCategoryExpanded,
} from "@/utils/common";
import ChevronRightIcon from "@/assets/app-icons/ChevronRightIcon";
import WorkflowNodesListSkeleton from "./WorkflowNodesListSkeleton";

const WorkflowNodesList = () => {
  const { isDark } = useTheme();
  const dispatch = useAppDispatch();
  const { searchQuery, expandedCategories } = useAppSelector(
    (state) => state.workflowEditor
  );
  const { data, isLoading, error } = useGetNodesQuery();

  // Expand all categories by default when data loads
  useEffect(() => {
    if (data?.data && data.data.length > 0) {
      const allCategoryNames = getAllCategoryNames(data.data);
      dispatch(setExpandedCategories(allCategoryNames));
    }
  }, [data, dispatch]);

  const handleToggleCategory = (categoryName: string) => {
    dispatch(toggleCategory(categoryName));
  };

  const filteredCategories = useMemo(() => {
    const categories = data?.data || [];
    return filterCategoriesBySearch(categories, searchQuery);
  }, [searchQuery, data]);

  const handleToggleAllCategories = () => {
    const categories = filteredCategories || data?.data || [];
    if (categories.length === 0) return;
    const allCategoryNames = getAllCategoryNames(categories);
    const allExpanded = allCategoryNames.every((name) =>
      expandedCategories.includes(name)
    );
    if (allExpanded) {
      // Collapse all
      dispatch(setExpandedCategories([]));
    } else {
      // Expand all
      dispatch(setExpandedCategories(allCategoryNames));
    }
  };

  return (
    <div
      className={`h-full flex flex-col border rounded-2xl ${
        isDark
          ? "bg-[#0F1724]  border-[#2B3643]"
          : "bg-[#FFFFFF]  border-[#EEF4FF] shadow-[1px_4px_6px_0px_#2154EE1A]"
      }`}
    >
      <div className="p-4 pb-0 flex-shrink-0">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3
            className={`text-base text-[18px] font-medium ${
              isDark ? "text-white" : "text-[#162230]"
            }`}
          >
            Available Nodes
          </h3>
          <Button
            onClick={handleToggleAllCategories}
            icon={<MenuIcon color="white" size={16} />}
            className="px-2.5 rounded-2xl !py-2 !text-white !bg-gradient-to-r from-[#9133EA] to-[#2962EB]"
          />
        </div>
        <SearchInput
          placeholder="Search Node"
          onSearch={(value) => {
            dispatch(setSearchQuery(value));
          }}
          width="w-full"
          className="text-sm text-[#0C1116] w-full text-[14px] mb-4"
          debounceDelay={300}
        />
      </div>
      <div className="flex-1 overflow-y-auto nodes-list-scrollbar px-4 pb-4 min-h-0">
        {isLoading ? (
          <WorkflowNodesListSkeleton categoryCount={3} nodesPerCategory={4} />
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Error loading nodes
          </div>
        ) : filteredCategories?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No nodes found</div>
        ) : (
          filteredCategories?.map((category) => {
            const isExpanded = isCategoryExpanded(
              expandedCategories,
              category.name
            );
            return (
              <div
                key={category.category}
                className={`
                  mb-3 transition-all
                  ${isExpanded ? "rounded-2xl" : "rounded-2xl"}
                  ${
                    isDark
                      ? "bg-[#0C1116] border border-[#2B3643]"
                      : "bg-[#FFFFFF] border border-[#EEF4FF] shadow-[inset_1px_-6px_6px_0px_#2154EE1A]"
                  }
                `}
              >
                <button
                  onClick={() => handleToggleCategory(category.name)}
                  className={`
                    w-full p-3 flex items-center justify-between
                    ${isExpanded ? "rounded-t-2xl" : "rounded-2xl"}
                    transition-colors hover:bg-transparent
                  `}
                >
                  <span
                    className={`font-medium ${
                      isDark ? "text-white" : "text-[#162230]"
                    }`}
                  >
                    {category.name}
                  </span>
                  <div
                    className={`transition-transform ${
                      isExpanded ? "-rotate-90" : ""
                    }`}
                  >
                    <ChevronRightIcon
                      color={isDark ? "white" : "#162230"}
                      size={18}
                    />
                  </div>
                </button>
                {/* Category Nodes */}
                {isExpanded && (
                  <div className="rounded-b-2xl">
                    <hr
                      className={`mx-3 ${
                        isDark ? "border-[#2B3643]" : "border-[#EEF4FF]"
                      }`}
                    />
                    {category?.nodes?.map((node, index) => (
                      <div key={node.id}>
                        <div
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData(
                              "application/reactflow",
                              JSON.stringify(node)
                            );
                            e.dataTransfer.effectAllowed = "move";
                          }}
                          className={`
                          p-3
                          transition-colors cursor-grab active:cursor-grabbing hover:bg-transparent
                        `}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                                isDark
                                  ? "bg-[#232634]"
                                  : "bg-gradient-to-r from-[#9133EA] to-[#2962EB]"
                              }`}
                            >
                              {node?.icon ? (
                                <img
                                  src={node?.icon}
                                  alt={node?.name}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <DocumentIcon color="white" size={16} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4
                                className={`font-medium mb-1 ${
                                  isDark ? "text-white" : "text-[#162230]"
                                }`}
                              >
                                {node.name}
                              </h4>
                            </div>
                          </div>
                        </div>
                        {index < category.nodes.length - 1 && (
                          <hr
                            className={`mx-3 ${
                              isDark ? "border-[#2B3643]" : "border-[#EEF4FF]"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default WorkflowNodesList;
