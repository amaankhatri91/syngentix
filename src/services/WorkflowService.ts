import { WorkflowFormValues } from "@/views/Workflows/types";
import ApiService from "./ApiService";

export async function apiCreateWorkflow(
  data: WorkflowFormValues & { agentId?: string },
  workspaceId: string
) {
  const params: Record<string, string> = {
    workspace_id: workspaceId,
  };
  
  if (data.agentId) {
    params.agent_id = data.agentId;
  }
  
  return ApiService.fetchData({
    url: "/v1/workflow/",
    method: "post",
    params,
    data: {
      title: data.title,
      description: data.description,
    },
  });
}

export async function apiEditWorkflow(
  data: {
    id: string;
    title: string;
    description: string;
  },
  workspaceId: string
) {
  return ApiService.fetchData({
    url: `/v1/workflow/${data?.id}`,
    method: "put",
    params: {
      workspace_id: workspaceId,
    },
    data: {
      title: data.title,
      description: data.description,
    },
  });
}

