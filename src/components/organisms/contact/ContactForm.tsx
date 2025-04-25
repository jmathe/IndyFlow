// src/components/forms/ContactForm.tsx

"use client";

import {
  contactFormSchema,
  ContactFormValues,
} from "@/core/domain/contact/validation/contactFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/atoms/Button";
import { Select } from "@/components/atoms/Select";
import { InputField } from "@/components/molecules/InputField";
import { SelectField } from "@/components/molecules/SelectField";
import { TextareaField } from "@/components/molecules/TextareaField";

/**
 * Props for the ContactForm component.
 *
 * @typedef {Object} ContactFormProps
 * @property {Partial<ContactFormValues>} [initialValues] - Default field values
 * @property {(values: ContactFormValues) => void} onSubmit - Form submission handler
 * @property {string} [submitLabel] - Text for the submit button
 */
type ContactFormProps = {
  initialValues?: Partial<ContactFormValues>;
  onSubmit: (values: ContactFormValues) => void;
  submitLabel?: string;
};

/**
 * ContactForm
 *
 * UI component for creating or editing a contact.
 * Handles local form state and validation with React Hook Form and Zod.
 *
 * @component
 * @param {ContactFormProps} props
 * @returns {JSX.Element}
 */
export function ContactForm({
  initialValues,
  onSubmit,
  submitLabel = "Save",
}: ContactFormProps) {
  // Form state
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      notes: "",
      status: "PROSPECT",
      ...initialValues,
    },
  });

  // watch for status changes
  const status = watch("status");

  return (
    // Form with validation and error handling
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Error messages */}
      <InputField
        id="name"
        label="Name"
        error={errors.name?.message}
        {...register("name")}
      />

      {/* Fields */}
      <InputField
        id="email"
        label="Email address"
        type="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <InputField
        id="phone"
        label="Phone number"
        error={errors.phone?.message}
        {...register("phone")}
      />

      <InputField
        id="company"
        label="Enterprise"
        error={errors.company?.message}
        {...register("company")}
      />

      <TextareaField
        id="notes"
        label="Notes"
        error={errors.notes?.message}
        {...register("notes")}
      />

      <SelectField
        id="status"
        label="Status"
        value={status}
        onChange={(value) =>
          setValue("status", value as ContactFormValues["status"])
        }
        error={errors.status?.message}
      >
        <Select.Item value="PROSPECT">Prospect</Select.Item>
        <Select.Item value="CLIENT">Client</Select.Item>
      </SelectField>

      {/* Submit button */}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
