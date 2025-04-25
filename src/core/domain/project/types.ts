// src/core/domain/project/types.ts
import { ProjectStatus } from "@/generated/prisma";
import { Project } from "./entities/Project";

/**
 * Base interface representing a project in the business domain.
 * Decoupled from ORM, DB, or transport details.
 *
 * @interface ProjectBase
 */
export interface ProjectBase {
  /** Unique identifier of the project */
  id: string;
  /** Title of the project */
  title: string;
  /** Current status of the project */
  status: ProjectStatus;
  /** Identifier of the associated contact */
  contactId: string;
}

/**
 * Data Transfer Object for creating a project via the API.
 * Excludes the auto-generated id and timestamps.
 *
 * @interface ProjectCreateDTO
 */
export interface ProjectCreateDTO extends Omit<ProjectBase, "id"> {
  /** Optional description of the project */
  description?: string;
  /** Optional amount planned for the project */
  amount?: number;
  /** Optional due date in ISO string format */
  dueDate?: string;
}

/**
 * Data Transfer Object for updating a project via the API.
 * All fields are optional to allow partial updates.
 *
 * @interface ProjectUpdateDTO
 */
export interface ProjectUpdateDTO extends Partial<ProjectCreateDTO> {}

/**
 * Data Transfer Object representing a project returned from the API.
 * Extends ProjectBase and includes additional optional fields and the creation timestamp.
 *
 * @interface ProjectDTO
 */
export interface ProjectDTO extends ProjectBase, ProjectCreateDTO {
  /** ISO-formatted creation date of the project */
  createdAt: string;
}

/**
 * Represents a project record as stored in the database.
 * Includes raw JavaScript Date objects and nullable fields for optional attributes.
 *
 * @interface ProjectDB
 */
export interface ProjectDB extends ProjectBase {
  /** Creation timestamp as a JavaScript Date */
  createdAt: Date;
  /** Description may be null in the database */
  description: string | null;
  /** Amount may be null in the database */
  amount: number | null;
  /** Due date may be null in the database */
  dueDate: Date | null;
}

/**
 * Parameters for paginating project results.
 *
 * @interface ListProjectsParams
 * @property {number} [page=1] - Page number to retrieve (1-indexed).
 * @property {number} [limit=10] - Number of items per page.
 */
export interface ListProjectsParams {
  page?: number;
  limit?: number;
}

/**
 * Structure of paginated project results.
 *
 * @interface ListProjectsResult
 * @property {Project[]} data - Array of projects for the requested page.
 * @property {number} totalCount - Total number of projects available.
 */
export interface ListProjectsResult {
  data: Project[];
  totalCount: number;
}

/**
 * Parameters for paginating project results for a specific contact.
 *
 * @interface ListProjectsByContactParams
 * @property {string} contactId - ID of the contact whose projects are to be listed.
 * @property {number} [page=1] - Page number to retrieve (1-indexed).
 * @property {number} [limit=10] - Number of items per page.
 */
export interface ListProjectsByContactParams {
  contactId: string;
  page?: number;
  limit?: number;
}

/**
 * Structure of paginated project results for a contact.
 *
 * @interface ListProjectsByContactResult
 * @property {Project[]} data - Array of projects for the requested page.
 * @property {number} totalCount - Total number of projects for the contact.
 */
export interface ListProjectsByContactResult {
  data: Project[];
  totalCount: number;
}
