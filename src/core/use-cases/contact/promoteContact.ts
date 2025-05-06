// src/core/use-cases/contact/promoteContact.ts

import { Contact } from "@/core/domain/contact/entities/Contact";
import { ContactRepository } from "@/core/domain/contact/ports/contactRepository";
import { AppError } from "@/lib/errors/AppError";
import logger from "@/lib/logger";

/**
 * Use case to promote a contact from PROSPECT to CLIENT.
 *
 * @class PromoteContact
 * @implements {UseCase<string, void>}
 */
export class PromoteContact {
  /**
   * @param {ContactRepository} contactRepo - Concrete implementation of ContactRepository for data operations.
   */
  constructor(private readonly contactRepo: ContactRepository) {}

  /**
   * Executes the business logic to promote a prospect:
   * 1. Verifies the contact exists
   * 2. Ensures the contact is a PROSPECT
   * 3. Updates the contact's status to CLIENT
   *
   * @method execute
   * @param {string} contactId - The unique identifier of the contact to promote.
   * @returns {Promise<void>} A promise that resolves when the promotion is complete.
   * @throws {AppError} If the contact is not found (404) or not a prospect (400).
   *
   * @example
   * const useCase = new PromoteContact(contactRepo);
   * await useCase.execute("contact-id");
   */
  async execute(contactId: string): Promise<void> {
    logger.debug("PromoteContact.execute called with contactId =", contactId);

    // 1. Retrieve the contact
    const contact: Contact | null = await this.contactRepo.findById(contactId);

    if (!contact) {
      logger.info(
        `PromoteContact: no contact found for id = ${contactId}, throwing 404 error`
      );
      throw new AppError(`Contact with ID ${contactId} not found.`, 404);
    }
    logger.debug("PromoteContact: contact found with status", contact.status);

    // 2. Check that the contact is a prospect
    if (contact.status !== "PROSPECT") {
      logger.info(
        `PromoteContact: contact id = ${contactId} is not a prospect (status = ${contact.status}), throwing 400 error`
      );
      throw new AppError(
        `Only prospects can be promoted. Current status: ${contact.status}`,
        400
      );
    }

    try {
      // 3. Promote the contact to client
      await this.contactRepo.update(contactId, { status: "CLIENT" });
      logger.info(
        `PromoteContact: contact id = ${contactId} promoted successfully to CLIENT`
      );
    } catch (error) {
      logger.error(
        `PromoteContact: error while promoting contact id = ${contactId}`,
        error
      );
      throw new AppError(
        `Error promoting contact with ID ${contactId} to CLIENT`,
        500
      );
    }
  }
}
