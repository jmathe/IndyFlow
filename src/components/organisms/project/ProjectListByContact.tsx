// src/components/organisms/project/ProjectListByContact.tsx

"use client";

import { Accordion } from "@/components/ui/accordion";
import { ProjectDTO } from "@/core/domain/project/types";
import { useDeleteProject } from "@/hooks/project/useDeleteProject";
import { ProjectAccordionItem } from "./ProjectAccordionItem";

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
  const { mutate: deleteProject } = useDeleteProject();

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
        <ProjectAccordionItem
          key={project.id}
          project={project}
          onDelete={handleDelete}
        />
      ))}
    </Accordion>
  );
}
