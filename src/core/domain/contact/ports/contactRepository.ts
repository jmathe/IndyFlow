// src/core/contact/ports/contactRepository.ts

import { Contact } from "@/core/domain/contact/entities/Contact";
import {
  ContactCreateDTO,
  ContactUpdateDTO,
} from "@/core/domain/contact/types";
import { FindManyParams } from "@/core/shared/types/pagination";

/**
 * Contract defining data access methods for Contact entities.
 * Infrastructure implementations (e.g., Prisma) must adhere to this interface.
 *
 * @interface ContactRepository
 */
export interface ContactRepository {
  /**
   * Creates a new contact with the provided data.
   * @param {ContactCreateDTO} data - Data Transfer Object for creating a contact.
   * @returns {Promise<Contact>} A promise resolving to the created Contact entity.
   */
  create(data: ContactCreateDTO): Promise<Contact>;

  /**
   * Finds a contact by email.
   * @param {string} email - The email to search for.
   * @returns {Promise<Contact | null>} The Contact entity or null if not found.
   */
  findByEmail(email: string): Promise<Contact | null>;

  /**
   * Finds a contact by its unique ID.
   * @param {string} id - The contact's ID.
   * @returns {Promise<Contact | null>} The Contact entity or null if not found.
   */
  findById(id: string): Promise<Contact | null>;

  /**
   * Updates an existing contact by ID with partial data.
   * @param {string} id - The ID of the contact to update.
   * @param {Partial<ContactUpdateDTO>} data - Partial data for updating the contact.
   * @returns {Promise<Contact>} A promise resolving to the updated Contact entity.
   */
  update(id: string, data: Partial<ContactUpdateDTO>): Promise<Contact>;

  /**
   * Deletes a contact by its ID.
   * @param {string} id - The ID of the contact to delete.
   * @returns {Promise<void>} A promise that resolves upon successful deletion.
   */
  delete(id: string): Promise<void>;

  /**
   * Retrieves multiple contacts with optional pagination.
   * @param {FindManyParams} [params] - Optional pagination parameters (skip, take).
   * @returns {Promise<Contact[]>} A promise resolving to an array of Contact entities.
   */
  findMany(params?: FindManyParams): Promise<Contact[]>;

  /**
   * Counts the total number of contacts in the data store.
   * @returns {Promise<number>} A promise resolving to the total contact count.
   */
  count(): Promise<number>;
}
