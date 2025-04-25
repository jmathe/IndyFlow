// src/components/organisms/project/ProjectListByContact.tsx

"use client";

import { Button } from "@/components/atoms/Button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProjectDTO } from "@/core/domain/project/types";
import { useDeleteProject } from "@/hooks/project/useDeleteProject";
import { formatCurrency } from "@/lib/formatters/currencyFormatter";
import { formatDate } from "@/lib/formatters/dateFormatter";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Props for the ProjectListByContact component.
 *
 * @typedef {Object} ProjectListByContactProps
 * @property {ProjectDTO[]} projects - The list of projects to display.
 */
interface ProjectListByContactProps {
  projects: ProjectDTO[];
}

/**
 * Displays a list of projects related to a contact, each inside an expandable accordion card.
 *
 * @component ProjectListByContact
 * @param {ProjectListByContactProps} props
 * @returns {JSX.Element}
 */
export function ProjectListByContact({ projects }: ProjectListByContactProps) {
  const router = useRouter();
  const { mutate: deleteProject } = useDeleteProject();

  /**
   * Navigate to project edit page.
   *
   * @param {string} id - Project ID
   */
  const handleEdit = (id: string): void => {
    router.push(`/projects/${id}/edit`);
  };

  /**
   * Trigger deletion of a project.
   *
   * @param {string} id - Project ID
   */
  const handleDelete = (id: string): void => {
    deleteProject(id);
  };

  if (projects.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No projects associated with this contact.
      </p>
    );
  }

  return (
    <Accordion type="multiple" className="space-y-4">
      {projects.map((project) => (
        <AccordionItem
          key={project.id}
          value={project.id}
          className="border rounded-lg p-4"
        >
          <AccordionTrigger className="flex flex-col text-left">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">
              <div>
                <h3 className="font-semibold text-lg">{project.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {project.status} -{" "}
                  {project.dueDate
                    ? formatDate(project.dueDate)
                    : "No due date"}
                </p>
              </div>
              <div className="text-sm font-medium text-primary">
                {formatCurrency(project.amount ?? 0)}
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="mt-4 space-y-3">
            {/* Description */}
            {project.description && (
              <p className="text-muted-foreground text-sm">
                {project.description}
              </p>
            )}

            {/* Additional metadata */}
            <div className="text-sm space-y-1">
              <p>
                <span className="font-semibold">Contact ID:</span>{" "}
                {project.contactId}
              </p>
              <p>
                <span className="font-semibold">Created at:</span>{" "}
                {formatDate(project.createdAt)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(project.id)}
                aria-label="Edit project"
              >
                <PencilIcon className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(project.id)}
                aria-label="Delete project"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
