// src/core/use-cases/contact/listContacts.ts

import type { Contact } from "@/core/domain/contact/entities/Contact";
import { ContactRepository } from "@/core/domain/contact/ports/contactRepository";
import { AppError } from "@/lib/errors/AppError";
import logger from "@/lib/logger";

/**
 * Parameters for paginating contact results.
 *
 * @interface ListContactsParams
 * @property {number} [page=1] - The page number to retrieve (1-indexed).
 * @property {number} [limit=10] - The number of items per page.
 */
interface ListContactsParams {
  page?: number;
  limit?: number;
}

/**
 * Structure of paginated contact results.
 *
 * @interface ListContactsResult
 * @property {Contact[]} data - Array of contacts for the requested page.
 * @property {number} totalCount - Total number of contacts available.
 */
interface ListContactsResult {
  data: Contact[];
  totalCount: number;
}

/**
 * Use case for retrieving a paginated list of contacts.
 * Interacts with the ContactRepository to fetch data and count.
 *
 * @class ListContacts
 * @implements {UseCase<ListContactsParams, ListContactsResult>}
 */
export class ListContacts {
  /**
   * @param {ContactRepository} contactRepo - Concrete implementation of the ContactRepository interface.
   */
  constructor(private readonly contactRepo: ContactRepository) {}

  /**
   * Executes the use case:
   * 1. Validates pagination parameters (page, limit)
   * 2. Fetches contacts and total count in parallel
   * 3. Returns paginated results
   *
   * @method execute
   * @param {ListContactsParams} [params] - Pagination options.
   * @returns {Promise<ListContactsResult>} Paginated contacts and total count.
   * @throws {AppError} If an error occurs while retrieving contacts.
   *
   * @example
   * const useCase = new ListContacts(contactRepo);
   * const result = await useCase.execute({ page: 2, limit: 20 });
   */
  async execute(params: ListContactsParams = {}): Promise<ListContactsResult> {
    logger.debug("ListContacts.execute called with params =", params);

    // 1. Validate and normalize pagination parameters
    const page: number = Math.max(1, params.page ?? 1);
    const limit: number = Math.max(1, params.limit ?? 10);

    try {
      // 2. Fetch data and count in parallel
      const [data, totalCount] = await Promise.all([
        this.contactRepo.findMany({ skip: (page - 1) * limit, take: limit }),
        this.contactRepo.count(),
      ]);

      logger.info(
        "ListContacts.execute: retrieved contacts =",
        data.length,
        "totalCount =",
        totalCount
      );

      // 3. Return paginated result
      return { data, totalCount };
    } catch (error) {
      logger.error("ListContacts.execute: error retrieving contacts", error);
      throw new AppError("Error retrieving contacts.", 500);
    }
  }
}
