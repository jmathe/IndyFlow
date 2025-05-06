// src/app/contacts/[id]/edit/page.tsx

import { ContactFormEditContainer } from "@/components/containers/contact/ContactFormEditContainer";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => ({
  title: "Edit Contact | IndyFlow",
  description: "Update contact information in IndyFlow.",
});

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
