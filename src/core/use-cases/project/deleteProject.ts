// src/core/use-cases/project/deleteProject.ts

import { Project } from "@/core/domain/project/entities/Project";
import { ProjectRepository } from "@/core/domain/project/ports/projectRepository";
import { AppError } from "@/lib/errors/AppError";
import logger from "@/lib/logger";

/**
 * Use case for deleting an existing project by ID.
 * Validates project existence before deletion.
 *
 * @class DeleteProject
 * @implements {UseCase<string, void>}
 */
export class DeleteProject {
  /**
   * @param {ProjectRepository} projectRepo - Concrete implementation of the ProjectRepository interface.
   */
  constructor(private readonly projectRepo: ProjectRepository) {}

  /**
   * Executes the business logic to delete a project by ID:
   * 1. Checks that the project exists
   * 2. Deletes the project
   *
   * @method execute
   * @param {string} id - The ID of the project to delete.
   * @returns {Promise<void>} A promise resolving when deletion is complete.
   * @throws {AppError} If the project does not exist.
   *
   * @example
   * await new DeleteProject(projectRepo).execute("project-id-to-delete");
   */
  async execute(id: string): Promise<void> {
    logger.debug("DeleteProject.execute called with id =", id);

    // 1. Check if the project exists
    const existing: Project | null = await this.projectRepo.findById(id);
    if (!existing) {
      logger.info(
        `DeleteProject: no project found for id = ${id}, throwing 404 error`
      );
      throw new AppError(
        `Project not found. Unable to delete project with ID ${id}.`,
        404
      );
    }

    // 2. Delete the project via repository
    try {
      await this.projectRepo.delete(id);
    } catch (error) {
      logger.error(
        `DeleteProject: failed to delete project with id = ${id}`,
        error
      );
      throw new AppError(
        `Unexpected error while deleting project with ID ${id}.`,
        500
      );
    }
    logger.info("DeleteProject: project deleted, id =", id);
  }
}
