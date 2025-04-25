// src/app/projects/page.tsx
"use client";

import { Button } from "@/components/atoms/Button";
import { ProjectListContainer } from "@/components/containers/project/ProjectListContainer";
import { useRouter } from "next/navigation";

/**
 * Page component displaying a paginated list of projects.
 *
 * Uses ProjectListContainer to fetch and render projects with pagination, search, and filters.
 * Provides an Add Project button to navigate to the creation page.
 *
 * @component ProjectsPage
 * @returns {JSX.Element}
 */
export default function ProjectsPage() {
  const router = useRouter();

  return (
    <section className="max-w-4xl mx-auto py-10 space-y-6">
      {/* Header with title and CTA */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Projects</h1>
        <Button onClick={() => router.push("/projects/new")}>
          Add Project
        </Button>
      </div>

      {/* Project list and pagination handled inside the container */}
      <ProjectListContainer />
    </section>
  );
}
