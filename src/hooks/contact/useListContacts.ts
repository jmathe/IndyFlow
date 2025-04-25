// src/hooks/useListContacts.ts

import {
  ListContactsParams,
  ListContactsResponse,
} from "@/core/domain/contact/types";
import { listContactsRequest } from "@/infrastructure/services/contact.service";
import { AppError } from "@/lib/errors/AppError";
import logger from "@/lib/logger";
import { notify } from "@/lib/notify";
import { useQuery } from "@tanstack/react-query";

/**
 * Custom React Query hook to fetch a paginated list of contacts.
 *
 * - Calls the listContactsRequest service
 * - Handles logging and error notifications
 * - Keeps previous data during pagination
 *
 * @function useListContacts
 * @param {ListContactsParams} params - The pagination parameters
 * @returns {UseQueryResult<ListContactsResponse>} Query result object
 */
export function useListContacts({ page, limit }: ListContactsParams) {
  // Define options as a constant object to preserve type inference
  const options = {
    /**
     * Cache key based on the current page
     */
    queryKey: ["contacts", page],

    /**
     * Function calling the service to fetch paginated contacts
     */
    queryFn: () => listContactsRequest({ page, limit }),

    /**
     * Enables caching of previous result during loading of next page
     */
    keepPreviousData: true,

    /**
     * Logs the result on successful fetch
     *
     * @param {UseListContactsResponse} result - The paginated response
     */
    onSuccess: (result: ListContactsResponse) => {
      logger.info("useListContacts: Contacts fetched", {
        page,
        count: result.data.length,
        total: result.totalCount,
      });
    },

    /**
     * Handles error thrown by query function
     *
     * @param {unknown} error - The error thrown during fetch
     */
    onError: (error: unknown) => {
      logger.error("useListContacts: Failed to fetch contacts", error);

      const message =
        error instanceof AppError
          ? error.message
          : (error as Error).message || "An unexpected error occurred";

      notify.error("Failed to load contacts", message);
    },
  } as const;

  return useQuery(options);
}
