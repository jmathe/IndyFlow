// src/components/organisms/ProjectList.tsx

"use client";

import { Input } from "@/components/atoms/Input";
import { Pagination } from "@/components/molecules/Pagination";
import { Accordion } from "@/components/ui/accordion";
import { ProjectDTO } from "@/core/domain/project/types";
import logger from "@/lib/logger";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ProjectAccordionItem } from "./ProjectAccordionItem";

/**
 * Props for the ProjectList component.
 *
 * @interface ProjectListProps
 * @property {ProjectDTO[]} projects - Array of projects to display.
 * @property {(id: string) => void} onDelete - Callback invoked when deleting a project.
 * @property {number} page - Current page number (1-indexed).
 * @property {number} totalCount - Total number of projects across all pages.
 * @property {number} pageSize - Number of projects per page.
 * @property {(newPage: number) => void} onPageChange - Callback to change the current page.
 */
interface ProjectListProps {
  projects: ProjectDTO[];
  onDelete: (id: string) => void;
  page: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
}

/**
 * Component displaying a paginated, searchable list of projects.
 * Each project is presented with action buttons (view, edit, delete).
 *
 * @component ProjectList
 * @param {ProjectListProps} props - Component props.
 * @returns {JSX.Element} Searchable and paginated project list UI.
 */
export function ProjectList({
  projects,
  onDelete,
  page,
  totalCount,
  pageSize,
  onPageChange,
}: ProjectListProps) {
  const router = useRouter();

  // Search query state
  const [search, setSearch] = useState<string>("");

  // Memoized search filtering
  const filtered = useMemo(() => {
    return projects.filter((project) => {
      const titleMatch = project.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const descriptionMatch = (project.description ?? "")
        .toLowerCase()
        .includes(search.toLowerCase());
      return titleMatch || descriptionMatch;
    });
  }, [projects, search]);

  /**
   * Trigger the onDelete callback for a project.
   */
  const handleDelete = (id: string) => {
    logger.warn("ProjectList: delete requested", { id });
    onDelete(id);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      {/* 🔍 Search bar */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <Input
          placeholder="Search by title or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2"
        />
      </div>

      {/* 📋 Project list entries */}
      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm">No projects found.</p>
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {filtered.map((project) => (
            <ProjectAccordionItem
              key={project.id}
              project={project}
              onDelete={handleDelete}
            />
          ))}
        </Accordion>
      )}

      {/* 📄 Pagination Controls */}
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
