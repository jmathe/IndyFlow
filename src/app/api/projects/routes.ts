// src/app/api/projects/routes.ts

import { ProjectDTO } from "@/core/domain/project/types";
import {
  projectFormSchema,
  ProjectFormValues,
} from "@/core/domain/project/validation/projectFormSchema";
import { CreateProject } from "@/core/use-cases/project/createProject";
import { ListProjects } from "@/core/use-cases/project/listProjects";
import { projectRepo } from "@/infrastructure/prisma/projectRepo";
import { AppError } from "@/lib/errors/AppError";
import { handleError } from "@/lib/errors/handleError";
import { parsePaginationParams } from "@/lib/http/parsePaginationParams";
import logger from "@/lib/logger";
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
    logger.debug("API POST /api/projects payload", body);

    // Validate request body
    const parsed = projectFormSchema.safeParse(body);
    if (!parsed.success) {
      logger.info("API POST /api/projects validation failed", {
        errors: parsed.error.errors,
      });
      throw new AppError("Invalid project data", 400);
    }
    const data = parsed.data as ProjectFormValues;

    // Execute use case to create project
    const createProjectUC = new CreateProject(projectRepo);
    const newProject = await createProjectUC.execute(data);
    const dto = newProject.toDTO();

    logger.info("API POST /api/projects success", { id: dto.id });
    return NextResponse.json(dto, { status: 201 });
  } catch (error) {
    logger.error("API POST /api/projects error", error);
    return handleError(error);
  }
}
