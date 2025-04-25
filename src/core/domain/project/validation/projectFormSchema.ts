// src/core/domain/project/validation/projectFormSchema.ts

import { ProjectStatus } from "@/generated/prisma";
import { z } from "zod";

/**
 * Zod schema for validating project form data.
 * Ensures user input meets defined requirements before submission.
 *
 * @constant projectFormSchema
 */
export const projectFormSchema = z.object({
  /**
   * The project's title. Must be at least 1 character long.
   */
  title: z.string().min(1, "A project title is required."),

  /**
   * Optional description of the project.
   */
  description: z.string().optional(),

  /**
   * Optional amount planned for the project. Must be a positive number if provided.
   */
  amount: z
    .number({ invalid_type_error: "The amount must be a valid number." })
    .positive("The amount must be greater than zero.")
    .optional(),

  /**
   * Optional due date in ISO string format. Must be a valid date if provided.
   */
  dueDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid date format.",
    }),

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
 * Type representing the validated project form values.
 * Automatically inferred from the Zod schema.
 *
 * @type ProjectFormValues
 */
export type ProjectFormValues = z.infer<typeof projectFormSchema>;
