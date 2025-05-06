import { ContactDTO, ListContactsResponse } from "@/core/domain/contact/types";
import { listContactsRequest } from "@/infrastructure/services/contact.service";
import logger from "@/lib/logger";
import {
  notifyMutationError,
  notifyMutationSuccess,
} from "@/lib/notify/notifyHelpers";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

/**
 * Custom React Query hook to fetch a list of CLIENT and PROSPECT contacts
 * for use in the ProjectForm select field.
 *
 * - Calls listContactsRequest
 * - Handles logging and error notifications
 *
 * @function useListContactsForProjectForm
 * @returns {UseQueryResult<ContactDTO[]>} The list of available contacts
 */
export function useListContactsForProjectForm(): UseQueryResult<ContactDTO[]> {
  const options = {
    /**
     * Cache key for the contacts used in the project form
     */
    queryKey: ["contacts-for-project-form"],

    /**
     * Query function fetching contacts
     *
     * @returns {Promise<ContactDTO[]>} The list of contacts
     */
    queryFn: () =>
      listContactsRequest({ page: 1, limit: 100 }).then(
        (response) => response.data
      ),

    /**
     * Handle success: already logged in queryFn
     *
     * @param {ContactDTO[]} contacts - The list of contacts
     */
    onSuccess: (contacts: ContactDTO[]) => {
      logger.info(
        "useListContactsForProjectForm: Contacts fetched successfully",
        { count: contacts.length }
      );
      notifyMutationSuccess("list", "Contact", {
        details: { count: contacts.length },
      });
    },

    /**
     * Handle errors thrown by query function
     *
     * @param {unknown} error - The error thrown during fetch
     */
    onError: (error: unknown) => {
      logger.error(
        "useListContactsForProjectForm: Failed to fetch contacts",
        error
      );

      notifyMutationError("list", "Contact", error);
    },

    /**
     * Keep previous data while fetching new one
     */
    keepPreviousData: true,
  } as const;

  return useQuery(options);
}
