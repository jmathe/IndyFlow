// src/core/use-cases/project/updateProject.ts

import { Project } from "@/core/domain/project/entities/Project";
import { ProjectRepository } from "@/core/domain/project/ports/projectRepository";
import { ProjectUpdateDTO } from "@/core/domain/project/types";
import { AppError } from "@/lib/errors/AppError";
import logger from "@/lib/logger";

/**
 * Use case for updating an existing project in the database.
 * Ensures the project exists before applying updates.
 *
 * @class UpdateProject
 * @implements {UseCase<{id: string; data: Partial<ProjectUpdateDTO>}, Project>}
 */
export class UpdateProject {
  /**
   * @param {ProjectRepository} projectRepo - Concrete implementation of ProjectRepository for data operations.
   */
  constructor(private readonly projectRepo: ProjectRepository) {}

  /**
   * Executes the business logic to update a project by ID:
   * 1. Verifies the project exists
   * 2. Applies partial updates
   *
   * @method execute
   * @param {string} id - The unique identifier of the project to update.
   * @param {Partial<ProjectUpdateDTO>} data - Partial data for updating the project.
   * @returns {Promise<Project>} A promise resolving to the updated Project entity.
   * @throws {AppError} If the project is not found (404) or if an error occurs during update (500).
   *
   * @example
   * const useCase = new UpdateProject(projectRepo);
   * const updatedProject = await useCase.execute("project-id", { title: "New Title" });
   */
  async execute(id: string, data: Partial<ProjectUpdateDTO>): Promise<Project> {
    logger.debug("UpdateProject.execute called with id =", id, "data =", data);

    // 1. Check if the project exists
    const existing: Project | null = await this.projectRepo.findById(id);
    if (!existing) {
      logger.info(
        `UpdateProject: no project found for id = ${id}, throwing 404 error`
      );
      throw new AppError(`Project with ID ${id} not found for update.`, 404);
    }

    try {
      // 2. Perform the update
      const updated: Project = await this.projectRepo.update(id, data);
      logger.info(
        "UpdateProject: project updated successfully, id =",
        updated.id
      );
      return updated;
    } catch (error) {
      logger.error(`UpdateProject: error updating project id = ${id}`, error);
      throw new AppError(`Error updating project with ID ${id}`, 500);
    }
  }
}
