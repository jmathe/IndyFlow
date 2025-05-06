// src/components/containers/project/ProjectFormEditContainer.tsx

"use client";

import { ProjectForm } from "@/components/organisms/project/ProjectForm";
import { UpdateProjectPayload } from "@/core/domain/project/types";
import { useProject } from "@/hooks/project/useProject";
import { useUpdateProject } from "@/hooks/project/useUpdateProject";
import { validateId } from "@/lib/validateId";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
/**
 * Container component to manage project editing.
 *
 * - Fetches project data by ID via useProject
 * - Submits updates via useUpdateProject
 * - Handles loading, error states, and redirection
 *
 * @component ProjectFormEditContainer
 * @returns {JSX.Element}
 */
export function ProjectFormEditContainer() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  // Validate project ID on mount
  useEffect(() => {
    try {
      validateId(id);
    } catch {
      router.push("/projects");
    }
  }, [id, router]);

  // Fetch project details
  const { data: project, isLoading } = useProject(id);

  // Setup mutation hook for updating the project
  const { mutateAsync: updateProject } = useUpdateProject();

  /**
   * Submit handler to update the project.
   *
   * @param {} values - Form values to update
   */
  const handleUpdate = async (values: UpdateProjectPayload) => {
    const payload: UpdateProjectPayload = {
      title: values.title,
      description: values.description,
      amount: values.amount,
      dueDate: values.dueDate ?? undefined,
      status: values.status,
      contactId: values.contactId,
      promoteContact: values.promoteContact,
    };

    await updateProject({ id, data: payload });
    router.push("/projects");
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Loading project...</p>;
  }

  if (!project) {
    return <p className="text-destructive">Project not found.</p>;
  }

  return (
    <ProjectForm
      initialValues={project}
      onSubmit={handleUpdate}
      submitLabel="Update project"
    />
  );
}
