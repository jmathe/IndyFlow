// src/components/organisms/project/ProjectAccordionItem.tsx

"use client";

import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProjectDTO } from "@/core/domain/project/types";
import { formatCurrency } from "@/lib/formatters/currencyFormatter";
import { formatDate } from "@/lib/formatters/dateFormatter";
import logger from "@/lib/logger";
import { cn } from "@/lib/utils";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Props for the ProjectAccordionItem component.
 *
 * @interface ProjectAccordionItemProps
 * @property {ProjectDTO} project - The project to display.
 * @property {(id: string) => void} onDelete - Callback for deleting the project.
 * @property {string} [className] - Optional CSS class for additional styling.
 */
interface ProjectAccordionItemProps {
  project: ProjectDTO;
  onDelete: (id: string) => void;
  className?: string;
}

/**
 * ProjectAccordionItem
 *
 * Displays detailed information about a project inside an accordion.
 * Provides actions to edit or delete the project.
 *
 * @component
 * @param {ProjectAccordionItemProps} props - Component props
 * @returns {JSX.Element} Rendered project accordion item
 */
export function ProjectAccordionItem({
  project,
  onDelete,
  className,
}: ProjectAccordionItemProps) {
  const router = useRouter();

  /**
   * Navigate to the project edit page (/projects/:id/edit).
   */
  const handleEdit = () => {
    logger.info("ProjectAccordionItem: navigating to edit", { id: project.id });
    router.push(`/projects/${project.id}/edit`);
  };

  /**
   * Trigger project deletion.
   */
  const handleDelete = () => {
    logger.warn("ProjectAccordionItem: delete requested", { id: project.id });
    onDelete(project.id);
  };

  return (
    <AccordionItem
      key={project.id}
      value={project.id}
      className={cn("border rounded-lg p-4", className)}
    >
      <AccordionTrigger className="group cursor-pointer">
        <div className="flex w-full justify-between items-start">
          {/* Left section: title, date, amount */}
          <div className="flex flex-col text-left">
            <h3 className="font-semibold text-lg text-primary transition-all duration-200 underline-offset-4 group-hover:underline">
              {project.title}
            </h3>

            <p className="text-sm text-muted-foreground mt-1">
              {project.dueDate ? formatDate(project.dueDate) : "No due date"}
            </p>

            <div className="text-sm font-medium text-primary mt-1">
              {formatCurrency(project.amount ?? 0)}
            </div>
          </div>

          {/* Right section: status badge */}
          <Badge variant="outline" className="text-sm">
            {project.status}
          </Badge>
        </div>
      </AccordionTrigger>

      <AccordionContent className="mt-4 space-y-3">
        {project.description && (
          <p className="text-muted-foreground text-sm">{project.description}</p>
        )}

        <div className="text-sm space-y-1">
          <p>
            <span className="font-semibold">Contact:</span>{" "}
            {project.contactName}
          </p>
          <p>
            <span className="font-semibold">Created at:</span>{" "}
            {formatDate(project.createdAt)}
          </p>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={handleEdit}
            aria-label={`Edit ${project.title}`}
          >
            <PencilIcon className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            aria-label={`Delete ${project.title}`}
          >
            <TrashIcon className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
