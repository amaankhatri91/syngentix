import { AgentFormValues } from "@/views/Agents/types";
import ApiService from "./ApiService";

export async function apiCreateAgent(data: AgentFormValues) {
  return ApiService.fetchData({
    url: "/v1/agents/",
    method: "post",
    data: {
      name: data.agentName,
      description: data.description,
    },
  });
}

export async function apiEditAgent(data: {
  id: string;
  agentName: string;
  description: string;
}) {
  return ApiService.fetchData({
    url: `/v1/agents/${data?.id}`,
    method: "put",
    data: {
      name: data.agentName,
      description: data.description,
    },
  });
}
