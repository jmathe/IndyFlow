// src/hooks/project/useCreateProject.ts

import { CreateProjectPayload, ProjectDTO } from "@/core/domain/project/types";
import { createProjectRequest } from "@/infrastructure/services/project.service";
import logger from "@/lib/logger";
import {
  notifyMutationError,
  notifyMutationSuccess,
} from "@/lib/notify/notifyHelpers";
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

  return useMutation<ProjectDTO, unknown, CreateProjectPayload>({
    /**
     * Mutation function: sends a POST request to create a new project.
     *
     * @param {CreateProjectPayload} data - Project creation payload.
     * @returns {Promise<ProjectDTO>} The created project.
     */
    mutationFn: (data: CreateProjectPayload) => createProjectRequest(data),

    /**
     * Callback on successful project creation.
     * Logs success and invalidates project cache.
     *
     * @param {ProjectDTO} newProject - The created project returned from the server.
     */
    onSuccess: (newProject) => {
      notifyMutationSuccess("create", "Project", {
        details: { id: newProject.id, title: newProject.title },
      });
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

      notifyMutationError("create", "Project", error);
    },
  });
}
