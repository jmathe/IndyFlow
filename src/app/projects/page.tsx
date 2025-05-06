// src/app/projects/page.tsx

import { ProjectsPageClient } from "@/components/pages/projects/ProjectsPageClient";

import { Metadata } from "next";
export const generateMetadata = (): Metadata => ({
  title: "My Projects | IndyFlow",
  description: "Manage your projects efficiently with IndyFlow.",
});

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
  return <ProjectsPageClient />;
}
