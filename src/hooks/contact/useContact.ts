// src/hooks/useContact.ts

import { ContactDTO } from "@/core/domain/contact/types";
import { getContactRequest } from "@/infrastructure/services/contact.service";
import { AppError } from "@/lib/errors/AppError";
import logger from "@/lib/logger";
import { notify } from "@/lib/notify";
import { useQuery } from "@tanstack/react-query";

/**
 * Custom hook to fetch a contact by ID.
 *
 * @param {string} id - The contact ID to fetch
 * @returns Query result with the contact data
 */
export function useContact(id: string) {
  // Define options separately to ensure correct type inference
  const options = {
    /**
     * Unique cache key based on contact ID
     */
    queryKey: ["contact", id],

    /**
     * Query function calling the service to retrieve the contact
     */
    queryFn: () => getContactRequest(id),

    /**
     * Disable query if no ID is provided (undefined or empty)
     */
    enabled: !!id,

    /**
     * Callback when the contact is successfully retrieved.
     * Logs the result.
     *
     * @param {ContactDTO} contact - The retrieved contact
     */
    onSuccess: (contact: ContactDTO) => {
      logger.info("useContact: Contact fetched", { id: contact.id });
    },

    /**
     * Callback when an error occurs during the fetch.
     * Displays toast and logs the error.
     *
     * @param {unknown} error - The error thrown during query
     */
    onError: (error: unknown) => {
      logger.error("useContact: Failed to fetch contact", error);

      const message =
        error instanceof AppError
          ? error.message
          : (error as Error).message || "An unknown error occurred";

      notify.error("Failed to load contact", message);
    },
  } as const;

  return useQuery(options);
}
