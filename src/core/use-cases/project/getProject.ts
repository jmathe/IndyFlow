// src/core/use-cases/project/getProject.ts

import { Project } from "@/core/domain/project/entities/Project";
import { ProjectRepository } from "@/core/domain/project/ports/projectRepository";
import { AppError } from "@/lib/errors/AppError";
import logger from "@/lib/logger";

/**
 * Use case for retrieving a project by its unique ID.
 * Interacts with the repository to fetch the Project entity.
 *
 * @class GetProject
 * @implements {UseCase<string, Project>}
 */
export class GetProject {
  /**
   * @param {ProjectRepository} projectRepo - Concrete implementation of ProjectRepository.
   */
  constructor(private readonly projectRepo: ProjectRepository) {}

  /**
   * Executes the business logic to get a project by ID:
   * 1. Fetches project from repository
   * 2. Throws AppError if not found
   *
   * @method execute
   * @param {string} id - The ID of the project to retrieve.
   * @returns {Promise<Project>} A promise resolving to the Project entity.
   * @throws {AppError} If no project is found for the provided ID.
   *
   * @example
   * const useCase = new GetProject(projectRepo);
   * const project = await useCase.execute("project-id-to-fetch");
   */
  async execute(id: string): Promise<Project> {
    logger.debug("GetProject.execute called with id =", id);

    // 1. Retrieve project by ID
    const project: Project | null = await this.projectRepo.findById(id);
    if (!project) {
      logger.info(
        `GetProject: no project found for id = ${id}, throwing 404 error`
      );
      throw new AppError(`Project not found with ID ${id}`, 404);
    }

    logger.info("GetProject: project retrieved, id =", id);
    return project;
  }
}
