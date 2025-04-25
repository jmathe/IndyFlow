// src/lib/errors/AppError.ts

/**
 * Represents an application-specific error with an HTTP status code.
 *
 * @class AppError
 * @extends {Error}
 */
export class AppError extends Error {
  /**
   * HTTP status code associated with this error.
   * @type {number}
   */
  public readonly statusCode: number;

  /**
   * Creates an instance of AppError.
   * @param {string} message - Error message describing the failure.
   * @param {number} [statusCode=400] - HTTP status code; defaults to 400 Bad Request.
   */
  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;

    // Maintains proper prototype chain (necessary for transpiled ES5 code)
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
