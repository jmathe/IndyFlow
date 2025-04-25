// src/app/projects/new/page.tsx

"use client";

import { ProjectFormCreateContainer } from "@/components/containers/project/ProjectFormCreateContainer";

/**
 * Page for creating a new project.
 *
 * This page:
 * - Renders a ProjectFormContainer that handles creation logic
 * - Delegates API and validation responsibilities to hooks and services
 * - Implements clean architecture principles with React Query
 *
 * @component NewProjectPage
 * @returns {JSX.Element} The project creation page
 */
export default function NewProjectPage() {
  return (
    <section className="max-w-xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold">New Project</h1>

      {/* Form logic and submission are encapsulated in the container */}
      <ProjectFormCreateContainer />
    </section>
  );
}
