// src/app/page.tsx

"use client";

import { Button } from "@/components/atoms/Button";
import { useRouter } from "next/navigation";

/**
 * Home page of the application.
 *
 * This landing page allows the user to navigate to the contact and project management modules.
 *
 * @component Home
 * @returns {JSX.Element} The home screen with a welcome message and navigation buttons.
 */
export default function Home() {
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
