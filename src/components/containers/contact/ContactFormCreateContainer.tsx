// src/components/containers/ContactFormContainer.tsx

"use client";

import { ContactForm } from "@/components/organisms/contact/ContactForm";
import { ContactCreateDTO } from "@/core/domain/contact/types";
import { ContactFormValues } from "@/core/domain/contact/validation/contactFormSchema";
import { useCreateContact } from "@/hooks/contact/useCreateContact";
import logger from "@/lib/logger";
import { useRouter } from "next/navigation";

/**
 * Container for the contact creation form.
 *
 * Handles:
 * - data transformation
 * - API interaction via mutation hook
 * - success/error handling
 *
 * @component ContactFormContainer
 * @returns {JSX.Element} The container-wrapped form
 */
export function ContactFormCreateContainer() {
  const router = useRouter();
  const { mutateAsync: createContact } = useCreateContact();

  /**
   * Handles form submission:
   * - Converts form values into DTO
   * - Calls mutation hook
   * - Handles error and success feedback
   *
   * @param {ContactFormValues} values
   * @returns {Promise<void>}
   */
  const handleSubmit = async (values: ContactFormValues): Promise<void> => {
    logger.debug("ContactFormContainer: submitting", values);

    // create the contactDTO for creation
    const contactDTO: ContactCreateDTO = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      company: values.company,
      notes: values.notes,
      status: values.status ?? "PROSPECT",
    };

    // call the hook to create the contact
    await createContact(contactDTO);
    router.push("/contacts");
  };

  return <ContactForm onSubmit={handleSubmit} submitLabel="Create contact" />;
}
