// src/infrastructure/services/contact.service.ts

import {
  ContactCreateDTO,
  ContactDTO,
  ListContactsParams,
  ListContactsResponse,
} from "@/core/domain/contact/types";
import { AppError } from "@/lib/errors/AppError";
import logger from "@/lib/logger";

/**
 * Sends a GET request to fetch a paginated list of contacts.
 *
 * @function listContactsRequest
 * @param {ListContactsParams} params - Pagination parameters.
 * @returns {Promise<ListContactsResponse>} A promise resolving to paginated contact data.
 * @throws {AppError} If the server returns a non-2xx response.
 *
 * @example
 * const { data, totalCount } = await listContactsRequest({ page: 2, limit: 10 });
 */
export async function listContactsRequest(
  params: ListContactsParams = {}
): Promise<ListContactsResponse> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  // build the URL with pagination parameters
  const url = `/api/contacts?page=${page}&limit=${limit}`;

  const response = await fetch(url);

  // if an error occurs, throw an AppError
  if (!response.ok) {
    logger.error("contact.service: Failed to fetch contacts", {
      status: response.status,
      url,
    });
    throw new AppError("Failed to fetch contacts", response.status);
  }

  logger.info("contact.service: Contacts fetched successfully", {
    page,
    limit,
  });

  // return the contacts and total count
  return response.json();
}

/**
 * Sends a POST request to the /api/contacts endpoint to create a new contact.
 *
 * @function createContactRequest
 * @param {ContactCreateDTO} data - The contact creation payload.
 * @returns {Promise<ContactDTO>} A promise that resolves with the created contact DTO.
 * @throws {AppError} If the server returns an error response.
 */
export async function createContactRequest(
  data: ContactCreateDTO
): Promise<ContactDTO> {
  logger.debug("contact.service: Creating contact", { data });
  // Send POST request to /api/contacts
  const response = await fetch("/api/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  // if an error occurs, throw an AppError
  if (!response.ok) {
    logger.error("contact.service: Failed to create contact", {
      status: response.status,
    });
    throw new AppError("Failed to create contact", response.status);
  }
  logger.info("contact.service: Contact created successfully", {
    email: data.email,
  });

  // return the created contact DTO
  return response.json();
}

/**
 * Sends a GET request to retrieve a contact by ID.
 *
 * @function getContactRequest
 * @param {string} id - The unique identifier of the contact to retrieve.
 * @returns {Promise<ContactDTO>} A promise resolving with the contact DTO.
 * @throws {AppError} If the request fails (e.g., 404 or network error).
 */
export async function getContactRequest(id: string): Promise<ContactDTO> {
  logger.debug("contact.service: retrieving contact", { id });
  const response = await fetch(`/api/contacts/${id}`);

  // If the request fails, throw an error
  if (!response.ok) {
    logger.error("contact.service: Failed to retrieve contact", {
      id,
      status: response.status,
    });
    throw new AppError("Failed to retrieve contact", response.status);
  }

  // Parse the response as a ContactDTO
  const contact: ContactDTO = await response.json();

  logger.info("contact.service: Contact successfully retrieved", {
    id: contact.id,
  });

  //return the contact DTO
  return contact;
}

// src/infrastructure/services/contact.service.ts

import { ContactUpdateDTO } from "@/core/domain/contact/types";

/**
 * Sends a PUT request to update a contact by ID.
 *
 * @function updateContactRequest
 * @param {string} id - Contact ID to update.
 * @param {ContactUpdateDTO} data - New contact values.
 * @returns {Promise<ContactDTO>} Updated contact.
 * @throws {AppError} If update fails.
 */
export async function updateContactRequest(
  id: string,
  data: ContactUpdateDTO
): Promise<ContactDTO> {
  logger.debug("contact.service: updating contact", { id, data });

  // Send PUT request to /api/contacts/:id
  const response = await fetch(`/api/contacts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  // If the request fails, throw an error
  if (!response.ok) {
    logger.error("contact.service: failed to update contact", {
      id,
      status: response.status,
    });
    throw new AppError("Failed to update contact", response.status);
  }

  const updated = await response.json();
  logger.info("contact.service: contact updated successfully", { id });

  // Return the updated contact DTO
  return updated;
}

/**
 * Sends a DELETE request to the contact API endpoint to remove a contact.
 *
 * @function deleteContactRequest
 * @param {string} id - The unique identifier of the contact to delete.
 * @returns {Promise<void>} A promise that resolves when the contact is successfully deleted.
 * @throws {AppError} If the request fails (non-2xx HTTP status).
 */
export async function deleteContactRequest(id: string): Promise<void> {
  logger.debug("contact.service: Deleting contact", { id });
  const response = await fetch(`/api/contacts/${id}`, {
    method: "DELETE",
  });

  // If the request fails, throw an error
  if (!response.ok) {
    logger.error("contact.service: Failed to delete contact", {
      id,
      status: response.status,
    });
    throw new AppError(
      `Failed to delete contact with ID ${id}`,
      response.status
    );
  }
  logger.info("contact.service: Contact deleted successfully", { id });
}
