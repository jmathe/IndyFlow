// src/lib/errors/handleError.ts

import logger from "@/lib/logger";
import { NextResponse } from "next/server";
import { AppError } from "./AppError";

/**
 * Standardizes errors into API responses.
 *
 * @function handleError
 * @param {unknown} error - The thrown error to handle.
 * @returns {NextResponse} A JSON response with an error message and HTTP status.
 */
export function handleError(error: unknown): NextResponse {
  // Log the error at the infrastructure boundary to capture stack and context
  logger.error("[API ERROR]", error);

  if (error instanceof AppError) {
    // Known application error: return its status code and message
    return NextResponse.json(
      { message: error.message },
      { status: error.statusCode }
    );
  }

  // Unexpected error: return generic 500 Internal Server Error
  return NextResponse.json(
    { message: "Internal server error." },
    { status: 500 }
  );
}
