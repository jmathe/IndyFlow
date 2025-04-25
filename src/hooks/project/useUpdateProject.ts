// src/hooks/project/useUpdateProject.ts

import { ProjectUpdateDTO } from "@/core/domain/project/types";
import { updateProjectRequest } from "@/infrastructure/services/project.service";
import { AppError } from "@/lib/errors/AppError";
import logger from "@/lib/logger";
import { notify } from "@/lib/notify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * React Query mutation hook to update a project.
 *
 * Responsibilities:
 * - Calls the updateProjectRequest service
 * - Displays toast notifications based on result
 * - Invalidates project-related queries
 * - Logs the mutation lifecycle
 *
 * @function useUpdateProject
 * @returns {UseMutationResult<ProjectDTO, unknown, { id: string; data: ProjectUpdateDTO }>} The mutation object for updating projects
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * Mutation function that sends a PUT request to the API.
     *
     * @param {{ id: string; data: ProjectUpdateDTO }} input - Project ID and update payload
     * @returns {Promise<ProjectDTO>} The updated project returned by the server
     */
    mutationFn: ({ id, data }: { id: string; data: ProjectUpdateDTO }) =>
      updateProjectRequest(id, data),

    /**
     * Callback executed on successful mutation.
     * Invalidates the individual and list queries, and shows a success toast.
     *
     * @param {ProjectDTO} project - The project that was updated
     */
    onSuccess: (project) => {
      notify.success("Project successfully updated");
      queryClient.invalidateQueries({ queryKey: ["project", project.id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      logger.info("useUpdateProject: Project successfully updated", {
        id: project.id,
      });
    },

    /**
     * Callback executed on mutation error.
     * Displays an error toast and logs the error.
     *
     * @param {unknown} error - The error thrown during the mutation
     */
    onError: (error: unknown) => {
      logger.error("useUpdateProject: Error updating project", error);

      const message =
        error instanceof AppError
          ? error.message
          : (error as Error).message || "An unknown error occurred";

      notify.error("Project update failed", message);
    },
  });
}
