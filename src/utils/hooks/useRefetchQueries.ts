import { useAppDispatch } from "@/store";
import RtkQueryService from "@/services/RtkQueryService";

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
  const dispatch = useAppDispatch();

  return {
    /**
     * Refetch agents list by invalidating cache
     * This is safer than using refetch() as it doesn't require the query to be started
     */
    refetchAgents: () => {
      try {
        dispatch(RtkQueryService.util.invalidateTags(["Agents"]));
      } catch (error) {
        // Silently handle errors - don't show in toast
        console.warn("Failed to invalidate agents cache:", error);
      }
    },

    /**
     * Refetch all queries (useful for refresh actions)
     */
    refetchAll: async () => {
      try {
        dispatch(RtkQueryService.util.invalidateTags(["Agents", "Workflows"]));
      } catch (error) {
        // Silently handle errors - don't show in toast
        console.warn("Failed to invalidate query caches:", error);
      }
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
      try {
        // Invalidate all cache tags - add more tags here as you add queries
        dispatch(
          RtkQueryService.util.invalidateTags([
            "Agents",
            "Workflows",
            "Workspaces",
          ])
        );
      } catch (error) {
        // Silently handle errors - don't show in toast
        console.warn("Failed to invalidate all query caches:", error);
      }
    },
  };
};

export default useRefetchQueries;
