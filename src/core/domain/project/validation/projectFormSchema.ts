// src/core/domain/project/validation/projectFormSchema.ts

import { ProjectStatus } from "@/generated/prisma";
import { z } from "zod";

/**
 * Base schema without additional cross-field validation.
 * Used as foundation for both create and update schemas.
 *
 * @constant projectbaseSchema
 */
export const projectBaseSchema = z.object({
  /**
   * The project's title. Must be at least 1 character long.
   */
  title: z.string().min(1, "A project title is required."),

  /**
   * Optional description of the project.
   */
  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters.")
    .optional(),

  /**
   * Optional amount planned for the project. Must be a positive number if provided.
   */
  amount: z
    .number({ invalid_type_error: "The amount must be a valid number." })
    .positive("The amount must be greater than zero.")
    .optional(),

  /**
   * Optional due date in ISO string format. Must be a valid date if provided.
   * If filled, must be a valid future or present date.
   */
  dueDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid date format.",
    })
    .refine(
      (val) => {
        if (!val) return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to compare only dates
        const due = new Date(val);
        return due >= today;
      },
      {
        message: "Due date must be today or in the future.",
      }
    ),

  /**
   * The project's status.
   * Must be one of the defined ProjectStatus enum values.
   */
  status: z.nativeEnum(ProjectStatus, {
    errorMap: () => ({ message: "Invalid status." }),
  }),

  /**
   * The ID of the associated contact. Must be a non-empty CUID string.
   */
  contactId: z.string().cuid({ message: "Invalid contact ID." }),
});

/**
 * Full schema used for project creation.
 * Applies additional global rules.
 *
 *  @constant projectFormSchema
 */
export const projectFormSchema = projectBaseSchema.refine(
  (data) => !["COMPLETED", "CANCELLED"].includes(data.status) || !!data.dueDate,
  {
    message: "Due date is required when the project is completed or cancelled.",
    path: ["dueDate"],
  }
);

/**
 * Schema used for project update (PATCH or PUT).
 * Fields are optional because user might update only a part.
 */
export const projectUpdateSchema = projectBaseSchema.partial().extend({
  promoteContact: z.boolean().optional(),
});

/**
 * Types automatically inferred from schemas.
 */
export type ProjectFormValues = z.infer<typeof projectFormSchema>;
export type ProjectUpdateValues = z.infer<typeof projectUpdateSchema>;
