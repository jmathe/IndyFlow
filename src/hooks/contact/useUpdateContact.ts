// src/hooks/useUpdateContact.ts

import { ContactDTO, ContactUpdateDTO } from "@/core/domain/contact/types";
import { updateContactRequest } from "@/infrastructure/services/contact.service";
import logger from "@/lib/logger";
import {
  notifyMutationError,
  notifyMutationSuccess,
} from "@/lib/notify/notifyHelpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * React Query mutation hook to update a contact.
 *
 * Responsibilities:
 * - Calls the updateContactRequest service
 * - Displays toast notifications based on result
 * - Invalidates contact-related queries
 * - Logs the mutation lifecycle
 *
 * @function useUpdateContact
 * @returns {UseMutationResult<ContactDTO, unknown, { id: string; data: ContactUpdateDTO }>} The mutation object for updating contacts
 */
export function useUpdateContact() {
  const queryClient = useQueryClient();

  return useMutation<
    ContactDTO,
    unknown,
    { id: string; data: ContactUpdateDTO }
  >({
    /**
     * Mutation function that sends a PUT request to the API.
     *
     * @param {{ id: string; data: ContactUpdateDTO }} input - Contact ID and update payload
     * @returns {Promise<ContactDTO>} The updated contact returned by the server
     */
    mutationFn: ({ id, data }: { id: string; data: ContactUpdateDTO }) =>
      updateContactRequest(id, data),

    /**
     * Callback executed on successful mutation.
     * Invalidates the individual and list queries, and shows a success toast.
     *
     * @param {ContactDTO} contact - The contact that was updated
     */
    onSuccess: (contact) => {
      notifyMutationSuccess("update", "Contact", {
        details: { email: contact.email, id: contact.id },
      });
      queryClient.invalidateQueries({ queryKey: ["contact", contact.id] });
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      logger.info("useUpdateContact: Contact successfully updated", {
        id: contact.id,
      });
    },

    /**
     * Callback executed on mutation error.
     * Displays an error toast and logs the error.
     *
     * @param {unknown} error - The error thrown during the mutation
     */
    onError: (error: unknown) => {
      logger.error("useUpdateContact: Error updating contact", error);

      notifyMutationError("update", "Contact", error);
    },
  });
}
