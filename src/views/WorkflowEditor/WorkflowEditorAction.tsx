import Breadcrumb from "@/components/Breadcrumb";
import { useParams, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store";
import { sidebarIcon } from "@/utils/logoUtils";
import { setSidebarOpen } from "@/store/auth/authSlice";

const WorkflowEditorAction = () => {
  const { sidebarOpen } = useAppSelector((state) => state.auth);
  const { agentId } = useParams<{
    agentId: string;
  }>();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const workflowTitleFromState = (location.state as any)?.workflowTitle;

  return (
    <>
      <div className="mb-2 flex gap-4">
        <button
          onClick={() => {
            dispatch(setSidebarOpen(!sidebarOpen));
          }}
          className=""
        >
          <img src={sidebarIcon(sidebarOpen)} alt="icon" />
        </button>
        <Breadcrumb
          items={[
            { label: "Financial Agents", href: "/agents" },
            { label: "Workflows", href: `/agents/${agentId}` },
            { label: workflowTitleFromState || "Workflow" },
          ]}
        />
      </div>
    </>
  );
};

export default WorkflowEditorAction;
