"use client";

import { Button } from "@/components/atoms/Button";
import { useRouter } from "next/navigation";

/**
 * Client-side landing page component.
 *
 * - Uses `useRouter` to handle client-side navigation
 * - Offers buttons to access contact and project management modules
 *
 * @component HomePageClient
 * @returns {JSX.Element} Landing screen with navigation buttons
 */
export function HomePageClient() {
  const router = useRouter();

  /**
   * Redirects the user to the contact management page.
   *
   * @function handleNavigateToContacts
   * @returns {void}
   */
  const handleNavigateToContacts = (): void => {
    router.push("/contacts");
  };

  /**
   * Redirects the user to the project management page.
   *
   * @function handleNavigateToProjects
   * @returns {void}
   */
  const handleNavigateToProjects = (): void => {
    router.push("/projects");
  };

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-8">
      <h1 className="text-3xl font-bold">Welcome to IndyFlow</h1>

      {/* CTA to go to the contacts page */}
      <Button onClick={handleNavigateToContacts}>View All Contacts</Button>

      {/* CTA to go to the projects page */}
      <Button onClick={handleNavigateToProjects}>View All Projects</Button>
    </div>
  );
}
