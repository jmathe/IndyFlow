// src/app/api/projects/contact/[contactId]/routes.ts

import { ProjectDTO } from "@/core/domain/project/types";
import { ListProjectsByContact } from "@/core/use-cases/project/listProjectsByContact";
import { projectRepo } from "@/infrastructure/prisma/projectRepo";
import { handleError } from "@/lib/errors/handleError";
import { parsePaginationParams } from "@/lib/http/parsePaginationParams";
import logger from "@/lib/logger";
import { validateId } from "@/lib/validateId";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/projects/contact/[contactId]
 * Handler for retrieving a paginated list of projects for a specific contact.
 *
 * @param {NextRequest} req - The incoming HTTP request.
 * @param {{ params: { contactId: string } }} context - Route context containing path parameters.
 * @param {string} context.params.contactId - The contact's unique ID (CUID).
 * @returns {Promise<NextResponse>} JSON response with { data: ProjectDTO[], totalCount: number }.
 */
export async function GET(
  req: NextRequest,
  context: { params: { contactId: string } }
): Promise<NextResponse> {
  // Extract path and query parameters
  const { contactId } = await context.params;
  validateId(contactId);

  const url = new URL(req.url);
  const { page, limit } = parsePaginationParams(url.searchParams);

  logger.debug("API GET /api/projects/contact/[contactId] start", {
    contactId,
    page,
    limit,
  });

  try {
    // Execute the use case to fetch projects for the contact
    const listUseCase = new ListProjectsByContact(projectRepo);
    const result = await listUseCase.execute({ contactId, page, limit });

    // Convert each Project entity to its DTO representation
    const projectDTOs: ProjectDTO[] = result.data.map((project) =>
      project.toDTO()
    );

    logger.info("API GET /api/projects/contact/[contactId] success", {
      contactId,
      retrievedCount: projectDTOs.length,
      totalCount: result.totalCount,
    });

    // Return the paginated list of projects
    return NextResponse.json(
      { data: projectDTOs, totalCount: result.totalCount },
      { status: 200 }
    );
  } catch (error) {
    // Log and handle errors consistently
    logger.error("API GET /api/projects/contact/[contactId] error", error);
    return handleError(error);
  }
}
