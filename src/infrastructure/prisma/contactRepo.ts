// src/infrastructure/prisma/contactRepo.ts

import { Contact } from "@/core/domain/contact/entities/Contact";
import { ContactRepository } from "@/core/domain/contact/ports/contactRepository";
import {
  ContactCreateDTO,
  ContactDB,
  ContactUpdateDTO,
} from "@/core/domain/contact/types";
import { FindManyParams } from "@/core/shared/types/pagination";
import { AppError } from "@/lib/errors/AppError";
import logger from "@/lib/logger";
import { prisma } from "@/lib/prismaSingleton";

/**
 * Concrete implementation of ContactRepository using Prisma.
 * Provides all CRUD operations for the `contact` table.
 * @constant contactRepo
 * @implements {ContactRepository}
 */
export const contactRepo: ContactRepository = {
  /**
   * Creates a new contact in the database via Prisma.
   * @function create
   * @param {ContactCreateDTO} data - Data required to create the contact.
   * @returns {Promise<Contact>} A promise resolving to the created Contact entity.
   */
  async create(data: ContactCreateDTO): Promise<Contact> {
    logger.debug("contactRepo.create called with", data);
    try {
      const result: ContactDB = await prisma.contact.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          notes: data.notes,
          status: data.status ?? "PROSPECT",
        },
      });
      logger.info("contactRepo.create: contact created, id =", result.id);
      return Contact.fromDB(result);
    } catch (error) {
      logger.error(
        "contactRepo.create: error creating contact in the database",
        error
      );
      throw new AppError("Error creating contact in the database", 500);
    }
  },

  /**
   * Finds a contact by its email.
   * @function findByEmail
   * @param {string} email - The email of the contact to find.
   * @returns {Promise<Contact | null>} The Contact entity or null if not found.
   */
  async findByEmail(email: string): Promise<Contact | null> {
    logger.debug("contactRepo.findByEmail called with email =", email);
    try {
      const result: ContactDB | null = await prisma.contact.findUnique({
        where: { email },
      });
      if (!result) {
        logger.info(
          "contactRepo.findByEmail: no contact found for email =",
          email
        );
        return null;
      }
      logger.info("contactRepo.findByEmail: contact found, id =", result.id);
      return Contact.fromDB(result);
    } catch (error) {
      logger.error(
        "contactRepo.findByEmail: error fetching contact by email",
        error
      );
      throw new AppError(
        "Error fetching contact by email from the database",
        500
      );
    }
  },

  /**
   * Finds a contact by its ID.
   * @function findById
   * @param {string} id - The unique identifier of the contact to find.
   * @returns {Promise<Contact | null>} The Contact entity or null if not found.
   */
  async findById(id: string): Promise<Contact | null> {
    logger.debug("contactRepo.findById called with id =", id);
    try {
      const result: ContactDB | null = await prisma.contact.findUnique({
        where: { id },
      });
      if (!result) {
        logger.info("contactRepo.findById: no contact found for id =", id);
        return null;
      }
      logger.info("contactRepo.findById: contact found, id =", result.id);
      return Contact.fromDB(result);
    } catch (error) {
      logger.error("contactRepo.findById: error fetching contact by ID", error);
      throw new AppError("Error fetching contact by ID from the database", 500);
    }
  },

  /**
   * Retrieves multiple contacts with pagination.
   * @function findMany
   * @param {FindManyParams} params - Pagination parameters (skip, take).
   * @returns {Promise<Contact[]>} A promise resolving to an array of Contact entities.
   */
  async findMany({ skip, take }: FindManyParams = {}): Promise<Contact[]> {
    logger.debug("contactRepo.findMany called with params =", { skip, take });
    try {
      const results: ContactDB[] = await prisma.contact.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take,
      });
      logger.info(
        "contactRepo.findMany: contacts retrieved, count =",
        results.length
      );
      return results.map((r) => Contact.fromDB(r));
    } catch (error) {
      logger.error("contactRepo.findMany: error fetching contacts list", error);
      throw new AppError("Error fetching contacts list from the database", 500);
    }
  },

  /**
   * Updates an existing contact with provided data.
   * @function update
   * @param {string} id - The ID of the contact to update.
   * @param {Partial<ContactUpdateDTO>} data - Data to update (partial).
   * @returns {Promise<Contact>} A promise resolving to the updated Contact entity.
   */
  async update(id: string, data: Partial<ContactUpdateDTO>): Promise<Contact> {
    logger.debug("contactRepo.update called with id =", id, "and data =", data);
    try {
      const updated: ContactDB = await prisma.contact.update({
        where: { id },
        data,
      });
      logger.info("contactRepo.update: contact updated, id =", updated.id);
      return Contact.fromDB(updated);
    } catch (error) {
      logger.error("contactRepo.update: error updating contact", error);
      throw new AppError("Error updating contact in the database", 500);
    }
  },

  /**
   * Deletes a contact from the database.
   * @function delete
   * @param {string} id - The ID of the contact to delete.
   * @returns {Promise<void>} A promise that resolves when deletion is complete.
   */
  async delete(id: string): Promise<void> {
    logger.debug("contactRepo.delete called with id =", id);
    try {
      await prisma.contact.delete({ where: { id } });
      logger.info("contactRepo.delete: contact deleted, id =", id);
    } catch (error) {
      logger.error("contactRepo.delete: error deleting contact", error);
      throw new AppError("Error deleting contact from the database", 500);
    }
  },

  /**
   * Counts the total number of contacts in the database.
   * @function count
   * @returns {Promise<number>} A promise resolving to the total contact count.
   */
  async count(): Promise<number> {
    logger.debug("contactRepo.count called");
    try {
      const total = await prisma.contact.count();
      logger.info("contactRepo.count: total contacts =", total);
      return total;
    } catch (error) {
      logger.error("contactRepo.count: error counting contacts", error);
      throw new AppError("Error counting contacts in the database", 500);
    }
  },
};
