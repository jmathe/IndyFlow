// src/hooks/project/useListProjects.ts

import {
  ListProjectsParams,
  ListProjectsResult,
} from "@/core/domain/project/types";
import { listProjectsRequest } from "@/infrastructure/services/project.service";
import { AppError } from "@/lib/errors/AppError";
import logger from "@/lib/logger";
import { notify } from "@/lib/notify";
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
 * @returns {UseQueryResult<ListProjectsResult>} Query result object
 */
export function useListProjects({ page, limit }: ListProjectsParams) {
  const options = {
    /**
     * Cache key based on the current page
     */
    queryKey: ["projects", page],

    /**
     * Function calling the service to fetch paginated projects
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
    onSuccess: (result: ListProjectsResult) => {
      logger.info("useListProjects: Projects fetched successfully", {
        page,
        count: result.data.length,
        total: result.totalCount,
      });
    },

    /**
     * Handles error thrown by query function
     *
     * @param {unknown} error - The error thrown during fetch
     */
    onError: (error: unknown) => {
      logger.error("useListProjects: Failed to fetch projects", error);

      const message =
        error instanceof AppError
          ? error.message
          : (error as Error).message || "An unexpected error occurred";

      notify.error("Failed to load projects", message);
    },
  } as const;

  return useQuery(options);
}
