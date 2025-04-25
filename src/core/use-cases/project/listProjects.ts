// src/core/use-cases/project/listProjects.ts

import { ProjectRepository } from "@/core/domain/project/ports/projectRepository";
import type {
  ListProjectsParams,
  ListProjectsResult,
} from "@/core/domain/project/types";
import { AppError } from "@/lib/errors/AppError";
import logger from "@/lib/logger";

/**
 * Use case for retrieving a paginated list of projects.
 * Interacts with the ProjectRepository to fetch data and count.
 *
 * @class ListProjects
 * @implements {UseCase<ListProjectsParams, ListProjectsResult>}
 */
export class ListProjects {
  /**
   * @param {ProjectRepository} projectRepo - Concrete implementation of the ProjectRepository interface.
   */
  constructor(private readonly projectRepo: ProjectRepository) {}

  /**
   * Executes the use case:
   * 1. Validates pagination parameters (page, limit)
   * 2. Fetches projects and total count in parallel
   * 3. Returns paginated results
   *
   * @method execute
   * @param {ListProjectsParams} [params] - Pagination options.
   * @returns {Promise<ListProjectsResult>} Paginated projects and total count.
   * @throws {AppError} If an error occurs while retrieving projects.
   *
   * @example
   * const useCase = new ListProjects(projectRepo);
   * const result = await useCase.execute({ page: 2, limit: 20 });
   */
  async execute(params: ListProjectsParams = {}): Promise<ListProjectsResult> {
    logger.debug("ListProjects.execute called with params =", params);

    // 1. Validate and normalize pagination parameters
    const page: number = Math.max(1, params.page ?? 1);
    const limit: number = Math.max(1, params.limit ?? 10);

    try {
      // 2. Fetch data and count in parallel
      const [data, totalCount] = await Promise.all([
        this.projectRepo.findMany({ skip: (page - 1) * limit, take: limit }),
        this.projectRepo.count(),
      ]);

      logger.info(
        "ListProjects.execute: retrieved projects =",
        data.length,
        "totalCount =",
        totalCount
      );

      // 3. Return paginated result
      return { data, totalCount };
    } catch (error) {
      logger.error("ListProjects.execute: error retrieving projects", error);
      throw new AppError("Error retrieving projects.", 500);
    }
  }
}
