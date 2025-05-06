// src/hooks/useCreateContact.ts

import { ContactCreateDTO, ContactDTO } from "@/core/domain/contact/types";
import { createContactRequest } from "@/infrastructure/services/contact.service";
import logger from "@/lib/logger";
import {
  notifyMutationError,
  notifyMutationSuccess,
} from "@/lib/notify/notifyHelpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * React Query mutation hook for creating a new contact.
 *
 * Responsibilities:
 * - Sends the contact creation request via the service layer
 * - Invalidate the "contacts" cache on success
 * - Handles toast notifications and logging
 *
 * @returns {UseMutationResult<ContactDTO, unknown, ContactCreateDTO>}
 */
export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation<ContactDTO, unknown, ContactCreateDTO>({
    /**
     * Mutation function: sends a POST request to the API to create a contact.
     *
     * @param {ContactCreateDTO} data - The contact creation payload.
     * @returns {Promise<ContactDTO>} The created contact returned from the API.
     */
    mutationFn: (data) => createContactRequest(data),

    /**
     * Called when the contact is successfully created.
     * Shows a success toast and invalidates the contact list cache.
     *
     * @param {ContactDTO} newContact - The created contact
     */
    onSuccess: (newContact) => {
      notifyMutationSuccess("create", "Contact", {
        details: { name: newContact.name, email: newContact.email },
      });
      logger.info("useCreateContact: Contact created", {
        id: newContact.id,
        email: newContact.email,
      });

      // Refresh the contacts list
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },

    /**
     * Called when an error occurs during contact creation.
     * Shows an error toast and logs the error.
     *
     * @param {unknown} error - The error thrown during creation
     */
    onError: (error) => {
      logger.error("useCreateContact: Error creating contact", error);
      notifyMutationError("create", "Contact", error);
    },
  });
}
