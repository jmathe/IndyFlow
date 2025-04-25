// src/components/organisms/ProjectList.tsx

"use client";

import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Pagination } from "@/components/molecules/Pagination";
import { ProjectDTO } from "@/core/domain/project/types";
import logger from "@/lib/logger";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

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
      const desc = project.description ? project.description : "";
      const matchesSearch =
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.description
          ? desc.toLowerCase().includes(search.toLowerCase())
          : "";
      return matchesSearch;
    });
  }, [projects, search]);

  /**
   * Navigate to project detail page (/projects/:id)
   */
  const handleView = (id: string) => {
    logger.info("ProjectList: navigating to project profile", { id });
    router.push(`/projects/${id}`);
  };

  /**
   * Navigate to project edit page (/projects/:id/edit)
   */
  const handleEdit = (id: string) => {
    logger.info("ProjectList: navigating to edit project", { id });
    router.push(`/projects/${id}/edit`);
  };

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
      <ul className="space-y-4">
        {filtered.length === 0 && (
          <p className="text-muted-foreground text-sm">No projects found.</p>
        )}

        {filtered.map((project) => (
          <li
            key={project.id}
            className="border rounded-lg px-4 py-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div>
              <button
                type="button"
                onClick={() => handleView(project.id)}
                className="text-left hover:underline"
              >
                <h3 className="font-semibold text-lg text-primary">
                  {project.title}
                </h3>
              </button>
              <p className="text-muted-foreground text-sm">
                {project.description}
              </p>
              <Badge variant="secondary" className="mt-1">
                {project.status}
              </Badge>
            </div>

            <div className="flex gap-2 items-center">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleView(project.id)}
                aria-label={`View project ${project.title}`}
              >
                <EyeIcon className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleEdit(project.id)}
                aria-label={`Edit project ${project.title}`}
              >
                <PencilIcon className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleDelete(project.id)}
                aria-label={`Delete project ${project.title}`}
                className="hover:bg-destructive/20"
              >
                <TrashIcon className="w-5 h-5" />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {/* 📄 Pagination Controls */}
      <Pagination
        page={page}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </div>
  );
}
