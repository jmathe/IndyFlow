// src/app/projects/[id]/edit/page.tsx

import { ProjectFormEditContainer } from "@/components/containers/project/ProjectFormEditContainer";

import { Metadata } from "next";
export const generateMetadata = (): Metadata => ({
  title: "Edit Project | IndyFlow",
  description: "Update project information in IndyFlow.",
});

/**
 * Page component for editing a project.
 *
 * Uses a container to:
 * - Fetch project data based on URL parameter
 * - Display and manage the project form
 * - Submit the update request
 *
 * @component EditProjectPage
 * @returns {JSX.Element}
 */
export default function EditProjectPage() {
  return (
    <section className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit project</h1>
      <ProjectFormEditContainer />
    </section>
  );
}
