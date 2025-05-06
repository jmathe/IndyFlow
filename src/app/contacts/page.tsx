// src/app/contacts/page.tsx

import { ContactsPageClient } from "@/components/pages/contacts/ContactsPageClient";
import { Metadata } from "next";
export const generateMetadata = (): Metadata => ({
  title: "My Contacts | IndyFlow",
  description: "Manage your contacts efficiently with IndyFlow.",
});

/**
 * Server-side entry point for the contact list page.
 *
 * - Declares metadata for SEO
 * - Renders the client-side page component (ContactsPageClient)
 *
 * @component ContactsPage
 * @returns {JSX.Element}
 */
export default function ContactsPage() {
  // Display the client-side page component
  return <ContactsPageClient />;
}
