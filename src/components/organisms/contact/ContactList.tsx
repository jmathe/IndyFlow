// src/components/organisms/ContactList.tsx

"use client";

import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Pagination } from "@/components/molecules/Pagination";
import { ContactDTO } from "@/core/domain/contact/types";
import { ContactStatus } from "@/generated/prisma";
import logger from "@/lib/logger";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

/**
 * Union type for filter values: either 'ALL' or a valid ContactStatus.
 */
type FilterStatus = "ALL" | ContactStatus;

/**
 * Props for the ContactList component.
 *
 * @interface ContactListProps
 * @property {ContactDTO[]} contacts - Array of contacts to display.
 * @property {(id: string) => void} onDelete - Callback invoked when deleting a contact.
 * @property {number} page - Current page number (1-indexed).
 * @property {number} totalCount - Total number of contacts across all pages.
 * @property {number} pageSize - Number of contacts per page.
 * @property {(newPage: number) => void} onPageChange - Callback to change the current page.
 */
interface ContactListProps {
  contacts: ContactDTO[];
  onDelete: (id: string) => void;
  page: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
}

/**
 * Component displaying a paginated, searchable, filterable list of contacts.
 * Each contact is presented with action buttons (view, edit, delete).
 *
 * @component ContactList
 * @param {ContactListProps} props - Component props.
 * @returns {JSX.Element} Filterable contact list UI with pagination.
 */
export function ContactList({
  contacts,
  onDelete,
  page,
  totalCount,
  pageSize,
  onPageChange,
}: ContactListProps) {
  const router = useRouter();

  // Search query state
  const [search, setSearch] = useState<string>("");
  // Status filter state: ALL or specific ContactStatus
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("ALL");

  // Memoized filtering logic
  const filtered = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesSearch =
        contact.name.toLowerCase().includes(search.toLowerCase()) ||
        contact.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || contact.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [contacts, search, statusFilter]);

  /**
   * Navigate to contact profile page (/contacts/:id)
   */
  const handleView = (id: string) => {
    logger.info("ContactList: navigating to contact profile", { id });
    router.push(`/contacts/${id}`);
  };

  /**
   * Navigate to contact edit page (/contacts/:id/edit)
   */
  const handleEdit = (id: string) => {
    logger.info("ContactList: navigating to edit contact", { id });
    router.push(`/contacts/${id}/edit`);
  };

  /**
   * Trigger the onDelete callback for a contact.
   */
  const handleDelete = (id: string) => {
    logger.warn("ContactList: delete requested", { id });
    onDelete(id);
  };

  // Generate status filter options from the contact list
  const statusOptions: FilterStatus[] = [
    "ALL",
    ...(Array.from(new Set(contacts.map((c) => c.status))) as ContactStatus[]),
  ];

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      {/* 🔍 Search bar and status filters */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <Input
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2"
        />
        <div className="flex gap-2">
          {statusOptions.map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              onClick={() => setStatusFilter(status)}
            >
              {status === "ALL" ? "All" : status}
            </Button>
          ))}
        </div>
      </div>

      {/* 📋 Contact list entries */}
      <ul className="space-y-4">
        {filtered.length === 0 && (
          <p className="text-muted-foreground text-sm">No contacts found.</p>
        )}

        {filtered.map((contact) => (
          <li
            key={contact.id}
            className="border rounded-lg px-4 py-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div>
              <button
                type="button"
                onClick={() => handleView(contact.id)}
                className="text-left hover:underline"
              >
                <h3 className="font-semibold text-lg text-primary">
                  {contact.name}
                </h3>
              </button>
              <p className="text-muted-foreground text-sm">{contact.email}</p>
              <Badge variant="secondary" className="mt-1">
                {contact.status}
              </Badge>
            </div>

            <div className="flex gap-2 items-center">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleView(contact.id)}
                aria-label={`View contact ${contact.name}`}
              >
                <EyeIcon className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleEdit(contact.id)}
                aria-label={`Edit contact ${contact.name}`}
              >
                <PencilIcon className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleDelete(contact.id)}
                aria-label={`Delete contact ${contact.name}`}
                className="hover:bg-destructive/20"
              >
                <TrashIcon className="w-5 h-5" />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {/* 📄 Pagination Controls */}
      <Pagination
        page={page}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </div>
  );
}
