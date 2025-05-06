// src/app/contacts/new/page.tsx

import { ContactFormCreateContainer } from "@/components/containers/contact/ContactFormCreateContainer";
import { Metadata } from "next";
export const generateMetadata = (): Metadata => ({
  title: "Create Contact | IndyFlow",
  description: "Create contact in IndyFlow.",
});

/**
 * Page for creating a new contact.
 *
 * This page:
 * - Displays a ContactFormContainer that handles contact creation
 * - Delegates business logic to hook and service layers
 * - Uses React Query and follows the clean architecture pattern
 *
 * @component NewContactPage
 * @returns {JSX.Element} The contact creation page
 */
export default function NewContactPage() {
  return (
    <section className="max-w-xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold">New Contact</h1>

      {/* Form logic is handled by the container */}
      <ContactFormCreateContainer />
    </section>
  );
}
