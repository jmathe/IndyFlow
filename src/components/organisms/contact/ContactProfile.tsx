"use client";

import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ContactDTO } from "@/core/domain/contact/types";
import logger from "@/lib/logger";
import { useRouter } from "next/navigation";

/**
 * Props for the ContactProfile component.
 *
 * @interface ContactProfileProps
 * @property {ContactDTO} contact - The contact to display.
 * @property {(id: string) => void} onDelete - Callback for deleting the contact.
 */
interface ContactProfileProps {
  contact: ContactDTO;
  onDelete: (id: string) => void;
}

/**
 * Displays full information about a single contact.
 * Provides buttons for editing and deleting the contact.
 *
 * @component ContactProfile
 * @param {ContactProfileProps} props - Component props.
 * @returns {JSX.Element} Rendered contact profile.
 */
export function ContactProfile({ contact, onDelete }: ContactProfileProps) {
  const router = useRouter();

  /**
   * Navigate to edit page for the contact.
   */
  const handleEdit = () => {
    logger.info("ContactProfile: navigating to edit", { id: contact.id });
    router.push(`/contacts/${contact.id}/edit`);
  };

  /**
   * Trigger contact deletion.
   */
  const handleDelete = () => {
    logger.warn("ContactProfile: delete requested", { id: contact.id });
    onDelete(contact.id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{contact.name}</h2>
        <Badge variant="secondary" className="mt-1">
          {contact.status}
        </Badge>
      </div>

      <div className="space-y-1 text-sm">
        <p>Email: {contact.email}</p>
        {contact.phone && <p>Phone: {contact.phone}</p>}
        {contact.company && <p>Company: {contact.company}</p>}
        {contact.notes && <p>Notes: {contact.notes}</p>}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleEdit}
          aria-label={`Edit ${contact.name}`}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          aria-label={`Delete ${contact.name}`}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
