import { createApi } from "@reduxjs/toolkit/query/react";
import BaseService from "./BaseService";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import type { AgentsResponse } from "@/views/Agents/types";
import type { WorkflowsResponse } from "@/views/Workflows/types";
import type { WorkspacesResponse } from "@/@types/auth";
import type { NodesResponse } from "@/views/WorkflowEditor/type";

const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
    },
    unknown,
    unknown
  > =>
  async (request) => {
    try {
      const response = await BaseService(request);
      return { data: response.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

const RtkQueryService = createApi({
  reducerPath: "rtkApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Agents", "Workflows", "Workspaces", "Nodes"],
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: false,
  endpoints: (builder) => ({
    getAgents: builder.query<AgentsResponse, string | undefined>({
      query: (workspaceId) => ({
        url: "/v1/agents/",
        method: "get",
        params: workspaceId ? { workspace_id: workspaceId } : undefined,
      }),
      // Cache the data for 1 hour (3600 seconds)
      // Data will be cached and reused when navigating back
      keepUnusedDataFor: 3600,
      // Provide tags for cache invalidation if needed
      providesTags: ["Agents"],
    }),
    getWorkflows: builder.query<
      WorkflowsResponse,
      {
        agentId: string;
        workspaceId?: string;
        page?: number;
        limit?: number;
        search?: string;
        status?: boolean;
        sort_by?: string;
        sort_order?: "ASC" | "DESC";
      }
    >({
      query: ({
        agentId,
        workspaceId,
        page = 1,
        limit = 10,
        search,
        status,
        sort_by = "updated_at",
        sort_order = "DESC",
      }) => {
        const params: Record<string, any> = {};
        if (workspaceId) params.workspace_id = workspaceId;
        if (page) params.page = page;
        if (limit) params.limit = limit;
        if (search) params.search = search;
        if (status !== undefined) params.status = status;
        if (sort_by) params.sort_by = sort_by;
        if (sort_order) params.sort_order = sort_order;

        return {
          url: `/v1/workflows/${agentId}`,
          method: "get",
          params: Object.keys(params).length > 0 ? params : undefined,
        };
      },
      // Cache the data for 1 hour (3600 seconds)
      keepUnusedDataFor: 3600,
      // Provide tags for cache invalidation if needed
      providesTags: ["Workflows"],
    }),
    getWorkspaces: builder.query<WorkspacesResponse, void>({
      query: () => ({
        url: "/v1/workspaces/discovery",
        method: "get",
      }),
      // Cache the data for 1 hour (3600 seconds)
      keepUnusedDataFor: 3600,
      // Provide tags for cache invalidation if needed
      providesTags: ["Workspaces"],
    }),
    getNodes: builder.query<NodesResponse, void>({
      query: () => ({
        url: "/v1/nodes/",
        method: "get",
      }),
      // Cache the data for 1 hour (3600 seconds)
      keepUnusedDataFor: 3600,
      // Provide tags for cache invalidation if needed
      providesTags: ["Nodes"],
    }),
  }),
});

export default RtkQueryService;

// Export hooks for usage in components
export const {
  useGetAgentsQuery,
  useLazyGetAgentsQuery,
  useGetWorkflowsQuery,
  useLazyGetWorkflowsQuery,
  useGetWorkspacesQuery,
  useLazyGetWorkspacesQuery,
  useGetNodesQuery,
  useLazyGetNodesQuery,
} = RtkQueryService;
