// src/lib/errors/getErrorMessage.ts

/**
 * Extracts a readable error message from any unknown error.
 *
 * @function getErrorMessage
 * @param {unknown} error - The thrown error object.
 * @returns {string} A human-readable error message.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "A unknown error occurred.";
}
