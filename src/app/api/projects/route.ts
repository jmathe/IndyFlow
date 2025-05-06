// src/app/api/projects/route.ts

import { ProjectDTO } from "@/core/domain/project/types";
import {
  projectFormSchema,
  ProjectFormValues,
} from "@/core/domain/project/validation/projectFormSchema";
import { PromoteContact } from "@/core/use-cases/contact/promoteContact";
import { CreateProject } from "@/core/use-cases/project/createProject";
import { ListProjects } from "@/core/use-cases/project/listProjects";
import { contactRepo } from "@/infrastructure/prisma/contactRepo";
import { projectRepo } from "@/infrastructure/prisma/projectRepo";
import { AppError } from "@/lib/errors/AppError";
import { handleError } from "@/lib/errors/handleError";
import { parsePaginationParams } from "@/lib/http/parsePaginationParams";
import logger from "@/lib/logger";
import { validateId } from "@/lib/validateId";
import { NextRequest, NextResponse } from "next/server";

/**
 * Retrieves a paginated list of all projects.
 *
 * @async
 * @function GET
 * @param {NextRequest} req - The incoming HTTP request.
 * @param {string} req.url - URL should include optional query parameters `page` and `limit`.
 * @returns {Promise<NextResponse>} JSON response with the following structure:
 * {
 *   data: ProjectDTO[],
 *   totalCount: number
 * }
 * @throws {AppError} When validation or processing fails.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const { page, limit } = parsePaginationParams(url.searchParams);

  logger.debug("API GET /api/projects start", { page, limit });

  try {
    // Execute use case to list projects
    const listProjectsUC = new ListProjects(projectRepo);
    const result = await listProjectsUC.execute({ page, limit });

    // Map entities to DTOs
    const projectDTOs: ProjectDTO[] = result.data.map((project) =>
      project.toDTO()
    );

    logger.info("API GET /api/projects success", {
      retrievedCount: projectDTOs.length,
      totalCount: result.totalCount,
    });

    return NextResponse.json(
      { data: projectDTOs, totalCount: result.totalCount },
      { status: 200 }
    );
  } catch (error) {
    logger.error("API GET /api/projects error", error);
    return handleError(error);
  }
}

/**
 * Creates a new project with provided data.
 *
 * @async
 * @function POST
 * @param {NextRequest} req - The incoming HTTP request with JSON body.
 * @returns {Promise<NextResponse>} JSON response containing the created ProjectDTO.
 * @throws {AppError} When validation or creation fails.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  logger.debug("API POST /api/projects start");

  try {
    const body = await req.json();
    const { promoteContact, ...projectData } = body;
    logger.debug("API POST /api/projects received payload", {
      projectData,
      promoteContact,
    });

    // Validate request body
    const parsed = projectFormSchema.safeParse(projectData);
    if (!parsed.success) {
      logger.info("API POST /api/projects validation failed", {
        errors: parsed.error.errors,
      });
      throw new AppError("Invalid project data", 400);
    }
    const data = parsed.data as ProjectFormValues;

    // If promoteContact is true, promote the associated contact
    if (promoteContact === true) {
      // Extract contactId from projectData
      const contactId: string = data.contactId;
      validateId(contactId);

      // Execute use-case to promote contact
      const promoteContactUC = new PromoteContact(contactRepo);
      await promoteContactUC.execute(data.contactId);
      logger.info("API POST /api/projects contact promoted", {
        contactId: data.contactId,
      });
    }

    // Execute use case to create project
    const createProjectUC = new CreateProject(projectRepo);
    const newProject = await createProjectUC.execute(data);
    const dto = newProject.toDTO();

    logger.info("API POST /api/projects success", { id: dto.id });
    return NextResponse.json(dto, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
