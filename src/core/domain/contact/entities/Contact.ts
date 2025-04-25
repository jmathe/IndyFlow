// src/core/contact/entities/Contact.ts

import {
  ContactDB,
  ContactDTO,
  ContactUpdateDTO,
} from "@/core/domain/contact/types";
import { ContactStatus } from "@/generated/prisma";

/**
 * Represents a contact in the business domain.
 * Contains methods and business logic to manage a contact.
 *
 * @class Contact
 */
export class Contact {
  readonly id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  status: ContactStatus;
  readonly createdAt: string;

  /**
   * Initializes a Contact entity from a DTO.
   *
   * @param {ContactDTO} params - Data required to construct the contact.
   */
  constructor(params: ContactDTO) {
    this.id = params.id;
    this.name = params.name;
    this.email = params.email;
    this.phone = params.phone;
    this.company = params.company;
    this.notes = params.notes;
    this.status = params.status;
    this.createdAt = params.createdAt;
  }

  /**
   * Factory method to create a Contact from a database record.
   *
   * @param {ContactDB} params - Raw database record.
   * @returns {Contact} - New Contact instance.
   */
  static fromDB(params: ContactDB): Contact {
    const dto: ContactDTO = {
      id: params.id,
      name: params.name,
      email: params.email,
      phone: params.phone ?? undefined,
      company: params.company ?? undefined,
      notes: params.notes ?? undefined,
      status: params.status,
      createdAt: params.createdAt.toISOString(),
    };
    return new Contact(dto);
  }

  /**
   * Converts this Contact to a DTO for API responses.
   *
   * @returns {ContactDTO}
   */
  toDTO(): ContactDTO {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      company: this.company,
      notes: this.notes,
      status: this.status,
      createdAt: this.createdAt,
    };
  }

  /**
   * Updates mutable fields of the contact.
   *
   * @param {ContactUpdateDTO} data - Partial update data.
   */
  update(data: ContactUpdateDTO): void {
    if (data.name !== undefined) this.name = data.name;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.company !== undefined) this.company = data.company;
    if (data.notes !== undefined) this.notes = data.notes;
    if (data.status !== undefined) this.status = data.status;
  }

  /**
   * Promotes the contact status to CLIENT.
   */
  promoteToClient(): void {
    if (this.status !== "CLIENT") {
      this.status = "CLIENT";
    }
  }
}
