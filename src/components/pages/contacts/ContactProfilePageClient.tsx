// src/components/pages/ContactProfilePageClient.tsx
"use client";

import { ContactProfileContainer } from "@/components/containers/contact/ContactProfileContainer";
import { ProjectListByContactContainer } from "@/components/containers/project/ProjectListByContactContainer";
import { useParams } from "next/navigation";

/**
 * Client-side component responsible for rendering:
 * - the full contact profile (ContactProfileContainer)
 * - the list of associated projects (ProjectListByContactContainer)
 *
 * ⚠️ This component must be client-only due to usage of the `useParams()` hook
 * from `next/navigation` which relies on runtime routing context.
 *
 * @function ContactProfilePageClient
 * @returns {JSX.Element} A composed page section with contact + related projects
 */
export function ContactProfilePageClient() {
  // 🧩 Extract the dynamic contact ID from the URL parameters (client-side only)
  const params = useParams();
  const contactId = params?.id as string | undefined;

  // 🛑 Fallback rendering if ID is missing or invalid
  if (!contactId) {
    return <p className="text-destructive">Invalid contact ID.</p>;
  }

  return (
    <section className="max-w-4xl mx-auto py-10 space-y-10">
      {/* 🔹 Section 1: contact profile information (read-only) */}
      <ContactProfileContainer />

      {/* 🔹 Section 2: list of projects assigned to this contact */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <ProjectListByContactContainer contactId={contactId} />
      </div>
    </section>
  );
}
