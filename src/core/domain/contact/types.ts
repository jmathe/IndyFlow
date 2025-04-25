// src/core/contact/types.ts

import { ContactStatus } from "@/generated/prisma";

/**
 * Base interface representing a contact in the business domain.
 * A contact can be a prospect or an active client.
 * This entity is decoupled from any technology (ORM, DB, etc.).
 *
 * @interface ContactBase
 */
export interface ContactBase {
  /** Unique identifier of the contact in the database */
  id: string;
  /** Full name of the contact */
  name: string;
  /** Unique email address of the contact */
  email: string;
  /** Status of the contact, either PROSPECT or CLIENT */
  status: ContactStatus;
}

/**
 * Data Transfer Object for creating a contact via the API.
 * Contains fields required to create a new contact.
 *
 * @interface ContactCreateDTO
 * @extends Omit<ContactBase, "id">
 */
export interface ContactCreateDTO extends Omit<ContactBase, "id"> {
  /** Optional phone number of the contact */
  phone?: string;
  /** Optional company name associated with the contact */
  company?: string;
  /** Optional internal notes about the contact */
  notes?: string;
}

/**
 * Data Transfer Object for updating a contact via the API.
 * All fields are optional to allow partial updates.
 *
 * @interface ContactUpdateDTO
 */
export interface ContactUpdateDTO extends Partial<ContactCreateDTO> {}

/**
 * Data Transfer Object representing a contact returned by the API.
 * Extends ContactCreateDTO and ContactBase, adding creation timestamp.
 *
 * @interface ContactDTO
 */
export interface ContactDTO extends ContactCreateDTO, ContactBase {
  /** ISO-formatted creation date of the contact */
  createdAt: string;
}

/**
 * Represents a contact record in the database.
 * Creation timestamp is stored as a Date object.
 *
 * @interface ContactDB
 * @extends ContactBase
 */
export interface ContactDB extends ContactBase {
  /** Creation timestamp as a JavaScript Date */
  createdAt: Date;
  /** Phone number, null if not provided in the database */
  phone: string | null;
  /** Company name, null if not provided in the database */
  company: string | null;
  /** Internal notes, null if not provided in the database */
  notes: string | null;
}

/**
 * Parameters accepted for listing contacts.
 *
 * @typedef {Object} ListContactsParams
 * @property {number} [page=1] - Current page number (1-indexed).
 * @property {number} [limit=10] - Number of contacts per page.
 */
export interface ListContactsParams {
  page?: number;
  limit?: number;
}

/**
 * Response structure for paginated contact results.
 *
 * @typedef {Object} ListContactsResponse
 * @property {ContactDTO[]} data - The array of returned contact DTOs.
 * @property {number} totalCount - The total number of contacts across all pages.
 */
export interface ListContactsResponse {
  data: ContactDTO[];
  totalCount: number;
}
