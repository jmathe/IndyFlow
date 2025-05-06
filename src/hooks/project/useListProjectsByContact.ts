"use client";

import { ListProjectsResponse } from "@/core/domain/project/types";
import { listProjectsByContact } from "@/infrastructure/services/project.service";
import logger from "@/lib/logger";
import { notifyMutationError } from "@/lib/notify/notifyHelpers";
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
 * @returns {UseQueryResult<ListProjectsResponse>} Query result containing the projects list
 */
export function useListProjectsByContact(contactId: string) {
  const options = {
    /**
     * Unique cache key based on the contact ID
     */
    queryKey: ["projectsByContact", contactId],

    /**
     * Query function to fetch projects associated with the given contact
     *
     * @returns {Promise<ListProjectsResponse>} The paginated projects
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
    onSuccess: (data: ListProjectsResponse) => {
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

      notifyMutationError("list", "Project", error, {
        details: { contactId },
      });
    },
  } as const;

  return useQuery(options);
}
