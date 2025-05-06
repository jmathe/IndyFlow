// src/app/contacts/[id]/page.tsx

import { ContactProfilePageClient } from "@/components/pages/contacts/ContactProfilePageClient";
import { Metadata } from "next";
export const generateMetadata = (): Metadata => ({
  title: "Contact Profile | IndyFlow",
  description: "View contact details and related projects.",
});

/**
 * Page component for displaying a contact profile and associated projects.
 *
 * - Renders the ContactProfileContainer
 * - Renders the ProjectListByContactContainer
 *
 * @component ContactProfilePage
 * @returns {JSX.Element}
 */
export default function ContactProfilePage() {
  return <ContactProfilePageClient />;
}
