// src/components/containers/project/ProjectFormCreateContainer.tsx

"use client";

import { ProjectForm } from "@/components/organisms/project/ProjectForm";
import { CreateProjectPayload } from "@/core/domain/project/types";
import { ProjectFormValues } from "@/core/domain/project/validation/projectFormSchema";
import { useCreateProject } from "@/hooks/project/useCreateProject";
import logger from "@/lib/logger";
import { useRouter } from "next/navigation";

/**
 * Container for the project creation form.
 *
 * Handles:
 * - Data transformation from form values to DTO
 * - API interaction via mutation hook
 * - Success/error feedback handling
 *
 * @component ProjectFormCreateContainer
 * @returns {JSX.Element} The form wrapped inside a container
 */
export function ProjectFormCreateContainer() {
  const router = useRouter();
  const { mutateAsync: createProject } = useCreateProject();

  /**
   * Handles project form submission.
   *
   * - Transforms form values into a valid DTO
   * - Calls the mutation hook to create a new project
   * - Manages success and error notifications
   *
   * @param {ProjectFormValues} values - Submitted form values
   * @returns {Promise<void>}
   */
  const handleSubmit = async (values: CreateProjectPayload): Promise<void> => {
    logger.debug("ProjectFormCreateContainer: Submitting project", values);

    const payload: CreateProjectPayload = {
      title: values.title,
      description: values.description,
      amount: values.amount,
      dueDate: values.dueDate ?? undefined,
      status: values.status ?? "PENDING",
      contactId: values.contactId,
      promoteContact: values.promoteContact,
    };

    // use the hook to create the project
    await createProject(payload);
    router.push("/projects");
  };

  return <ProjectForm onSubmit={handleSubmit} submitLabel="Create project" />;
}
