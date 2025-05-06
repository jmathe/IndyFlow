// src/core/domain/project/entities/Project.ts

import {
  ProjectDB,
  ProjectDTO,
  ProjectUpdateDTO,
} from "@/core/domain/project/types";
import { ProjectStatus } from "@/generated/prisma";

/**
 * Represents a project in the business domain.
 * Contains methods and business logic to manage a project.
 *
 * @class Project
 */
export class Project {
  readonly id: string;
  title: string;
  description?: string;
  amount?: number;
  dueDate?: string;
  status: ProjectStatus;
  readonly contactId: string;
  readonly createdAt: string;
  readonly contactName: string;

  /**
   * Initializes a Project entity from a DTO.
   *
   * @param {ProjectDTO} params - Data required to construct the project.
   */
  constructor(params: ProjectDTO) {
    this.id = params.id;
    this.title = params.title;
    this.description = params.description;
    this.amount = params.amount;
    this.dueDate = params.dueDate;
    this.status = params.status;
    this.contactId = params.contactId;
    this.createdAt = params.createdAt;
    this.contactName = params.contactName;
  }

  /**
   * Factory method to create a Project from a database record.
   *
   * @param {ProjectDB} params - Raw database record.
   * @returns {Project} - New Project instance.
   */
  static fromDB(params: ProjectDB): Project {
    const dto: ProjectDTO = {
      id: params.id,
      title: params.title,
      description: params.description ?? undefined,
      amount: params.amount ?? undefined,
      dueDate: params.dueDate?.toISOString(),
      status: params.status,
      contactId: params.contactId,
      createdAt: params.createdAt.toISOString(),
      contactName: params.contact?.name ?? "Unknown Contact",
    };
    return new Project(dto);
  }

  /**
   * Converts this Project to a DTO for API responses.
   *
   * @returns {ProjectDTO}
   */
  toDTO(): ProjectDTO {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      amount: this.amount,
      dueDate: this.dueDate,
      status: this.status,
      contactId: this.contactId,
      createdAt: this.createdAt,
      contactName: this.contactName,
    };
  }

  /**
   * Updates mutable fields of the project.
   *
   * @param {ProjectUpdateDTO} data - Partial update data.
   */
  update(data: ProjectUpdateDTO): void {
    if (data.title !== undefined) this.title = data.title;
    if (data.description !== undefined) this.description = data.description;
    if (data.amount !== undefined) this.amount = data.amount;
    if (data.dueDate !== undefined) this.dueDate = data.dueDate;
    if (data.status !== undefined) this.status = data.status;
  }

  /**
   * Marks the project as in progress.
   */
  start(): void {
    if (this.status === ProjectStatus.PENDING) {
      this.status = ProjectStatus.IN_PROGRESS;
    }
  }

  /**
   * Completes the project.
   */
  complete(): void {
    if (this.status === ProjectStatus.IN_PROGRESS) {
      this.status = ProjectStatus.COMPLETED;
    }
  }

  /**
   * Cancels the project.
   */
  cancel(): void {
    if (
      this.status === ProjectStatus.PENDING ||
      this.status === ProjectStatus.IN_PROGRESS
    ) {
      this.status = ProjectStatus.CANCELLED;
    }
  }
}
