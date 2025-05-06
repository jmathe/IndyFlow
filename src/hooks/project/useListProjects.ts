// src/hooks/project/useListProjects.ts

import {
  ListProjectsParams,
  ListProjectsResponse,
} from "@/core/domain/project/types";
import { listProjectsRequest } from "@/infrastructure/services/project.service";
import logger from "@/lib/logger";
import {
  notifyMutationError,
  notifyMutationSuccess,
} from "@/lib/notify/notifyHelpers";
import { useQuery } from "@tanstack/react-query";

/**
 * Custom React Query hook to fetch a paginated list of projects.
 *
 * - Calls the listProjectsRequest service
 * - Handles logging and error notifications
 * - Keeps previous data during pagination
 *
 * @function useListProjects
 * @param {ListProjectsParams} params - The pagination parameters
 * @returns {UseQueryResult<ListProjectsResponse>} Query result object
 */
export function useListProjects({ page, limit }: ListProjectsParams) {
  const options = {
    /**
     * Cache key based on the current page
     */
    queryKey: ["projects", page],

    /**
     * Function calling the service to fetch paginated projects
     *
     * @returns {Promise<ListProjectsResponse>} The paginated projects
     */
    queryFn: () => listProjectsRequest({ page, limit }),

    /**
     * Enables caching of previous result during loading of next page
     */
    keepPreviousData: true,

    /**
     * Logs the result on successful fetch
     *
     * @param {ListProjectsResponse} result - The paginated response
     */
    onSuccess: (result: ListProjectsResponse) => {
      logger.info("useListProjects: Projects fetched successfully", {
        page,
        count: result.data.length,
        total: result.totalCount,
      });
      notifyMutationSuccess("list", "Project", {
        details: { count: result.data.length },
      });
    },

    /**
     * Handles error thrown by query function
     *
     * @param {unknown} error - The error thrown during fetch
     */
    onError: (error: unknown) => {
      logger.error("useListProjects: Failed to fetch projects", error);

      notifyMutationError("list", "Project", error);
    },
  } as const;

  return useQuery(options);
}
