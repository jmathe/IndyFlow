// src/components/containers/project/ProjectListByContactContainer.tsx

"use client";

import { ProjectListByContact } from "@/components/organisms/project/ProjectListByContact";
import { useListProjectsByContact } from "@/hooks/project/useListProjectsByContact";
import { validateId } from "@/lib/validateId";
import { useParams } from "next/navigation";
import { useEffect } from "react";

/**
 * Container to manage the project list associated with a contact.
 *
 * Responsibilities:
 * - Validate contact ID from URL
 * - Fetch projects using useListProjectsByContact
 * - Handle loading and error states
 *
 * @component ProjectListByContactContainer
 * @returns {JSX.Element}
 */
export function ProjectListByContactContainer() {
  const { id: contactId } = useParams<{ id: string }>();

  // Validate contact ID on load
  useEffect(() => {
    validateId(contactId);
  }, [contactId]);

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
