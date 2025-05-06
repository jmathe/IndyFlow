// src/hooks/project/useDeleteProject.ts

import { deleteProjectRequest } from "@/infrastructure/services/project.service";
import logger from "@/lib/logger";
import {
  notifyMutationError,
  notifyMutationSuccess,
} from "@/lib/notify/notifyHelpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * React Query mutation hook to delete a project by ID.
 *
 * - Calls deleteProjectRequest service
 * - Invalidates project list cache on success
 * - Displays notifications and logs throughout
 *
 * @function useDeleteProject
 * @returns {UseMutationResult<void, Error, string>} Mutation result
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * Function to perform the deletion
     * @param {string} id - ID of the project to delete
     */
    mutationFn: async (id: string) => {
      await deleteProjectRequest(id);
    },

    /**
     * Handle success: invalidate cache and notify user
     */
    onSuccess: (_, id) => {
      logger.info("useDeleteProject: Project deleted", { id });
      notifyMutationSuccess("delete", "Project", {
        details: { id },
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },

    /**
     * Handle error: log and notify
     */
    onError: (error, id) => {
      logger.error("useDeleteProject: Failed to delete project", error);

      notifyMutationError("delete", "Project", error, {
        details: { id },
      });
    },
  });
}
