// src/components/pages/ProjectsPageClient.tsx
"use client";

import { Button } from "@/components/atoms/Button";
import { ProjectListContainer } from "@/components/containers/project/ProjectListContainer";
import { useRouter } from "next/navigation";

/**
 * Client-only component responsible for:
 * - Navigating to the project creation page
 * - Rendering the list of projects (pagination, filters, actions)
 *
 * Uses a container to encapsulate all business logic (data fetching, search, deletion, etc.).
 *
 * @component ProjectsPageClient
 * @returns {JSX.Element} The UI section for listing and managing projects
 */
export function ProjectsPageClient() {
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
