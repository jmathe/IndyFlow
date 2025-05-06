// src/components/pages/ContactsPageClient.tsx

"use client";

import { Button } from "@/components/atoms/Button";
import { ContactListContainer } from "@/components/containers/contact/ContactListContainer";
import { useRouter } from "next/navigation";

/**
 * Client-side page component for listing contacts.
 *
 * Responsibilities:
 * - Displays the header and CTA to create a new contact
 * - Delegates data fetching, filters, and pagination to ContactListContainer
 * - Handles navigation using useRouter (client-only hook)
 *
 * @component ContactsPageClient
 * @returns {JSX.Element} Fully interactive UI for managing contacts
 */
export function ContactsPageClient() {
  const router = useRouter();

  return (
    <section className="max-w-4xl mx-auto py-10 space-y-6">
      {/* 🔹 Header and CTA */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Contacts</h1>
        <Button onClick={() => router.push("/contacts/new")}>
          Add Contact
        </Button>
      </div>

      {/* 🔹 List container handles data, filters, pagination */}
      <ContactListContainer />
    </section>
  );
}
