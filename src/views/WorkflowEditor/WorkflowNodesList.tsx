import { Button } from "@/components/Button";
import { SearchInput } from "@/components/SearchInput";
import useTheme from "@/utils/hooks/useTheme";
import { useState, useMemo } from "react";
import DocumentIcon from "@/assets/app-icons/DocumentIcon";
import { MenuIcon } from "@/assets/app-icons";
import { useGetNodesQuery } from "@/services/RtkQueryService";
import { getCategoryColor } from "@/utils/common";

const WorkflowNodesList = () => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, error } = useGetNodesQuery();

  console.log(data, "Please Verify Data Listing");

  const filteredNodes = useMemo(() => {
    const nodes = data?.data || [];
    if (!searchQuery.trim()) return nodes;
    const query = searchQuery.toLowerCase();
    return nodes.filter(
      (node) =>
        node.name?.toLowerCase().includes(query) ||
        node.description?.toLowerCase().includes(query) ||
        node.category?.toLowerCase().includes(query)
    );
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
        ) : filteredNodes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No nodes found</div>
        ) : (
          filteredNodes.map((node) => (
            <div
              key={node.id}
              className={`
              p-3 mb-3 rounded-2xl transition-all
              ${
                isDark
                  ? "bg-[#0C1116]  border border-[#2B3643]"
                  : "bg-[#FFFFFF] border border-[#EEF4FF]  shadow-[inset_1px_-6px_6px_0px_#2154EE1A]"
              }
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
                  <img src={node?.icon} alt="" />
                  {/* <DocumentIcon color={"white"} size={16} /> */}
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className={`font-medium mb-1 ${
                      isDark ? "text-white" : "text-[#162230]"
                    }`}
                  >
                    {node?.name}
                  </h4>
                  <p
                    className={`text-sm mb-2 ${
                      isDark ? "text-[#BDC9F5]" : "text-[#848A94]"
                    }`}
                  >
                    {node?.description}
                  </p>
                  {/* Category Badge */}
                  {node?.category && (
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`text-sm px-2.5 py-1 rounded-full font-medium ${getCategoryColor(
                          node.category,
                          isDark
                        )}`}
                      >
                        {node?.category}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WorkflowNodesList;
