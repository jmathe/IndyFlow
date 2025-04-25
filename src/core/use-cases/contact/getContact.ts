// src/core/use-cases/contact/getContact.ts

import { Contact } from "@/core/domain/contact/entities/Contact";
import { ContactRepository } from "@/core/domain/contact/ports/contactRepository";
import { AppError } from "@/lib/errors/AppError";
import logger from "@/lib/logger";

/**
 * Use case for retrieving a contact by its unique ID.
 * Interacts with the repository to fetch the Contact entity.
 *
 * @class GetContact
 * @implements {UseCase<string, Contact>}
 */
export class GetContact {
  /**
   * @param {ContactRepository} contactRepo - Concrete implementation of ContactRepository.
   */
  constructor(private readonly contactRepo: ContactRepository) {}

  /**
   * Executes the business logic to get a contact by ID:
   * 1. Fetches contact from repository
   * 2. Throws AppError if not found
   *
   * @method execute
   * @param {string} id - The ID of the contact to retrieve.
   * @returns {Promise<Contact>} A promise resolving to the Contact entity.
   * @throws {AppError} If no contact is found for the provided ID.
   *
   * @example
   * const useCase = new GetContact(contactRepo);
   * const contact = await useCase.execute("contact-id-to-fetch");
   */
  async execute(id: string): Promise<Contact> {
    logger.debug("GetContact.execute called with id =", id);

    // 1. Retrieve contact by ID
    const contact: Contact | null = await this.contactRepo.findById(id);
    if (!contact) {
      logger.info(
        `GetContact: no contact found for id = ${id}, throwing 404 error`
      );
      throw new AppError(`Contact with ID ${id} not found.`, 404);
    }

    logger.info("GetContact: contact retrieved, id =", id);
    return contact;
  }
}
