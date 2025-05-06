// src/hooks/project/useUpdateProject.ts

import { UpdateProjectPayload } from "@/core/domain/project/types";
import { updateProjectRequest } from "@/infrastructure/services/project.service";
import logger from "@/lib/logger";
import {
  notifyMutationError,
  notifyMutationSuccess,
} from "@/lib/notify/notifyHelpers";
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
 * @returns {UseMutationResult<ProjectDTO, unknown, { id: string; data: UpdateProjectPayload }>} The mutation object for updating projects
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * Mutation function that sends a PUT request to the API.
     *
     * @param {{ id: string; data: UpdateProjectPayload }} input - Project ID and update payload
     * @returns {Promise<ProjectDTO>} The updated project returned by the server
     */
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectPayload }) =>
      updateProjectRequest(id, data),

    /**
     * Callback executed on successful mutation.
     * Invalidates the individual and list queries, and shows a success toast.
     *
     * @param {ProjectDTO} project - The project that was updated
     */
    onSuccess: (project, variables) => {
      const { promoteContact } = variables.data;
      // If promoteContact is true, notify the user and log the event
      if (promoteContact) {
        notifyMutationSuccess("promote", "Contact", {
          details: { contactId: project.contactId },
        });
        logger.info("useUpdateProject: Contact promoted", {
          contactId: project.contactId,
        });
      }

      notifyMutationSuccess("update", "Project", {
        details: { id: project.id },
      });
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

      notifyMutationError("update", "Project", error);
    },
  });
}
