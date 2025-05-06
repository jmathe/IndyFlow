// src/hooks/useDeleteContact.ts

import { deleteContactRequest } from "@/infrastructure/services/contact.service";
import logger from "@/lib/logger";
import {
  notifyMutationError,
  notifyMutationSuccess,
} from "@/lib/notify/notifyHelpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * React Query mutation hook to delete a contact.
 *
 * Responsibilities:
 * - Calls the deleteContactRequest service
 * - Displays toast notifications based on result
 * - Invalidates the contact list cache
 * - Logs the mutation lifecycle
 *
 * @function useDeleteContact
 * @returns {UseMutationResult<void, unknown, string>} The mutation object for deleting contacts
 */
export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, string>({
    /**
     * Mutation function that sends a DELETE request to the API.
     *
     * @param {string} id - The ID of the contact to delete
     * @returns {Promise<void>} Resolves when the contact is successfully deleted
     */
    mutationFn: (id: string) => deleteContactRequest(id),

    /**
     * Callback executed on successful mutation.
     * Invalidates the 'contacts' query and shows a success toast.
     *
     * @param {void} _ - The response from the server
     * @param {string} id - The ID of the contact to delete
     */
    onSuccess: (_, id) => {
      notifyMutationSuccess("delete", "Contact", {
        details: { id },
      });
      // refresh the contact list
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      logger.info("useDeleteContact: Contact successfully deleted ", {
        id,
      });
    },

    /**
     * Callback executed on mutation error.
     * Displays an error toast and logs the error.
     *
     * @param {unknown} error - The error thrown during deletion
     * @param {string} id - The ID of the contact to delete
     */
    onError: (error, id) => {
      logger.error("useDeleteContact: Error deleting contact", error);

      notifyMutationError("delete", "Contact", error, {
        details: { id },
      });
    },
  });
}
