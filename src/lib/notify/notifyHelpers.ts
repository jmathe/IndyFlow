import { getErrorMessage } from "@/lib/errors/getErrorMessage";
import logger from "@/lib/logger";
import { notify } from "@/lib/notify/notify";

/**
 * Type representing the possible mutation actions.
 *
 * @typedef {MutationAction}
 */
export type MutationAction =
  | "create"
  | "update"
  | "delete"
  | "get"
  | "list"
  | "promote";

/**
 * Optional details to enrich notification messages.
 *
 * @interface NotifyOptions
 * @property {Record<string, string | number>} [details] - Additional information about the entity (e.g., ID, email).
 */
interface NotifyOptions {
  details?: Record<string, string | number>;
}

/**
 * Displays a standardized success notification for a mutation.
 * Also logs the event for debugging purposes.
 *
 * @function notifyMutationSuccess
 * @param {MutationAction} action - The type of mutation (create, update, delete, etc.).
 * @param {string} entity - The entity affected by the mutation (e.g., "Contact", "Project").
 * @param {NotifyOptions} [options] - Optional additional details for the message.
 *
 * @example
 * notifyMutationSuccess("create", "Contact", { details: { email: "john@example.com" } });
 */
export function notifyMutationSuccess(
  action: MutationAction,
  entity: string,
  options?: NotifyOptions
): void {
  const title = getSuccessTitle(action, entity);
  const description = getSuccessDescription(action, entity, options?.details);

  notify.success(title, description);
  logger.info("Notification success", {
    action,
    entity,
    details: options?.details,
  });
}

/**
 * Displays a standardized error notification for a mutation.
 * Also logs the event for debugging and error tracking purposes.
 *
 * @function notifyMutationError
 * @param {MutationAction} action - The type of mutation (create, update, delete, etc.).
 * @param {string} entity - The entity affected by the mutation (e.g., "Contact", "Project").
 * @param {unknown} error - The thrown error object.
 * @param {NotifyOptions} [options] - Optional additional details for the message.
 *
 * @example
 * notifyMutationError("delete", "Project", error, { details: { id: "123" } });
 */
export function notifyMutationError(
  action: MutationAction,
  entity: string,
  error: unknown,
  options?: NotifyOptions
): void {
  const message = getErrorMessage(error);
  const title = getErrorTitle(action, entity);
  const description = getErrorDescription(
    action,
    entity,
    message,
    options?.details
  );

  notify.error(title, description);
  logger.error("Notification error", {
    action,
    entity,
    details: options?.details,
    message,
  });
}

/**
 * Builds a title for a success notification based on action and entity.
 *
 * @function getSuccessTitle
 * @param {MutationAction} action - Mutation type.
 * @param {string} entity - Entity name.
 * @returns {string} Formatted success title.
 */
function getSuccessTitle(action: MutationAction, entity: string): string {
  switch (action) {
    case "create":
      return `${entity} created`;
    case "update":
      return `${entity} updated`;
    case "delete":
      return `${entity} deleted`;
    case "get":
      return `${entity} retrieved`;
    case "list":
      return `${entity}s retrieved`;
    case "promote":
      return `${entity} promoted`;
  }
}

/**
 * Builds a description for a success notification based on action, entity, and optional details.
 *
 * @function getSuccessDescription
 * @param {MutationAction} action - Mutation type.
 * @param {string} entity - Entity name.
 * @param {Record<string, string | number>} [details] - Additional information about the entity.
 * @returns {string} Formatted success description.
 */
function getSuccessDescription(
  action: MutationAction,
  entity: string,
  details?: Record<string, string | number>
): string {
  const detailText = formatDetails(details);

  switch (action) {
    case "create":
      return `The ${entity.toLowerCase()} has been successfully created ${detailText}.`;
    case "update":
      return `The ${entity.toLowerCase()} has been successfully updated ${detailText}.`;
    case "delete":
      return `The ${entity.toLowerCase()} has been successfully deleted ${detailText}.`;
    case "get":
      return `The ${entity.toLowerCase()} has been successfully retrieved ${detailText}.`;
    case "list":
      return `The ${entity.toLowerCase()}s have been successfully retrieved.`;
    case "promote":
      return `The ${entity.toLowerCase()} has been successfully promoted. ${detailText}.`;
  }
}

/**
 * Builds a title for an error notification based on action and entity.
 *
 * @function getErrorTitle
 * @param {MutationAction} action - Mutation type.
 * @param {string} entity - Entity name.
 * @returns {string} Formatted error title.
 */
function getErrorTitle(action: MutationAction, entity: string): string {
  switch (action) {
    case "create":
      return `Failed to create ${entity.toLowerCase()}`;
    case "update":
      return `Failed to update ${entity.toLowerCase()}`;
    case "delete":
      return `Failed to delete ${entity.toLowerCase()}`;
    case "get":
      return `Failed to retrieve ${entity.toLowerCase()}`;
    case "list":
      return `Failed to retrieve ${entity.toLowerCase()}s`;
    case "promote":
      return `Failed to promote ${entity.toLowerCase()}`;
  }
}

/**
 * Builds a description for an error notification based on action, entity, message, and optional details.
 *
 * @function getErrorDescription
 * @param {MutationAction} action - Mutation type.
 * @param {string} entity - Entity name.
 * @param {string} message - Error message extracted from the thrown error.
 * @param {Record<string, string | number>} [details] - Additional information about the entity.
 * @returns {string} Formatted error description.
 */
function getErrorDescription(
  action: MutationAction,
  entity: string,
  message: string,
  details?: Record<string, string | number>
): string {
  const detailText = formatDetails(details);

  switch (action) {
    case "create":
      return `Unable to create the ${entity.toLowerCase()} ${detailText}. ${message}`;
    case "update":
      return `Unable to update the ${entity.toLowerCase()} ${detailText}. ${message}`;
    case "delete":
      return `Unable to delete the ${entity.toLowerCase()} ${detailText}. ${message}`;
    case "get":
      return `Unable to retrieve the ${entity.toLowerCase()} ${detailText}. ${message}`;
    case "list":
      return `Unable to retrieve the ${entity.toLowerCase()}s. ${message}`;
    case "promote":
      return `Unable to promote the ${entity.toLowerCase()} ${detailText}. ${message}`;
  }
}

/**
 * Formats details into a string "(Key1: Value1, Key2: Value2)".
 *
 * @function formatDetails
 * @param {Record<string, string | number>} details - Key-value pairs to format.
 * @returns {string} Formatted details string or an empty string if none provided.
 *
 * @example
 * formatDetails({ id: "123", email: "john@example.com" });
 * // -> "(ID: 123, Email: john@example.com)"
 */
function formatDetails(details?: Record<string, string | number>): string {
  if (!details || Object.keys(details).length === 0) {
    return "";
  }

  const formatted = Object.entries(details)
    .map(([key, value]) => `${capitalize(key)}: ${value}`)
    .join(", ");

  return `(${formatted})`;
}

/**
 * Capitalizes the first letter of a string.
 *
 * @function capitalize
 * @param {string} str - The string to capitalize.
 * @returns {string} Capitalized string.
 *
 * @example
 * capitalize("email");
 * // -> "Email"
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
