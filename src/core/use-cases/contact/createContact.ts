// src/core/use-cases/contact/createContact.ts

import { Contact } from "@/core/domain/contact/entities/Contact";
import { ContactRepository } from "@/core/domain/contact/ports/contactRepository";
import { ContactCreateDTO } from "@/core/domain/contact/types";
import { AppError } from "@/lib/errors/AppError";
import logger from "@/lib/logger";

/**
 * Use case for creating a new contact.
 * Validates email uniqueness before delegating creation to the repository.
 *
 * @class CreateContact
 * @implements {UseCase<ContactCreateDTO, Contact>}
 */
export class CreateContact {
  /**
   * @param {ContactRepository} contactRepo - Concrete implementation of the ContactRepository interface.
   */
  constructor(private readonly contactRepo: ContactRepository) {}

  /**
   * Executes the business logic to create a contact:
   * 1. Checks for existing contact by email
   * 2. Creates a new contact via the repository
   *
   * @method execute
   * @param {ContactCreateDTO} data - Data required to create the contact.
   * @returns {Promise<Contact>} The newly created Contact entity.
   * @throws {AppError} If a contact with the provided email already exists.
   *
   * @example
   * const useCase = new CreateContact(contactRepo);
   * const newContact = await useCase.execute({
   *   name: "John Doe",
   *   email: "john@example.com",
   *   phone: "123456789",
   *   company: "Example Inc",
   *   notes: "Important contact",
   *   status: "CLIENT",
   * });
   */
  async execute(data: ContactCreateDTO): Promise<Contact> {
    logger.debug("CreateContact.execute called with data =", data);

    // 1. Check if a contact already exists with the given email
    const existing = await this.contactRepo.findByEmail(data.email);
    if (existing) {
      logger.info(
        `CreateContact: contact with email ${data.email} already exists, throwing conflict error`
      );
      throw new AppError(
        `Unable to create contact. A contact with email ${data.email} already exists.`,
        409
      );
    }

    // 2. Create a new contact via the repository
    const newContact = await this.contactRepo.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      notes: data.notes,
      status: data.status ?? "PROSPECT",
    });

    logger.info("CreateContact: new contact created with id =", newContact.id);
    return newContact;
  }
}
