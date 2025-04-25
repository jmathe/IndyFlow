"use client";

import { ListProjectsResult } from "@/core/domain/project/types";
import { listProjectsByContact } from "@/infrastructure/services/project.service";
import { AppError } from "@/lib/errors/AppError";
import logger from "@/lib/logger";
import { notify } from "@/lib/notify";
import { useQuery } from "@tanstack/react-query";

/**
 * Custom hook to fetch a list of projects associated with a contact.
 *
 * - Fetches all projects linked to a specific contact ID
 * - Handles logging and error notifications
 * - Disables query if no contact ID is provided
 *
 * @function useListProjectsByContact
 * @param {string} contactId - The contact's unique identifier
 * @returns {UseQueryResult<ListProjectsResult>} Query result containing the projects list
 */
export function useListProjectsByContact(contactId: string) {
  const options = {
    /**
     * Unique cache key based on the contact ID
     */
    queryKey: ["projectsByContact", contactId],

    /**
     * Query function to fetch projects associated with the given contact
     */
    queryFn: () => listProjectsByContact(contactId),

    /**
     * Only run the query if contactId is defined
     */
    enabled: !!contactId,

    /**
     * Handle success response
     *
     * @param {ListProjectsResponse} data - Response data
     */
    onSuccess: (data: ListProjectsResult) => {
      logger.info("useListProjectsByContact: Projects fetched successfully", {
        contactId,
        projectCount: data.data.length,
      });
    },

    /**
     * Handle errors during fetch
     *
     * @param {unknown} error - Error thrown during the query
     */
    onError: (error: unknown) => {
      logger.error(
        "useListProjectsByContact: Failed to fetch projects by contact",
        error
      );

      const message =
        error instanceof AppError
          ? error.message
          : (error as Error).message || "An unexpected error occurred";

      notify.error("Failed to load projects", message);
    },
  } as const;

  return useQuery(options);
}
