import Breadcrumb from "@/components/Breadcrumb";
import useTheme from "@/utils/hooks/useTheme";

const AgentDetailAction = () => {
  const { isDark } = useTheme();

  return (
    <>
      <div className="mb-2">
        <Breadcrumb
          items={[
            { label: "Financial Agents", href: "/financial-agents" },
            { label: "Workflows" },
          ]}
        />
      </div>
      <hr
        className={`border-t ${
          isDark ? "border-[#2B3643]" : "border-[#DFE1E8]"
        }`}
      />
    </>
  );
};

export default AgentDetailAction;
