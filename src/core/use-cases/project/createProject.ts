// src/core/use-cases/project/createProject.ts

import { Project } from "@/core/domain/project/entities/Project";
import { ProjectRepository } from "@/core/domain/project/ports/projectRepository";
import { ProjectCreateDTO } from "@/core/domain/project/types";
import { AppError } from "@/lib/errors/AppError";
import logger from "@/lib/logger";

/**
 * Use case for creating a new project.
 * Validates due date before delegating creation to the repository.
 *
 * @class CreateProject
 * @implements {UseCase<ProjectCreateDTO, Project>}
 */
export class CreateProject {
  /**
   * @param {ProjectRepository} projectRepo - Concrete implementation of the ProjectRepository interface.
   */
  constructor(private readonly projectRepo: ProjectRepository) {}

  /**
   * Executes the business logic to create a project:
   * 1. Validates that due date, if provided, is in the future
   * 2. Delegates creation to the repository
   *
   * @method execute
   * @param {ProjectCreateDTO} data - Data required to create the project.
   * @returns {Promise<Project>} The newly created Project entity.
   * @throws {AppError} If due date is in the past.
   *
   * @example
   * const useCase = new CreateProject(projectRepo);
   * const newProject = await useCase.execute({
   *   title: "New Website",
   *   description: "Landing page redesign",
   *   amount: 1500,
   *   dueDate: "2025-06-30T00:00:00.000Z",
   *   status: "PENDING",
   *   contactId: "cjld2cjxh0000qzrmn831i7rn",
   * });
   */
  async execute(data: ProjectCreateDTO): Promise<Project> {
    logger.debug("CreateProject.execute called with data =", data);

    // 1. Validate due date
    if (data.dueDate && !isFutureDate(data.dueDate)) {
      logger.info(
        `CreateProject: invalid due date ${data.dueDate}, throwing validation error`
      );
      throw new AppError(
        `Invalid due date: must be a future date, received ${data.dueDate}`,
        400
      );
    }

    // 2. Delegate to repository
    const newProject = await this.projectRepo.create(data);
    logger.info("CreateProject: new project created with id =", newProject.id);
    return newProject;
  }
}

/**
 * Checks if a given date string represents a future date.
 *
 * @param {string} date - Date string in ISO format.
 * @returns {boolean} True if the date is in the future, false otherwise.
 */
function isFutureDate(date: string): boolean {
  return new Date(date).getTime() > Date.now();
}
