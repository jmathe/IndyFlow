// src/app/contacts/[id]/edit/page.tsx

"use client";

import { ContactFormEditContainer } from "@/components/containers/contact/ContactFormEditContainer";

/**
 * Page component for editing a contact.
 *
 * Uses a container to:
 * - Load the contact data
 * - Display the form
 * - Handle the update logic
 *
 * @component EditContactPage
 * @returns {JSX.Element}
 */
export default function EditContactPage() {
  return (
    <section className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit contact</h1>
      <ContactFormEditContainer />
    </section>
  );
}
