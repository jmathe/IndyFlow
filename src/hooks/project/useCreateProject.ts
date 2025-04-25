// src/hooks/project/useCreateProject.ts

import { ProjectCreateDTO, ProjectDTO } from "@/core/domain/project/types";
import { createProjectRequest } from "@/infrastructure/services/project.service";
import logger from "@/lib/logger";
import { notify } from "@/lib/notify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * React Query mutation hook for creating a new project.
 *
 * Responsibilities:
 * - Sends the project creation request via the service layer
 * - Invalidates the "projects" cache on success
 * - Handles toast notifications and logging
 *
 * @returns {UseMutationResult<ProjectDTO, unknown, ProjectCreateDTO>}
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation<ProjectDTO, unknown, ProjectCreateDTO>({
    /**
     * Mutation function: sends a POST request to create a new project.
     *
     * @param {ProjectCreateDTO} data - Project creation payload.
     * @returns {Promise<ProjectDTO>} The created project.
     */
    mutationFn: (data) => createProjectRequest(data),

    /**
     * Callback on successful project creation.
     * Logs success and invalidates project cache.
     *
     * @param {ProjectDTO} newProject - The created project returned from the server.
     */
    onSuccess: (newProject) => {
      notify.success("Project successfully created");
      logger.info("useCreateProject: Project created", {
        id: newProject.id,
        title: newProject.title,
      });

      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },

    /**
     * Callback on error during creation.
     * Logs and displays an error notification.
     *
     * @param {unknown} error - Error thrown by the mutation.
     */
    onError: (error) => {
      logger.error("useCreateProject: Error creating project", error);

      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      notify.error("Project creation failed", message);
    },
  });
}
