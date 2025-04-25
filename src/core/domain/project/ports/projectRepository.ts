// src/core/domain/project/ports/projectRepository.ts

import { Project } from "@/core/domain/project/entities/Project";
import {
  ProjectCreateDTO,
  ProjectUpdateDTO,
} from "@/core/domain/project/types";
import { FindManyParams } from "@/core/shared/types/pagination";

/**
 * Contract defining data access methods for Project entities.
 * Infrastructure implementations (e.g., Prisma) must adhere to this interface.
 *
 * @interface ProjectRepository
 */
export interface ProjectRepository {
  /**
   * Creates a new project with the provided data.
   * @param {ProjectCreateDTO} data - Data Transfer Object for creating a project.
   * @returns {Promise<Project>} A promise resolving to the created Project entity.
   */
  create(data: ProjectCreateDTO): Promise<Project>;

  /**
   * Finds a project by its unique ID.
   * Returns `null` if no project is found.
   * @param {string} id - The project's ID.
   * @returns {Promise<Project | null>} The Project entity or null if not found.
   */
  findById(id: string): Promise<Project | null>;

  /**
   * Retrieves multiple projects with optional pagination.
   * @param {FindManyParams} [params] - Optional pagination parameters (skip, take).
   * @returns {Promise<Project[]>} A promise resolving to an array of Project entities.
   */
  findMany(params?: FindManyParams): Promise<Project[]>;

  /**
   * Retrieves multiple projects for a given contact.
   * Returns an empty array if no projects are found.
   * @param {string} contactId - The ID of the contact.
   * @param {FindManyParams} [params] - Optional pagination parameters.
   * @returns {Promise<Project[]>} An array of Project entities (can be empty).
   */
  findByContactId(
    contactId: string,
    params?: FindManyParams
  ): Promise<Project[]>;

  /**
   * Updates an existing project by ID with partial data.
   * @param {string} id - The ID of the project to update.
   * @param {Partial<ProjectUpdateDTO>} data - Partial data for updating the project.
   * @returns {Promise<Project>} A promise resolving to the updated Project entity.
   */
  update(id: string, data: Partial<ProjectUpdateDTO>): Promise<Project>;

  /**
   * Deletes a project by its ID.
   * @param {string} id - The ID of the project to delete.
   * @returns {Promise<void>} A promise that resolves upon successful deletion.
   */
  delete(id: string): Promise<void>;

  /**
   * Counts the total number of projects in the data store.
   * @returns {Promise<number>} A promise resolving to the total project count.
   */
  count(): Promise<number>;

  /**
   * Counts the total number of projects for a given contact.
   * @param {string} contactId - The ID of the contact.
   * @returns {Promise<number>} A promise resolving to the total project count for the contact.
   */
  countByContactId(contactId: string): Promise<number>;
}
