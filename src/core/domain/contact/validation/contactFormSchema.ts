// src/core/contact/validation/contactFormSchema.ts

import { z } from "zod";

/**
 * Zod schema for validating contact form data.
 * Ensures that user input meets defined requirements before submission.
 *
 * @constant contactFormSchema
 */
export const contactFormSchema = z.object({
  /**
   * The contact's name. Must be at least 2 characters long.
   * @type {string}
   */
  name: z.string().min(2, "A contact name is required."),

  /**
   * The contact's email. Must be a valid email format.
   * @type {string}
   */
  email: z.string().email("Invalid email address."),

  /**
   * Optional phone number. If provided, must be a string of 10 digits.
   * @type {string | undefined}
   */
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{10}$/.test(val), {
      message: "Phone number must contain 10 digits.",
    }),

  /**
   * Optional company name.
   * @type {string | undefined}
   */
  company: z.string().optional(),

  /**
   * Optional internal notes about the contact.
   * @type {string | undefined}
   */
  notes: z.string().optional(),

  /**
   * The contact's status. Must be either "PROSPECT" or "CLIENT".
   * @type {"PROSPECT" | "CLIENT"}
   */
  status: z.enum(["PROSPECT", "CLIENT"], {
    errorMap: () => ({ message: "Invalid status." }),
  }),
});

/**
 * Type representing the validated contact form values.
 * Automatically inferred from the Zod schema.
 *
 * @type ContactFormValues
 */
export type ContactFormValues = z.infer<typeof contactFormSchema>;
