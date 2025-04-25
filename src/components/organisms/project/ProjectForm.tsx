// src/components/forms/ProjectForm.tsx

"use client";

import {
  projectFormSchema,
  ProjectFormValues,
} from "@/core/domain/project/validation/projectFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/atoms/Button";
import { InputField } from "@/components/molecules/InputField";
import { SelectField } from "@/components/molecules/SelectField";
import { TextareaField } from "@/components/molecules/TextareaField";
import { DatePickerField } from "@/components/molecules/DatePickerField";
import { Select } from "@/components/atoms/Select";

/**
 * Props for the ProjectForm component.
 *
 * @typedef {Object} ProjectFormProps
 * @property {Partial<ProjectFormValues>} [initialValues] - Optional default values for form fields.
 * @property {(values: ProjectFormValues) => void} onSubmit - Handler to call on form submission.
 * @property {string} [submitLabel] - Custom label for the submit button.
 */
type ProjectFormProps = {
  initialValues?: Partial<ProjectFormValues>;
  onSubmit: (values: ProjectFormValues) => void;
  submitLabel?: string;
};

/**
 * ProjectForm
 *
 * UI component for creating or editing a project.
 * Handles form state and validation using React Hook Form and Zod.
 *
 * @component
 * @param {ProjectFormProps} props
 * @returns {JSX.Element}
 */
export function ProjectForm({
  initialValues,
  onSubmit,
  submitLabel = "Save",
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      amount: 0,
      dueDate: undefined,
      status: "PENDING",
      contactId: "",
      ...initialValues,
    },
  });

  // Watch status field to control Select value
  const status = watch("status");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title field */}
      <InputField
        id="title"
        label="Project title"
        error={errors.title?.message}
        {...register("title")}
      />

      {/* Description field */}
      <TextareaField
        id="description"
        label="Description"
        error={errors.description?.message}
        {...register("description")}
      />

      {/* Amount field */}
      <InputField
        id="amount"
        label="Amount"
        type="number"
        error={errors.amount?.message}
        {...register("amount", { valueAsNumber: true })}
      />

      {/* Due date field */}
      <DatePickerField
        id="dueDate"
        label="Due date"
        error={errors.dueDate?.message}
        selected={watch("dueDate") ? new Date(watch("dueDate")!) : undefined}
        onChange={(date) =>
          setValue("dueDate", date ? date.toISOString() : undefined)
        }
      />

      {/* Status select */}
      <SelectField
        id="status"
        label="Status"
        value={status}
        onChange={(value) =>
          setValue("status", value as ProjectFormValues["status"])
        }
        error={errors.status?.message}
      >
        <Select.Item value="PENDING">Pending</Select.Item>
        <Select.Item value="IN_PROGRESS">In Progress</Select.Item>
        <Select.Item value="COMPLETED">Completed</Select.Item>
        <Select.Item value="CANCELLED">Cancelled</Select.Item>
      </SelectField>

      {/* Contact ID field */}
      <InputField
        id="contactId"
        label="Contact ID"
        error={errors.contactId?.message}
        {...register("contactId")}
      />

      {/* Submit button */}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
