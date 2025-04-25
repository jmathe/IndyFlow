// src/infrastructure/services/project.service.ts

import {
  ListProjectsParams,
  ListProjectsResult,
  ProjectCreateDTO,
  ProjectDTO,
} from "@/core/domain/project/types";
import { AppError } from "@/lib/errors/AppError";
import logger from "@/lib/logger";

/**
 * Sends a GET request to fetch a paginated list of projects.
 *
 * @function listProjectsRequest
 * @param {ListProjectsParams} params - Pagination parameters.
 * @returns {Promise<ListProjectsResult>} A promise resolving to paginated project data.
 * @throws {AppError} If the server returns a non-2xx response.
 *
 * @example
 * const { data, totalCount } = await listProjectsRequest({ page: 2, limit: 10 });
 */
export async function listProjectsRequest(
  params: ListProjectsParams = {}
): Promise<ListProjectsResult> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  // construct the URL with pagination parameters
  const url = `/api/projects?page=${page}&limit=${limit}`;
  logger.debug("project.service: Fetching projects", { page, limit });

  const response = await fetch(url);

  // if an error occurs, throw an AppError
  if (!response.ok) {
    logger.error("project.service: Failed to fetch projects", {
      status: response.status,
      url,
    });
    throw new AppError("Failed to fetch projects", response.status);
  }

  logger.info("project.service: Projects fetched successfully", {
    page,
    limit,
  });

  // return the projects and total count
  return response.json();
}

/**
 * Sends a POST request to create a new project.
 *
 * @function createProjectRequest
 * @param {ProjectCreateDTO} data - Project creation payload.
 * @returns {Promise<ProjectDTO>} A promise resolving to the created project DTO.
 * @throws {AppError} If creation fails.
 */
export async function createProjectRequest(
  data: ProjectCreateDTO
): Promise<ProjectDTO> {
  logger.debug("project.service: Creating project", { data });

  // send POST request to /api/projects
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  // if an error occurs, throw an AppError
  if (!response.ok) {
    logger.error("project.service: Failed to create project", {
      status: response.status,
    });
    throw new AppError("Failed to create project", response.status);
  }

  const project = await response.json();
  logger.info("project.service: Project created successfully", {
    id: project.id,
  });

  // return the created project DTO
  return project;
}

/**
 * Sends a GET request to retrieve a project by ID.
 *
 * @function getProjectRequest
 * @param {string} id - The ID of the project to retrieve.
 * @returns {Promise<ProjectDTO>} A promise resolving to the project DTO.
 * @throws {AppError} If retrieval fails.
 */
export async function getProjectRequest(id: string): Promise<ProjectDTO> {
  logger.debug("project.service: Fetching project", { id });

  const response = await fetch(`/api/projects/${id}`);

  // if an error occurs, throw an AppError
  if (!response.ok) {
    logger.error("project.service: Failed to fetch project", {
      id,
      status: response.status,
    });
    throw new AppError("Failed to fetch project", response.status);
  }

  const project = await response.json();
  logger.info("project.service: Project fetched successfully", {
    id: project.id,
  });

  // return the project DTO
  return project;
}

/**
 * Sends a PUT request to update an existing project by ID.
 *
 * @function updateProjectRequest
 * @param {string} id - ID of the project to update.
 * @param {Partial<ProjectCreateDTO>} data - Partial project update payload.
 * @returns {Promise<ProjectDTO>} A promise resolving to the updated project DTO.
 * @throws {AppError} If the update fails.
 */
export async function updateProjectRequest(
  id: string,
  data: Partial<ProjectCreateDTO>
): Promise<ProjectDTO> {
  logger.debug("project.service: Updating project", { id, data });

  // send PUT request to /api/projects/:id
  const response = await fetch(`/api/projects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  // if an error occurs, throw an AppError
  if (!response.ok) {
    logger.error("project.service: Failed to update project", {
      id,
      status: response.status,
    });
    throw new AppError("Failed to update project", response.status);
  }

  const updated = await response.json();
  logger.info("project.service: Project updated successfully", {
    id: updated.id,
  });

  // return the updated project DTO
  return updated;
}

/**
 * Sends a DELETE request to remove a project by ID.
 *
 * @function deleteProjectRequest
 * @param {string} id - The ID of the project to delete.
 * @returns {Promise<void>} Resolves when deletion is successful.
 * @throws {AppError} If the deletion fails.
 */
export async function deleteProjectRequest(id: string): Promise<void> {
  logger.debug("project.service: Deleting project", { id });

  // send DELETE request to /api/projects/:id
  const response = await fetch(`/api/projects/${id}`, {
    method: "DELETE",
  });

  // if an error occurs, throw an AppError
  if (!response.ok) {
    logger.error("project.service: Failed to delete project", {
      id,
      status: response.status,
    });
    throw new AppError(
      `Failed to delete project with ID ${id}`,
      response.status
    );
  }

  logger.info("project.service: Project deleted successfully", { id });
}

/**
 * Fetches the list of projects associated with a specific contact ID.
 *
 * @function listProjectsByContact
 * @param {string} contactId - The unique identifier of the contact.
 * @returns {Promise<ListProjectsResult>} A promise resolving to the list of projects.
 * @throws {AppError} If the server response is not successful.
 */
export async function listProjectsByContact(
  contactId: string
): Promise<ListProjectsResult> {
  logger.debug("project.service: Fetching projects for contact", { contactId });

  const url = `/api/projects/contact/${contactId}`;
  const response = await fetch(url);

  if (!response.ok) {
    logger.error("project.service: Failed to fetch projects by contact", {
      contactId,
      status: response.status,
    });
    throw new AppError("Failed to fetch projects by contact", response.status);
  }

  logger.info("project.service: Projects fetched successfully", { contactId });
  return response.json();
}
