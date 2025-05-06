// src/components/containers/ContactFormEditContainer.tsx

"use client";

import { ContactForm } from "@/components/organisms/contact/ContactForm";
import { ContactUpdateDTO } from "@/core/domain/contact/types";
import { ContactFormValues } from "@/core/domain/contact/validation/contactFormSchema";
import { useContact } from "@/hooks/contact/useContact";
import { useUpdateContact } from "@/hooks/contact/useUpdateContact";
import { validateId } from "@/lib/validateId";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Container component to manage contact editing.
 *
 * - Fetches contact data by ID via useContact
 * - Submits updates via useUpdateContact
 * - Handles loading, errors, and redirection
 *
 * @component ContactFormEditContainer
 * @returns {JSX.Element}
 */
export function ContactFormEditContainer() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  // Validate contact ID
  useEffect(() => {
    try {
      validateId(id);
    } catch {
      router.push("/contacts");
    }
  }, [id, router]);

  // Fetch contact data from API
  const { data: contact, isLoading } = useContact(id);

  // Mutation hook to update contact
  const { mutateAsync: updateContact } = useUpdateContact();

  /**
   * Submit handler for contact update
   *
   * @param {ContactFormValues} values - Form values for contact update
   */
  const handleUpdate = async (values: ContactFormValues) => {
    const payload: ContactUpdateDTO = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      company: values.company,
      notes: values.notes,
      status: values.status,
    };

    await updateContact({ id, data: payload });
    router.push("/contacts");
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  if (!contact) {
    return <p className="text-destructive">Contact not found.</p>;
  }

  return (
    <ContactForm
      initialValues={contact}
      onSubmit={handleUpdate}
      submitLabel="Update contact"
    />
  );
}
