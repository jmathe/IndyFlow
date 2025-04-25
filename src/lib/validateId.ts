// src/lib/validateId.ts

import { AppError } from "@/lib/errors/AppError";

/**
 * Validates a provided ID string.
 *
 * @function validateId
 * @param {string} id - The ID to validate.
 * @throws {AppError} - Throws if the ID is missing or invalid.
 */
export function validateId(id: string): void {
  if (!id || typeof id !== "string" || id.trim() === "") {
    throw new AppError("Missing or invalid ID", 400);
  }
}
