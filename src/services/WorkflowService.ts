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

export async function apiDeleteWorkflow(
  workflowId: string,
  workspaceId: string
) {
  return ApiService.fetchData({
    url: `/v1/workflow/${workflowId}`,
    method: "delete",
    params: {
      workspace_id: workspaceId,
    },
  });
}

export async function apiUpdateWorkflowStatus(
  workflowId: string,
  status: boolean,
  workspaceId: string
) {
  return ApiService.fetchData({
    url: `/v1/workflow/${workflowId}/status`,
    method: "patch",
    params: {
      workspace_id: workspaceId,
    },
    data: {
      status: status,
    },
  });
}

export async function apiDuplicateWorkflow(
  sourceAgentId: string,
  workflowId: string,
  targetAgentId: string,
  workflowTitle: string,
  workspaceId: string
) {
  return ApiService.fetchData({
    url: `/v1/agents/${sourceAgentId}/workflow/duplicate`,
    method: "post",
    params: {
      workspace_id: workspaceId,
    },
    data: {
      workflow_id: workflowId,
      agent_id: targetAgentId,
      workflow_title: workflowTitle || undefined,
    },
  });
}

export async function apiGetWorkflowDetails(
  workflowId: string,
  workspaceId: string
) {
  return ApiService.fetchData({
    url: `/v1/workflow/${workflowId}`,
    method: "get",
    params: {
      workspace_id: workspaceId,
    },
  });
}

export async function apiUpdateWorkflowSettings(
  workflowId: string,
  data: {
    title: string;
    description: string;
    execution_timeout: number;
    retry_attempts: number;
    concurrency_limit: boolean;
  },
  workspaceId: string
) {
  return ApiService.fetchData({
    url: `/v1/workflow/${workflowId}`,
    method: "put",
    params: {
      workspace_id: workspaceId,
    },
    data,
  });
}
