// src/components/forms/ProjectForm.tsx

"use client";

import {
  projectFormSchema,
  ProjectFormValues,
} from "@/core/domain/project/validation/projectFormSchema";
import { ProjectStatus } from "@/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/atoms/Button";
import { Select } from "@/components/atoms/Select";
import { DatePickerField } from "@/components/molecules/DatePickerField";
import { InputField } from "@/components/molecules/InputField";
import { SelectField } from "@/components/molecules/SelectField";
import { TextareaField } from "@/components/molecules/TextareaField";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ALLOWED_STATUSES,
  formatStatusLabel,
} from "@/core/domain/project/constants/ProjectStatusOptions";
import { useListContactsForProjectForm } from "@/hooks/project/useListContactsForProjectForm";
import logger from "@/lib/logger";
import { CheckIcon, XIcon } from "lucide-react";
import { useState } from "react";

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
  onSubmit: (values: ProjectFormValues & { promoteContact?: boolean }) => void;
  submitLabel?: string;
};

/**
 * ProjectForm
 *
 * Form to create or edit a project, with business rules:
 * - Cannot accept project for a prospect without confirmation
 * - Prevent invalid combinations
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

  const { data: contacts, isLoading } = useListContactsForProjectForm();

  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [pendingValues, setPendingValues] = useState<ProjectFormValues | null>(
    null
  );

  const status = watch("status");
  const selectedContactId = watch("contactId");

  const selectedContact = contacts?.find(
    (contact) => contact.id === selectedContactId
  );

  /**
   * Handles form submission validation rules.
   * If project is accepted and contact is a prospect, shows confirmation.
   */
  const handleValidationAndSubmit = (values: ProjectFormValues) => {
    logger.debug("handleValidationAndSubmit called with values =", values);
    if (!selectedContact) return;

    // If project is accepted or in progress, and contact is a prospect, shows confirmation
    if (
      (values.status === "ACCEPTED" || values.status === "IN_PROGRESS") &&
      selectedContact.status === "PROSPECT"
    ) {
      setPendingValues(values);
      logger.debug("handleValidationAndSubmit: showing promotion dialog");
      setShowPromotionDialog(true);
      return;
    }

    onSubmit(values);
  };

  /**
   * Confirms promotion of a prospect to client, submits form.
   */
  const confirmPromotion = () => {
    if (pendingValues) {
      logger.debug("confirmPromotion: promoting contact : ", pendingValues);
      logger.debug("confirmPromotion: promoteContact =", true);
      // Passing the promoteContact flag to launch the use-case
      onSubmit({ ...pendingValues, promoteContact: true });
      setPendingValues(null);
    }
    setShowPromotionDialog(false);
  };

  /**
   * Cancels promotion, returns to editing form.
   */
  const cancelPromotion = () => {
    setPendingValues(null);
    setShowPromotionDialog(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleValidationAndSubmit)}
        className="space-y-4"
      >
        {/* Project title */}
        <InputField
          id="title"
          label="Project title"
          error={errors.title?.message}
          {...register("title")}
        />

        {/* Project description */}
        <TextareaField
          id="description"
          label="Description"
          error={errors.description?.message}
          {...register("description")}
        />

        {/* Project amount */}
        <InputField
          id="amount"
          label="Amount"
          type="number"
          error={errors.amount?.message}
          {...register("amount", { valueAsNumber: true })}
        />

        {/* Project due date */}
        <DatePickerField
          id="dueDate"
          label="Due date"
          error={errors.dueDate?.message}
          selected={watch("dueDate") ? new Date(watch("dueDate")!) : undefined}
          onChange={(date) =>
            setValue("dueDate", date ? date.toISOString() : undefined)
          }
        />

        {/* Project status selection */}
        <SelectField
          id="status"
          label="status"
          value={status}
          onChange={(value) => setValue("status", value as ProjectStatus)}
          error={errors.status?.message}
          aria-label="Project status"
        >
          {ALLOWED_STATUSES.map((status) => (
            <Select.Item key={status} value={status}>
              {formatStatusLabel(status)}
            </Select.Item>
          ))}
        </SelectField>

        {/* Contact selection */}
        {isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : contacts && contacts.length > 0 ? (
          <SelectField
            id="contactId"
            label="Assign to Contact"
            value={selectedContactId}
            onChange={(value) => setValue("contactId", value)}
            error={errors.contactId?.message}
          >
            {contacts.map((contact) => (
              <Select.Item key={contact.id} value={contact.id}>
                {contact.name} ({contact.status})
              </Select.Item>
            ))}
          </SelectField>
        ) : (
          <p className="text-muted-foreground text-sm">
            No available contacts to assign.
          </p>
        )}

        {/* Submit button */}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {submitLabel}
        </Button>
      </form>

      {/* Promotion confirmation dialog */}
      <Dialog open={showPromotionDialog} onOpenChange={setShowPromotionDialog}>
        <DialogContent aria-describedby="promotion-description">
          <DialogHeader>
            <DialogTitle>Promote Prospect to Client?</DialogTitle>
          </DialogHeader>
          <p
            id="promotion-description"
            className="text-sm text-muted-foreground"
          >
            {pendingValues
              ? generatePromotionDialogMessage(pendingValues.status)
              : ""}
          </p>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={cancelPromotion}
              aria-label="Cancel promotion"
            >
              <XIcon className="w-4 h-4" />
            </Button>
            <Button onClick={confirmPromotion} aria-label="Confirm promotion">
              <CheckIcon className="w-4 h-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// generate a message based on the project status
const generatePromotionDialogMessage = (status: ProjectStatus): string => {
  switch (status) {
    case "ACCEPTED":
      return "This project is accepted but linked to a prospect. Would you like to promote the contact to client?";
    case "IN_PROGRESS":
      return "This project is starting (in progress) but linked to a prospect. Would you like to promote the contact to client?";
    default:
      return "Would you like to promote the contact to client?";
  }
};
