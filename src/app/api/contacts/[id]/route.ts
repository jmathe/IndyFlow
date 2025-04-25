// src/app/api/projects/[id]/routes.ts

import { contactFormSchema } from "@/core/domain/contact/validation/contactFormSchema";
import { DeleteContact } from "@/core/use-cases/contact/deleteContact";
import { GetContact } from "@/core/use-cases/contact/getContact";
import { UpdateContact } from "@/core/use-cases/contact/updateContact";
import { contactRepo } from "@/infrastructure/prisma/contactRepo";
import { AppError } from "@/lib/errors/AppError";
import { handleError } from "@/lib/errors/handleError";
import logger from "@/lib/logger";
import { validateId } from "@/lib/validateId";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/contacts/:id
 *
 * API route to retrieve a single contact by ID.
 *
 * Responsibilities:
 * - Validates the ID from the URL parameters
 * - Calls the GetContact use case
 * - Returns a serialized ContactDTO or an error response
 *
 * @param {NextRequest} req - Incoming request
 * @param {{ params: { id: string } }} context - URL parameters
 * @returns {Promise<NextResponse>} The contact DTO or an error
 */
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = context.params;
  logger.debug("API GET /api/contacts/:id called", { id });

  try {
    // Validate and sanitize ID
    validateId(id);

    // Instantiate use case and execute it
    const useCase = new GetContact(contactRepo);
    const contact = await useCase.execute(id);

    logger.info("Contact fetched successfully", { id });
    return NextResponse.json(contact.toDTO());
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PUT /api/projects/:id
 * Updates an existing contact with provided fields.
 *
 * @param {NextRequest} req - Incoming request with JSON body of update fields.
 * @param {{ params: { id: string } }} context - Route context with dynamic parameters.
 * @returns {Promise<NextResponse>} JSON response with updated contact DTO or an error.
 */
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  logger.debug("API PUT /api/projects/:id called", { id });

  try {
    // Validate and sanitize ID
    validateId(id);

    // Parse and validate request body partially
    const body = await req.json();
    const parsed = contactFormSchema.partial().safeParse(body);
    if (!parsed.success) {
      logger.info("API PUT /api/projects/:id validation failed", {
        id,
        errors: parsed.error.errors,
      });
      throw new AppError("Invalid update data", 400);
    }
    const data = parsed.data;

    // Execute use case to update the contact
    const useCase = new UpdateContact(contactRepo);
    const updated = await useCase.execute(id, data);
    const dto = updated.toDTO();

    logger.info("API PUT /api/projects/:id successful", { id });
    return NextResponse.json(dto);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/projects/:id
 * Deletes an existing contact by its ID.
 *
 * @param {NextRequest} req - Incoming request object.
 * @param {{ params: { id: string } }} context - Route context with dynamic parameters.
 * @returns {Promise<NextResponse>} JSON response indicating success or an error.
 */
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  logger.debug("API DELETE /api/projects/:id called", { id });

  try {
    // Validate and sanitize ID
    validateId(id);

    // Execute use case to delete the contact
    const useCase = new DeleteContact(contactRepo);
    await useCase.execute(id);

    logger.info("API DELETE /api/projects/:id successful", { id });
    return NextResponse.json({ message: "Contact deleted successfully." });
  } catch (error) {
    return handleError(error);
  }
}
