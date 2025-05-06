// src/components/containers/project/ProjectListByContactContainer.tsx

"use client";

import { ProjectListByContact } from "@/components/organisms/project/ProjectListByContact";
import { useListProjectsByContact } from "@/hooks/project/useListProjectsByContact";
import { validateId } from "@/lib/validateId";

/**
 * Props for the ProjectListByContactContainer.
 *
 * @interface ProjectListByContactContainerProps
 * @property {string} contactId - ID of the contact whose projects are displayed.
 */
interface ProjectListByContactContainerProps {
  contactId: string;
}

/**
 * Container to manage the project list associated with a contact.
 *
 * Responsibilities:
 * - Validate provided contact ID
 * - Fetch projects using useListProjectsByContact
 * - Handle loading and error states
 *
 * @component ProjectListByContactContainer
 * @param {ProjectListByContactContainerProps} props
 * @returns {JSX.Element}
 */
export function ProjectListByContactContainer({
  contactId,
}: ProjectListByContactContainerProps) {
  // Validate the provided contact ID
  validateId(contactId);

  // Fetch projects associated with the contact
  const { data, isLoading, isError } = useListProjectsByContact(contactId);

  if (isLoading) {
    return <p className="text-muted-foreground">Loading projects...</p>;
  }

  if (isError || !data) {
    return (
      <p className="text-destructive">
        Failed to load projects for this contact.
      </p>
    );
  }

  return <ProjectListByContact projects={data.data} />;
}
