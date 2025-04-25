// src/components/containers/ContactFormContainer.tsx

"use client";

import { ContactForm } from "@/components/organisms/contact/ContactForm";
import { ContactCreateDTO } from "@/core/domain/contact/types";
import { ContactFormValues } from "@/core/domain/contact/validation/contactFormSchema";
import { useCreateContact } from "@/hooks/contact/useCreateContact";
import { AppError } from "@/lib/errors/AppError";
import logger from "@/lib/logger";
import { notify } from "@/lib/notify";
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

    try {
      // call the hook to create the contact
      await createContact(contactDTO);
      // redirect to the contacts page
      router.push("/contacts");
    } catch (error) {
      logger.error("ContactFormContainer: error during submission", error);

      if (error instanceof AppError) {
        notify.error("Error", error.message);
      } else {
        notify.error(
          "Error",
          (error as Error).message || "An unexpected error occurred."
        );
      }
    }
  };

  return <ContactForm onSubmit={handleSubmit} submitLabel="Create contact" />;
}
