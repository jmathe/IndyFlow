// src/hooks/project/useProject.ts

import { ProjectDTO } from "@/core/domain/project/types";
import { getProjectRequest } from "@/infrastructure/services/project.service";
import logger from "@/lib/logger";
import { notifyMutationError } from "@/lib/notify/notifyHelpers";
import { useQuery } from "@tanstack/react-query";

/**
 * Custom hook to fetch a project by ID.
 *
 * @param {string} id - The project ID to fetch
 * @returns Query result with the project data
 */
export function useProject(id: string) {
  // Define options separately to ensure correct type inference
  const options = {
    /**
     * Unique cache key based on project ID
     */
    queryKey: ["project", id],

    /**
     * Query function calling the service to retrieve the project
     *
     * @returns {Promise<ProjectDTO>} The project
     */
    queryFn: () => getProjectRequest(id),

    /**
     * Disable query if no ID is provided (undefined or empty)
     */
    enabled: !!id,

    /**
     * Callback when the project is successfully retrieved.
     * Logs the result.
     *
     * @param {ProjectDTO} project - The retrieved project
     */
    onSuccess: (project: ProjectDTO) => {
      logger.info("useProject: Project fetched", { id: project.id });
    },

    /**
     * Callback when an error occurs during the fetch.
     * Displays toast and logs the error.
     *
     * @param {unknown} error - The error thrown during query
     */
    onError: (error: unknown) => {
      logger.error("useProject: Failed to fetch project", error);

      notifyMutationError("get", "Project", error, {
        details: { id },
      });
    },
  } as const;

  return useQuery(options);
}
