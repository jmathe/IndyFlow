// src/components/containers/ContactListContainer.tsx

"use client";

import { ContactList } from "@/components/organisms/contact/ContactList";
import { useDeleteContact } from "@/hooks/contact/useDeleteContact";
import { useListContacts } from "@/hooks/contact/useListContacts";
import { useState } from "react";

/**
 * Container component for the contact list screen.
 *
 * Responsibilities:
 * - Fetch paginated contacts using useListContacts
 * - Handle deletion using useDeleteContact
 * - Forward data and events to ContactList component
 *
 * @component ContactListContainer
 * @returns {JSX.Element} The rendered contact list container
 */
export function ContactListContainer() {
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  // Fetch contacts (with pagination)
  const { data, isLoading, isError } = useListContacts({
    page,
    limit: pageSize,
  });

  // Setup mutation hook for deletion
  const { mutate: deleteContact } = useDeleteContact();

  /**
   * Wrapper for deletion logic, passed to UI.
   *
   * @param {string} id - ID of the contact to delete
   */
  const handleDelete = (id: string): void => {
    deleteContact(id);
  };

  // UI fallback for loading state
  if (isLoading) return <p>Loading contacts...</p>;
  if (isError || !data) return <p>Error during contact listing.</p>;

  return (
    <ContactList
      contacts={data.data}
      onDelete={handleDelete}
      page={page}
      totalCount={data.totalCount}
      pageSize={pageSize}
      onPageChange={setPage}
    />
  );
}
