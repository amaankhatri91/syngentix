import { WorkflowFormValues } from "@/views/Workflows/types";
import ApiService from "./ApiService";

export async function apiCreateWorkflow(data: WorkflowFormValues & { agentId?: string }) {
  const url = data.agentId 
    ? `/v1/workflow/?agent_id=${data.agentId}`
    : "/v1/workflow/";
  
  return ApiService.fetchData({
    url,
    method: "post",
    data: {
      title: data.title,
      description: data.description,
    },
  });
}

export async function apiEditWorkflow(data: {
  id: string;
  title: string;
  description: string;
}) {
  return ApiService.fetchData({
    url: `/v1/workflow/${data?.id}`,
    method: "put",
    data: {
      title: data.title,
      description: data.description,
    },
  });
}

