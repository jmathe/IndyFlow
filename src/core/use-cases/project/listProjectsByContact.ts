// src/core/use-cases/project/listProjectsByContact.ts

import { ProjectRepository } from "@/core/domain/project/ports/projectRepository";
import {
  ListProjectsByContactParams,
  ListProjectsByContactResult,
} from "@/core/domain/project/types";
import { AppError } from "@/lib/errors/AppError";
import logger from "@/lib/logger";

/**
 * Use case for retrieving a paginated list of projects for a specific contact.
 * Interacts with the ProjectRepository to fetch data and count.
 *
 * @class ListProjectsByContact
 * @implements {UseCase<ListProjectsByContactParams, ListProjectsByContactResult>}
 */
export class ListProjectsByContact {
  /**
   * @param {ProjectRepository} projectRepo - Concrete implementation of the ProjectRepository interface.
   */
  constructor(private readonly projectRepo: ProjectRepository) {}

  /**
   * Executes the use case:
   * 1. Validates pagination parameters (page, limit)
   * 2. Fetches projects and calculates total count
   * 3. Returns paginated results
   *
   * @method execute
   * @param {ListProjectsByContactParams} params - Pagination and contact ID.
   * @returns {Promise<ListProjectsByContactResult>} Paginated projects and total count.
   * @throws {AppError} If an error occurs while retrieving projects.
   *
   * @example
   * const useCase = new ListProjectsByContact(projectRepo);
   * const result = await useCase.execute({ contactId: "cid123", page: 2, limit: 5 });
   */
  async execute(
    params: ListProjectsByContactParams
  ): Promise<ListProjectsByContactResult> {
    logger.debug("ListProjectsByContact.execute called with params =", params);

    const contactId = params.contactId;
    const page: number = Math.max(1, params.page ?? 1);
    const limit: number = Math.max(1, params.limit ?? 10);

    try {
      // Fetch paginated data and total count
      const [data, totalCount] = await Promise.all([
        this.projectRepo.findByContactId(contactId, {
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.projectRepo.countByContactId(contactId),
      ]);

      logger.info(
        `ListProjectsByContact.execute: retrieved ${data.length} projects for contactId = ${contactId}, totalCount = ${totalCount}`
      );

      return { data, totalCount };
    } catch (error) {
      logger.error(
        "ListProjectsByContact.execute: error retrieving projects by contact",
        error
      );
      throw new AppError(
        "Error retrieving projects for the given contact.",
        500
      );
    }
  }
}
