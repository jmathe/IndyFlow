// src/components/containers/ProjectListContainer.tsx

"use client";

import { ProjectList } from "@/components/organisms/project/ProjectList";
import { useDeleteProject } from "@/hooks/project/useDeleteProject";
import { useListProjects } from "@/hooks/project/useListProjects";
import { useState } from "react";

/**
 * Container component for the project list screen.
 *
 * Responsibilities:
 * - Fetch paginated projects using useListProjects
 * - Handle deletion using useDeleteProject
 * - Forward data and events to ProjectList component
 *
 * @component ProjectListContainer
 * @returns {JSX.Element} The rendered project list container
 */
export function ProjectListContainer() {
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  // Fetch projects (with pagination)
  const { data, isLoading, isError } = useListProjects({
    page,
    limit: pageSize,
  });

  // Setup mutation hook for deletion
  const { mutate: deleteProject } = useDeleteProject();

  /**
   * Wrapper for deletion logic, passed to UI.
   *
   * @param {string} id - ID of the project to delete
   */
  const handleDelete = (id: string): void => {
    deleteProject(id);
  };

  // UI fallback for loading state
  if (isLoading) return <p>Loading projects...</p>;
  if (isError || !data) return <p>Error during project listing.</p>;

  return (
    <ProjectList
      projects={data.data}
      onDelete={handleDelete}
      page={page}
      totalCount={data.totalCount}
      pageSize={pageSize}
      onPageChange={setPage}
    />
  );
}
