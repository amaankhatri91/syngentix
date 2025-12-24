import { createApi } from '@reduxjs/toolkit/query/react'
import BaseService from './BaseService'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import type { AxiosRequestConfig, AxiosError } from 'axios'
import type { AgentsResponse } from '@/views/Agents/types'

const axiosBaseQuery =
    (): BaseQueryFn<
        {
            url: string
            method: AxiosRequestConfig['method']
            data?: AxiosRequestConfig['data']
            params?: AxiosRequestConfig['params']
        },
        unknown,
        unknown
    > =>
    async (request) => {
        try {
            const response = await BaseService(request)
            return { data: response.data }
        } catch (axiosError) {
            const err = axiosError as AxiosError
            return {
                error: {
                    status: err.response?.status,
                    data: err.response?.data || err.message,
                },
            }
        }
    }

const RtkQueryService = createApi({
    reducerPath: 'rtkApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Agents'],
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
    endpoints: (builder) => ({
        getAgents: builder.query<AgentsResponse, void>({
            query: () => ({
                url: '/v1/agents/',
                method: 'get',
            }),
            // Cache the data for 1 hour (3600 seconds)
            // Data will be cached and reused when navigating back
            keepUnusedDataFor: 3600,
            // Provide tags for cache invalidation if needed
            providesTags: ['Agents'],
        }),
    }),
})

export default RtkQueryService

// Export hooks for usage in components
export const { 
    useGetAgentsQuery, 
    useLazyGetAgentsQuery,
} = RtkQueryService
