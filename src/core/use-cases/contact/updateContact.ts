// src/core/use-cases/contact/updateContact.ts

import { Contact } from "@/core/domain/contact/entities/Contact";
import { ContactRepository } from "@/core/domain/contact/ports/contactRepository";
import { ContactUpdateDTO } from "@/core/domain/contact/types";
import { AppError } from "@/lib/errors/AppError";
import logger from "@/lib/logger";

/**
 * Use case for updating an existing contact in the database.
 * Ensures the contact exists before applying updates.
 *
 * @class UpdateContact
 * @implements {UseCase<{id: string; data: Partial<ContactUpdateDTO>}, Contact>}
 */
export class UpdateContact {
  /**
   * @param {ContactRepository} contactRepo - Concrete implementation of ContactRepository for data operations.
   */
  constructor(private readonly contactRepo: ContactRepository) {}

  /**
   * Executes the business logic to update a contact by ID:
   * 1. Verifies the contact exists
   * 2. Applies partial updates
   *
   * @method execute
   * @param {string} id - The unique identifier of the contact to update.
   * @param {Partial<ContactUpdateDTO>} data - Partial data for updating the contact.
   * @returns {Promise<Contact>} A promise resolving to the updated Contact entity.
   * @throws {AppError} If the contact is not found (404) or if an error occurs during update (500).
   *
   * @example
   * const useCase = new UpdateContact(contactRepo);
   * const updatedContact = await useCase.execute("contact-id", { name: "New Name" });
   */
  async execute(id: string, data: Partial<ContactUpdateDTO>): Promise<Contact> {
    logger.debug("UpdateContact.execute called with id =", id, "data =", data);

    // 1. Check if the contact exists
    const existing: Contact | null = await this.contactRepo.findById(id);
    if (!existing) {
      logger.info(
        `UpdateContact: no contact found for id = ${id}, throwing 404 error`
      );
      throw new AppError(`Contact with ID ${id} not found for update.`, 404);
    }

    try {
      // 2. Perform the update
      const updated: Contact = await this.contactRepo.update(id, data);
      logger.info(
        "UpdateContact: contact updated successfully, id =",
        updated.id
      );
      return updated;
    } catch (error) {
      logger.error(`UpdateContact: error updating contact id = ${id}`, error);
      throw new AppError(`Error updating contact with ID ${id}`, 500);
    }
  }
}
