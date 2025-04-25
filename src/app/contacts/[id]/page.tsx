// src/app/contacts/[id]/page.tsx

"use client";

import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { useContact } from "@/hooks/contact/useContact";
import { useDeleteContact } from "@/hooks/contact/useDeleteContact";
import logger from "@/lib/logger";
import { useParams, useRouter } from "next/navigation";

/**
 * Page component for displaying detailed information about a contact.
 *
 * This page:
 * - Fetches contact information using the useContact hook
 * - Allows editing and deletion of the contact
 * - Redirects back to contact list on deletion
 *
 * @component ContactProfilePage
 * @returns {JSX.Element} The contact detail page.
 */
export default function ContactProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: contact, isLoading, isError } = useContact(id);
  const { mutate: deleteContact } = useDeleteContact();

  /**
   * Handles contact deletion and redirects to the contact list on success.
   */
  const handleDelete = (): void => {
    logger.warn("ContactProfilePage: deleting contact", { id });
    deleteContact(id);
    router.push("/contacts");
  };

  /**
   * Redirects to the edit page for this contact.
   */
  const handleEdit = (): void => {
    logger.info("ContactProfilePage: navigating to edit", { id });
    router.push(`/contacts/${id}/edit`);
  };

  if (isLoading) return <p>Loading contact...</p>;
  if (isError || !contact)
    return <p className="text-destructive">Error loading contact.</p>;

  return (
    <section className="max-w-2xl mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{contact.name}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <p>
          <strong>Email:</strong> {contact.email}
        </p>
        {contact.phone && (
          <p>
            <strong>Phone:</strong> {contact.phone}
          </p>
        )}
        {contact.company && (
          <p>
            <strong>Company:</strong> {contact.company}
          </p>
        )}
        {contact.notes && (
          <p>
            <strong>Notes:</strong> {contact.notes}
          </p>
        )}
        <Badge variant="secondary">{contact.status}</Badge>
      </div>
    </section>
  );
}
