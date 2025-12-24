import { useGetAgentsQuery } from '@/services/RtkQueryService'
import { useAppDispatch } from '@/store'
import RtkQueryService from '@/services/RtkQueryService'

/**
 * Custom hook to provide all refetch functions for RTK Query endpoints
 * This centralizes refetch logic and makes it easier to refresh data across the app
 * 
 * @returns Object containing all refetch functions and cache invalidation
 * 
 * @example
 * ```tsx
 * const { refetchAgents, invalidateAllQueries } = useRefetchQueries()
 * 
 * // After creating/updating an agent
 * await createAgent(data)
 * refetchAgents()
 * 
 * // After login - invalidate all caches
 * invalidateAllQueries()
 * ```
 */
export const useRefetchQueries = () => {
  const dispatch = useAppDispatch()
  
  // Get refetch function from agents query
  // Using skip: true to avoid fetching data, we only need the refetch function
  const { refetch: refetchAgents } = useGetAgentsQuery(undefined, {
    skip: true, // Don't fetch on mount, we only need the refetch function
  })

  return {
    /**
     * Refetch agents list
     */
    refetchAgents: () => {
      return refetchAgents()
    },
    
    /**
     * Refetch all queries (useful for refresh actions)
     */
    refetchAll: async () => {
      const results = await Promise.allSettled([
        refetchAgents(),
        // Add more refetch calls here as you add more queries
      ])
      
      return results
    },
    
    /**
     * Invalidate all query caches
     * This will trigger refetch when components using those queries mount
     * Useful after login/logout to ensure fresh data
     * 
     * @example
     * ```tsx
     * // After successful login
     * await googleSignIn(user)
     * invalidateAllQueries() // All queries will refetch when components load
     * ```
     */
    invalidateAllQueries: () => {
      // Invalidate all cache tags - add more tags here as you add queries
      dispatch(RtkQueryService.util.invalidateTags(['Agents']))
      // When you add more queries, add their tags here:
      // dispatch(RtkQueryService.util.invalidateTags(['Agents', 'Users', 'Products']))
    },
  }
}

export default useRefetchQueries

