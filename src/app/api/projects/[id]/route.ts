// src/app/api/projects/[id]/route.ts

import { ProjectDTO } from "@/core/domain/project/types";
import { projectUpdateSchema } from "@/core/domain/project/validation/projectFormSchema";
import { PromoteContact } from "@/core/use-cases/contact/promoteContact";
import { DeleteProject } from "@/core/use-cases/project/deleteProject";
import { GetProject } from "@/core/use-cases/project/getProject";
import { UpdateProject } from "@/core/use-cases/project/updateProject";
import { contactRepo } from "@/infrastructure/prisma/contactRepo";
import { projectRepo } from "@/infrastructure/prisma/projectRepo";
import { AppError } from "@/lib/errors/AppError";
import { handleError } from "@/lib/errors/handleError";
import logger from "@/lib/logger";
import { validateId } from "@/lib/validateId";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/projects/:id
 * Retrieves a project by its unique ID.
 *
 * @async
 * @function GET
 * @param {NextRequest} req - Incoming HTTP request.
 * @param {{ params: { id: string } }} context - Route context with dynamic parameters.
 * @param {string} context.params.id - The project's unique ID (CUID).
 * @returns {Promise<NextResponse>} JSON response containing the ProjectDTO.
 * @throws {AppError} If the project is not found or ID is invalid.
 */
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = await context.params;
  logger.debug("API GET /api/projects/:id start", { id });

  try {
    // Validate project ID
    validateId(id);

    // Execute use case to retrieve project
    const getProjectUC = new GetProject(projectRepo);
    const project = await getProjectUC.execute(id);
    const dto: ProjectDTO = project.toDTO();

    logger.info("API GET /api/projects/:id success", { id });
    return NextResponse.json(dto, { status: 200 });
  } catch (error) {
    logger.error("API GET /api/projects/:id error", error);
    return handleError(error);
  }
}

/**
 * PUT /api/projects/:id
 * Updates an existing project with provided fields.
 *
 * @async
 * @function PUT
 * @param {NextRequest} req - Incoming HTTP request with JSON body of update fields.
 * @param {{ params: { id: string } }} context - Route context with dynamic parameters.
 * @param {string} context.params.id - The project's unique ID (CUID).
 * @returns {Promise<NextResponse>} JSON response containing the updated ProjectDTO.
 * @throws {AppError} If validation fails or project is not found.
 */
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = await context.params;
  logger.debug("API PUT /api/projects/:id start", { id });

  try {
    // Validate project ID
    validateId(id);

    // Parse body
    const body = await req.json();

    // Validate project fields
    const parsed = projectUpdateSchema.safeParse(body);
    if (!parsed.success) {
      logger.info("API PUT /api/projects/:id validation failed", {
        id,
        errors: parsed.error.errors,
      });
      throw new AppError("Invalid project update data", 400);
    }
    const { promoteContact, ...data } = parsed.data;
    logger.debug("PUT : promoteContact", promoteContact);
    //const data: Partial<ProjectFormValues> = parsed.data;

    // If promoteContact is true, execute the use-case
    if (promoteContact === true) {
      logger.debug("PUT : promoteContact is true");
      // Extract contactId from projectData
      const contactId: string = data.contactId ?? "";
      validateId(contactId);

      // Execute use-case to promote contact
      const promoteContactUC = new PromoteContact(contactRepo);
      await promoteContactUC.execute(contactId);
      logger.info("API PUT /api/projects/:id contact promoted", {
        contactId: data.contactId,
      });
    }

    // Execute use case to update project
    const updateProjectUC = new UpdateProject(projectRepo);
    const updated = await updateProjectUC.execute(id, data);
    const dto: ProjectDTO = updated.toDTO();

    logger.info("API PUT /api/projects/:id success", { id });
    return NextResponse.json(dto, { status: 200 });
  } catch (error) {
    logger.error("API PUT /api/projects/:id error", error);
    return handleError(error);
  }
}

/**
 * DELETE /api/projects/:id
 * Deletes an existing project by its ID.
 *
 * @async
 * @function DELETE
 * @param {NextRequest} req - Incoming HTTP request.
 * @param {{ params: { id: string } }} context - Route context with dynamic parameters.
 * @param {string} context.params.id - The project's unique ID (CUID).
 * @returns {Promise<NextResponse>} JSON response indicating deletion success.
 * @throws {AppError} If the project is not found or ID is invalid.
 */
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = await context.params;
  logger.debug("API DELETE /api/projects/:id start", { id });

  try {
    // Validate project ID
    validateId(id);

    // Execute use case to delete project
    const deleteProjectUC = new DeleteProject(projectRepo);
    await deleteProjectUC.execute(id);

    logger.info("API DELETE /api/projects/:id success", { id });
    return NextResponse.json(
      { message: "Project deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
