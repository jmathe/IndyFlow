import { Project } from "@/core/domain/project/entities/Project";
import { ProjectRepository } from "@/core/domain/project/ports/projectRepository";
import {
  ProjectCreateDTO,
  ProjectDB,
  ProjectUpdateDTO,
} from "@/core/domain/project/types";
import { FindManyParams } from "@/core/shared/types/pagination";
import { AppError } from "@/lib/errors/AppError";
import logger from "@/lib/logger";
import { prisma } from "@/lib/prismaSingleton";

/**
 * Concrete implementation of ProjectRepository using Prisma.
 * Provides all CRUD operations for the `project` table.
 *
 * @constant projectRepo
 * @implements {ProjectRepository}
 */
export const projectRepo: ProjectRepository = {
  /**
   * Creates a new project in the database via Prisma.
   * @function create
   * @param {ProjectCreateDTO} data - Data required to create the project.
   * @returns {Promise<Project>} A promise resolving to the created Project entity.
   */
  async create(data: ProjectCreateDTO): Promise<Project> {
    logger.debug("projectRepo.create called with", data);
    try {
      const result: ProjectDB = await prisma.project.create({
        data: {
          title: data.title,
          description: data.description,
          amount: data.amount,
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
          status: data.status,
          contact: { connect: { id: data.contactId } },
        },
      });
      logger.info("projectRepo.create: project created, id =", result.id);
      return Project.fromDB(result);
    } catch (error) {
      logger.error(
        "projectRepo.create: error creating project in the database",
        error
      );
      throw new AppError("Error creating project in the database", 500);
    }
  },

  /**
   * Finds a project by its ID.
   * @function findById
   * @param {string} id - The unique identifier of the project to find.
   * @returns {Promise<Project | null>} The Project entity or null if not found.
   */
  async findById(id: string): Promise<Project | null> {
    logger.debug("projectRepo.findById called with id =", id);
    try {
      const result: ProjectDB | null = await prisma.project.findUnique({
        where: { id },
      });
      if (!result) {
        logger.info("projectRepo.findById: no project found for id =", id);
        return null;
      }
      logger.info("projectRepo.findById: project found, id =", result.id);
      return Project.fromDB(result);
    } catch (error) {
      logger.error("projectRepo.findById: error fetching project by ID", error);
      throw new AppError(
        `Error fetching project by ID with id ${id} from the database`,
        500
      );
    }
  },

  /**
   * Retrieves multiple projects with optional pagination.
   * @function findMany
   * @param {FindManyParams} [params] - Pagination parameters (skip, take).
   * @returns {Promise<Project[]>} A promise resolving to an array of Project entities.
   */
  async findMany({ skip, take }: FindManyParams = {}): Promise<Project[]> {
    logger.debug("projectRepo.findMany called with params =", { skip, take });
    try {
      const results: ProjectDB[] = await prisma.project.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take,
      });
      logger.info(
        "projectRepo.findMany: projects retrieved, count =",
        results.length
      );
      return results.map((r) => Project.fromDB(r));
    } catch (error) {
      logger.error("projectRepo.findMany: error fetching projects list", error);
      throw new AppError("Error fetching projects list from the database", 500);
    }
  },

  /**
   * Retrieves multiple projects for a specific contact with optional pagination.
   * @function findByContactId
   * @param {string} contactId - The ID of the contact.
   * @param {FindManyParams} [params] - Pagination parameters (skip, take).
   * @returns {Promise<Project[]>} A promise resolving to an array of Project entities.
   */
  async findByContactId(
    contactId: string,
    { skip, take }: FindManyParams = {}
  ): Promise<Project[]> {
    logger.debug(
      "projectRepo.findByContactId called with contactId =",
      contactId,
      { skip, take }
    );
    try {
      const results: ProjectDB[] = await prisma.project.findMany({
        where: { contactId },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      });
      logger.info(
        `projectRepo.findByContactId: projects retrieved for contactId = ${contactId}, count = ${results.length}`
      );
      return results.map((r) => Project.fromDB(r));
    } catch (error) {
      logger.error(
        "projectRepo.findByContactId: error fetching projects by contactId",
        error
      );
      throw new AppError(
        `Error fetching projects for the given contact with ${contactId} from the database`,
        500
      );
    }
  },

  /**
   * Updates an existing project with provided data.
   * @function update
   * @param {string} id - The ID of the project to update.
   * @param {Partial<ProjectUpdateDTO>} data - Data to update (partial).
   * @returns {Promise<Project>} A promise resolving to the updated Project entity.
   */
  async update(id: string, data: Partial<ProjectUpdateDTO>): Promise<Project> {
    logger.debug("projectRepo.update called with id =", id, "and data =", data);
    try {
      const updateData: Partial<ProjectUpdateDTO> = { ...data };
      const result: ProjectDB = await prisma.project.update({
        where: { id },
        data: updateData,
      });
      logger.info("projectRepo.update: project updated, id =", result.id);
      return Project.fromDB(result);
    } catch (error) {
      logger.error("projectRepo.update: error updating project", error);
      throw new AppError(
        `Error updating project with id ${id} in the database`,
        500
      );
    }
  },

  /**
   * Deletes a project from the database.
   * @function delete
   * @param {string} id - The ID of the project to delete.
   * @returns {Promise<void>} A promise that resolves when deletion is complete.
   */
  async delete(id: string): Promise<void> {
    logger.debug("projectRepo.delete called with id =", id);
    try {
      await prisma.project.delete({ where: { id } });
      logger.info("projectRepo.delete: project deleted, id =", id);
    } catch (error) {
      logger.error("projectRepo.delete: error deleting project", error);
      throw new AppError(
        `Error deleting project  with id ${id} from the database`,
        500
      );
    }
  },

  /**
   * Counts the total number of projects in the database.
   * @function count
   * @returns {Promise<number>} A promise resolving to the total project count.
   */
  async count(): Promise<number> {
    logger.debug("projectRepo.count called");
    try {
      const total = await prisma.project.count();
      logger.info("projectRepo.count: total projects =", total);
      return total;
    } catch (error) {
      logger.error("projectRepo.count: error counting projects", error);
      throw new AppError("Error counting projects in the database", 500);
    }
  },

  /**
   * Counts the total number of projects for a given contact ID.
   * @function countByContactId
   * @param {string} contactId - The ID of the contact.
   * @returns {Promise<number>} The number of projects linked to the given contact ID.
   */
  async countByContactId(contactId: string): Promise<number> {
    logger.debug(
      "projectRepo.countByContactId called with contactId =",
      contactId
    );
    try {
      const total = await prisma.project.count({
        where: { contactId },
      });
      logger.info(
        `projectRepo.countByContactId: total projects for contactId = ${contactId} is ${total}`
      );
      return total;
    } catch (error) {
      logger.error(
        "projectRepo.countByContactId: error counting projects by contactId",
        error
      );
      throw new AppError(
        `Error counting projects for the given contact with ID ${contactId}`,
        500
      );
    }
  },
};
