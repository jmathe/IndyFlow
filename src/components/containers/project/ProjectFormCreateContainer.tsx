// src/components/containers/project/ProjectFormCreateContainer.tsx

"use client";

import { ProjectForm } from "@/components/organisms/project/ProjectForm";
import { ProjectCreateDTO } from "@/core/domain/project/types";
import { ProjectFormValues } from "@/core/domain/project/validation/projectFormSchema";
import { useCreateProject } from "@/hooks/project/useCreateProject";
import { AppError } from "@/lib/errors/AppError";
import logger from "@/lib/logger";
import { notify } from "@/lib/notify";
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
  const handleSubmit = async (values: ProjectFormValues): Promise<void> => {
    logger.debug("ProjectFormCreateContainer: Submitting project", values);

    const projectDTO: ProjectCreateDTO = {
      title: values.title,
      description: values.description,
      amount: values.amount,
      dueDate: values.dueDate ?? undefined,
      status: values.status ?? "PENDING",
      contactId: values.contactId,
    };

    try {
      await createProject(projectDTO);
      router.push("/projects");
    } catch (error) {
      logger.error(
        "ProjectFormCreateContainer: Error during project creation",
        error
      );

      const message =
        error instanceof AppError
          ? error.message
          : (error as Error).message || "An unexpected error occurred.";

      notify.error("Creation failed", message);
    }
  };

  return <ProjectForm onSubmit={handleSubmit} submitLabel="Create project" />;
}
