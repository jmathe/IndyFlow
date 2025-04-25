// src/components/containers/ContactProfileContainer.tsx

"use client";

import { ContactProfile } from "@/components/organisms/contact/ContactProfile";
import { useContact } from "@/hooks/contact/useContact";
import { useDeleteContact } from "@/hooks/contact/useDeleteContact";
import { useParams, useRouter } from "next/navigation";

/**
 * Container for the contact profile page.
 *
 * Handles:
 * - ID validation
 * - Contact retrieval via useContact
 * - Deletion logic via useDeleteContact
 * - Navigation and notification
 *
 * @component ContactProfileContainer
 * @returns {JSX.Element} The rendered contact profile
 */
export function ContactProfileContainer() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: contact, isLoading, isError } = useContact(id);
  const { mutate: deleteContact } = useDeleteContact();

  /**
   * Handler to delete a contact and redirect to the list on success.
   *
   * @param {string} id - Contact ID to delete
   */
  const handleDelete = (id: string) => {
    deleteContact(id, {
      onSuccess: () => {
        router.push("/contacts");
      },
    });
  };

  // Loading state
  if (isLoading) return <p>Loading contact...</p>;
  if (isError || !contact) return <p>Failed to load contact.</p>;

  return <ContactProfile contact={contact} onDelete={handleDelete} />;
}
