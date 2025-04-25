// src/core/use-cases/contact/deleteContact.ts

import { Contact } from "@/core/domain/contact/entities/Contact";
import { ContactRepository } from "@/core/domain/contact/ports/contactRepository";
import { AppError } from "@/lib/errors/AppError";
import logger from "@/lib/logger";

/**
 * Use case for deleting an existing contact by ID.
 *
 * This use case ensures that the contact exists before allowing deletion.
 * It interacts with the ContactRepository to perform domain-level operations.
 *
 * @class DeleteContact
 */
export class DeleteContact {
  /**
   * Creates an instance of DeleteContact.
   *
   * @param {ContactRepository} contactRepo - The contact repository used to perform data access.
   */
  constructor(private readonly contactRepo: ContactRepository) {}

  /**
   * Executes the business logic to delete a contact:
   * 1. Validates that the contact exists
   * 2. Delegates deletion to the repository
   *
   * @async
   * @method execute
   * @param {string} id - The unique identifier of the contact to delete.
   * @returns {Promise<void>} A promise that resolves when the contact is successfully deleted.
   * @throws {AppError} If no contact is found with the provided ID.
   *
   * @example
   * const useCase = new DeleteContact(contactRepo)
   * await useCase.execute("contact-id-to-delete")
   */
  async execute(id: string): Promise<void> {
    logger.debug("DeleteContact.execute called with id =", id);

    // Try to find the contact by ID
    const existing: Contact | null = await this.contactRepo.findById(id);

    // If the contact is not found, throw an error
    if (!existing) {
      logger.info(
        `DeleteContact: No contact found with id = ${id}, throwing not found error.`
      );
      throw new AppError(
        `Unable to delete contact. No contact found with ID ${id}.`,
        404
      );
    }

    // Delete the contact via the repository
    await this.contactRepo.delete(id);
    logger.info("DeleteContact: Contact successfully deleted, id =", id);
  }
}
