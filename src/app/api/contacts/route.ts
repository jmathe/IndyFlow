// src/app/api/contacts/route.ts

import { ContactDTO } from "@/core/domain/contact/types";
import { contactFormSchema } from "@/core/domain/contact/validation/contactFormSchema";
import { CreateContact } from "@/core/use-cases/contact/createContact";
import { ListContacts } from "@/core/use-cases/contact/listContacts";
import { contactRepo } from "@/infrastructure/prisma/contactRepo";
import { AppError } from "@/lib/errors/AppError";
import { handleError } from "@/lib/errors/handleError";
import { parsePaginationParams } from "@/lib/http/parsePaginationParams";
import logger from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/contacts
 * Retrieves a paginated list of contacts.
 *
 * Query Parameters:
 * - page: number (default: 1)
 * - limit: number (default: 10)
 *
 * @param {NextRequest} req - The incoming HTTP request.
 * @returns {Promise<NextResponse>} JSON response containing { data: ContactDTO[], totalCount: number }.
 */
export async function GET(req: NextRequest) {
  // Extract pagination parameters
  const url = new URL(req.url);
  const { page, limit } = parsePaginationParams(url.searchParams);

  logger.debug("API GET /api/contacts called", { page, limit });

  try {
    // Execute use case to list contacts
    const useCase = new ListContacts(contactRepo);
    const { data, totalCount } = await useCase.execute({ page, limit });

    // Convert entities to DTOs
    const contactDTOs: ContactDTO[] = data.map((contact) => contact.toDTO());

    logger.info("API GET /api/contacts successful", {
      page,
      limit,
      count: contactDTOs.length,
    });
    return NextResponse.json({ data: contactDTOs, totalCount });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/contacts
 *
 * API route to create a new contact.
 *
 * Responsibilities:
 * - Validates the request body using Zod schema
 * - Delegates contact creation to the CreateContact use case
 * - Returns a serialized ContactDTO or an error response
 *
 * @param {NextRequest} req - Incoming HTTP request with JSON body
 * @returns {Promise<NextResponse>} JSON response with created contact or error
 */
export async function POST(req: NextRequest) {
  logger.debug("API POST /api/contacts called");

  try {
    const body = await req.json();
    logger.debug("API POST /api/contacts payload", body);

    // Validate request body against schema
    const parsed = contactFormSchema.safeParse(body);
    if (!parsed.success) {
      logger.info("API POST /api/contacts validation failed", {
        errors: parsed.error.errors,
      });
      throw new AppError("Invalid contact data", 400);
    }

    // Execute use case to create contact
    const useCase = new CreateContact(contactRepo);
    const newContact = await useCase.execute(parsed.data);
    const dto = newContact.toDTO();

    logger.info("API POST /api/contacts successful", { id: dto.id });
    return NextResponse.json(dto, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
