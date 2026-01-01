import { Button } from "@/components/Button";
import { SearchInput } from "@/components/SearchInput";
import useTheme from "@/utils/hooks/useTheme";
import { useState, useMemo, useEffect } from "react";
import DocumentIcon from "@/assets/app-icons/DocumentIcon";
import { MenuIcon, ChevronDownIcon } from "@/assets/app-icons";
import { useGetNodesQuery } from "@/services/RtkQueryService";
import { getCategoryColor } from "@/utils/common";
import { NodeCategory } from "./type";

const WorkflowNodesList = () => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const { data, isLoading, error } = useGetNodesQuery();

  // Expand all categories by default when data loads
  useEffect(() => {
    if (data?.data && data.data.length > 0) {
      const allCategoryNames = new Set(data.data.map((cat) => cat.name));
      setExpandedCategories(allCategoryNames);
    }
  }, [data]);

  console.log(data, "Please Verify Data Listing");

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName);
      } else {
        newSet.add(categoryName);
      }
      return newSet;
    });
  };

  const filteredCategories = useMemo(() => {
    const categories = data?.data || [];
    if (!searchQuery.trim()) return categories;
    const query = searchQuery.toLowerCase();
    return categories
      .map((category) => {
        const filteredNodes = category.nodes.filter(
          (node) =>
            node.name?.toLowerCase().includes(query) ||
            node.description?.toLowerCase().includes(query) ||
            category.name?.toLowerCase().includes(query) ||
            category.category?.toLowerCase().includes(query)
        );
        return {
          ...category,
          nodes: filteredNodes,
        };
      })
      .filter((category) => category.nodes.length > 0);
  }, [searchQuery, data]);

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
            onClick={() => {
              console.log("New node clicked");
            }}
            icon={<MenuIcon color="white" size={16} />}
            className="px-2.5 rounded-2xl !py-2 !text-white !bg-gradient-to-r from-[#9133EA] to-[#2962EB]"
          />
        </div>
        <SearchInput
          placeholder="Search Node"
          onSearch={(value) => {
            setSearchQuery(value);
          }}
          width="w-full"
          className="text-sm text-[#0C1116] w-full text-[14px] mb-4"
          debounceDelay={300}
        />
      </div>
      <div className="flex-1 overflow-y-auto nodes-list-scrollbar px-4 pb-4 min-h-0">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading nodes...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Error loading nodes
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No nodes found</div>
        ) : (
          filteredCategories.map((category) => {
            const isExpanded = expandedCategories.has(category.name);
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
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.name)}
                  className={`
                    w-full p-3 flex items-center justify-between
                    ${isExpanded ? "rounded-t-2xl" : "rounded-2xl"}
                    ${isDark ? "hover:bg-[#1A1F2E]" : ""}
                    transition-colors
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
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDownIcon
                      color={isDark ? "white" : "#162230"}
                      size={12}
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
                    {category.nodes.map((node, index) => (
                      <div key={node.id}>
                        <div
                          className={`
                          p-3
                          ${
                            isDark
                              ? "hover:bg-[#1A1F2E]"
                              : "hover:bg-[#F9FAFB]"
                          }
                          transition-colors cursor-pointer
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
                              {node.icon ? (
                                <img
                                  src={node.icon}
                                  alt={node.name}
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
