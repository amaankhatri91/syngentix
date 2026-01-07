import { AgentFormValues } from "@/views/Agents/types";
import ApiService from "./ApiService";

export async function apiCreateAgent(data: AgentFormValues, workspaceId: string) {
  return ApiService.fetchData({
    url: "/v1/agents/",
    method: "post",
    params: {
      workspace_id: workspaceId,
    },
    data: {
      name: data.agentName,
      description: data.description,
      workspace_id: workspaceId,
    },
  });
}

export async function apiEditAgent(data: {
  id: string;
  agentName: string;
  description: string;
  workspaceId: string;
}) {
  return ApiService.fetchData({
    url: `/v1/agents/${data?.id}`,
    method: "put",
    params: {
      workspace_id: data.workspaceId,
    },
    data: {
      name: data.agentName,
      description: data.description,
    },
  });
}

export async function apiDeleteAgent(
  agentId: string,
  workspaceId: string
) {
  return ApiService.fetchData({
    url: `/v1/agents/${agentId}`,
    method: "delete",
    params: {
      workspace_id: workspaceId,
    },
  });
}

export async function apiUpdateAgentStatus(
  agentId: string,
  status: boolean,
  workspaceId: string
) {
  return ApiService.fetchData({
    url: `/v1/agents/${agentId}/status`,
    method: "patch",
    params: {
      workspace_id: workspaceId,
    },
    data: {
      status: status,
    },
  });
}
