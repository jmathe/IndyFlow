// src/hooks/useCreateContact.ts

import { ContactCreateDTO, ContactDTO } from "@/core/domain/contact/types";
import { createContactRequest } from "@/infrastructure/services/contact.service";
import logger from "@/lib/logger";
import { notify } from "@/lib/notify";
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
     */
    onSuccess: (newContact) => {
      notify.success("Contact successfully created");
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
     */
    onError: (error) => {
      logger.error("useCreateContact: Error creating contact", error);

      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      notify.error("Creation failed", message);
    },
  });
}
