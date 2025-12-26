import { Button } from "@/components/Button";
import { SearchInput } from "@/components/SearchInput";
import useTheme from "@/utils/hooks/useTheme";
import { useState, useMemo } from "react";
import { getActionButtonColor } from "@/utils/common";
import DocumentIcon from "@/assets/app-icons/DocumentIcon";
import { MenuIcon } from "@/assets/app-icons";
import { dummyNodes } from "./dymmyData";

const WorkFlowNodes = () => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim()) return dummyNodes;
    const query = searchQuery.toLowerCase();
    return dummyNodes.filter(
      (node) =>
        node.title.toLowerCase().includes(query) ||
        node.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div
      className={`h-full flex flex-col border rounded-3xl p-4 ${
        isDark
          ? "bg-[#0F1724]  border-[#2B3643]"
          : "bg-[#FFFFFF]  border-[#EEF4FF] shadow-[1px_4px_6px_0px_#2154EE1A]"
      }`}
    >
      {/* Header */}
      <div className="">
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
      {/* Nodes List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNodes?.map((node) => (
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
                <DocumentIcon color={"white"} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className={`font-medium mb-1 ${
                    isDark ? "text-white" : "text-[#162230]"
                  }`}
                >
                  {node.title}
                </h4>
                <p
                  className={`text-sm mb-2 ${
                    isDark ? "text-[#BDC9F5]" : "text-[#848A94]"
                  }`}
                >
                  {node.description}
                </p>
                {/* Action Buttons */}
                {node.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {node.actions.map((action, index) => (
                      <span
                        key={index}
                        className={`${getActionButtonColor(
                          action.type,
                          isDark
                        )}  text-sm px-3 py-1 rounded-full font-medium`}
                      >
                        {action.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {/* Status Indicator */}
              <div className="flex-shrink-0">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: node.statusColor }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkFlowNodes;
