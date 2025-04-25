"use client";

import { Button } from "@/components/atoms/Button";
import { ContactListContainer } from "@/components/containers/contact/ContactListContainer";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Page component displaying a paginated list of contacts.
 *
 * Uses ContactListContainer to fetch and render contacts with pagination, search, and filters.
 * Provides an Add Contact button to navigate to creation page.
 *
 * @component ContactsPage
 * @returns {JSX.Element}
 */
export default function ContactsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Header and container handle data fetching, deletion, and pagination internally
  return (
    <section className="max-w-4xl mx-auto py-10 space-y-6">
      {/* Header with title and CTA */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Contacts</h1>
        <Button onClick={() => router.push("/contacts/new")}>
          Add Contact
        </Button>
      </div>

      {/* Contact list and pagination handled in container */}
      <ContactListContainer />
    </section>
  );
}
